import Order from "../models/orderModel.js";
import Product from "../models/productModal.js";
import Cart from "../models/cartModel.js";
import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid'; 
import mongoose from "mongoose";
import { sendOrderConfirmation, sendShippingNotification } from '../utils/emailService.js';

// Utility Function
function calcPrices(orderItems) {
  // Validate items
  if (!orderItems || orderItems.length === 0) {
    throw new Error("No order items provided");
  }

  const itemsPrice = orderItems.reduce((acc, item) => {
    if (item.price < 0 || item.qty < 0) {
      throw new Error("Invalid price or quantity");
    }
    return acc + (item.price * item.qty);
  }, 0);

  // Rest of the calculation remains the same
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, isBuyNow } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const trackingId = nanoid(10);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      trackingId,
    });

    const createdOrder = await order.save();
    
    // Only clear cart if this is NOT a buy now order
    if (!isBuyNow) {
      try {
        await Cart.findOneAndDelete({ user: req.user._id });
      } catch (cartError) {
        console.error('Failed to clear cart after order:', cartError);
      }
    }
    
    // Send order confirmation email
    try {
      const populatedOrder = await Order.findById(createdOrder._id).populate('user', 'email username');
      await sendOrderConfirmation(populatedOrder, populatedOrder.user.email);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find({}).populate("user", "id username");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const countTotalOrders = async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      res.json({ totalOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const calculateTotalSales = async (req, res) => {
    try {
      const orders = await Order.find();
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      res.json({ totalSales });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const calcualteTotalSalesByDate = async (req, res) => {
    try {
      const salesByDate = await Order.aggregate([
        {
          $match: {
            isPaid: true,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
            },
            totalSales: { $sum: "$totalPrice" },
          },
        },
      ]);
  
      res.json(salesByDate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      
      // Send shipping notification email
      try {
        const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'email username');
        await sendShippingNotification(populatedOrder, populatedOrder.user.email);
      } catch (emailError) {
        console.error('Failed to send shipping notification email:', emailError);
      }
      
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();

  res.json({ message: "Order removed" });
});

const getOrderByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const order = await Order.findOne({ trackingId }).populate("user", "username email");
    if (!order) {
      return res.status(404).json({ error: "Order not found with given trackingId" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    orderItems: [/* ... */],
    shippingAddress: {/* ... */},
    paymentMethod: { type: String, required: true },
    paymentResult: {/* ... */},
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },

    // ✅ New field
    trackingId: {
      type: String,
      required: true,
      unique: true,
      default: () => shortid.generate(),
    },
  },
  { timestamps: true }
);

// Buy Now - Direct order creation without cart
const createBuyNowOrder = async (req, res) => {
  try {
    const { productId, qty, shippingAddress, paymentMethod } = req.body;

    // Get product from database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create order item
    const orderItem = {
      product: productId,
      qty: qty || 1,
      price: product.price,
      name: product.name,
      image: product.image
    };

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices([orderItem]);
    const trackingId = nanoid(10);

    // Create order directly without touching cart
    const order = new Order({
      orderItems: [orderItem],
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      trackingId,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
    createOrder,
    createBuyNowOrder,
    getAllOrders, 
    getUserOrders, 
    countTotalOrders, 
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
    deleteOrder,
    getOrderByTrackingId,
    orderSchema, 
};
