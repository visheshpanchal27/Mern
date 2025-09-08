import Cart from '../models/cartModel.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // assuming user is authenticated

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart for this user
      cart = new Cart({
        user: userId,
        items: [{ product: productId, qty: quantity }]
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Increment quantity when product already exists
        existingItem.qty += quantity;
      } else {
        cart.items.push({ product: productId, qty: quantity });
      }
    }

    const updatedCart = await cart.save();
    const populatedCart = await Cart.findById(updatedCart._id).populate('items.product');
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { user: req.user._id, items: [] });
};

// Update entire cart (replace items)
export const updateCart = async (req, res) => {
  const { items } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items } },
    { new: true, upsert: true }
  );
  res.json(cart);
};

// Clear the cart
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};
