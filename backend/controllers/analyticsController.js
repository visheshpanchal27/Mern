import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModels.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModal.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id totalPrice isPaid isDelivered user createdAt');

    // Get top products (most ordered)
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { 
        $group: { 
          _id: '$orderItems.product',
          soldCount: { $sum: '$orderItems.qty' },
          revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
        }
      },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: '$productInfo._id',
          name: '$productInfo.name',
          image: '$productInfo.image',
          price: '$productInfo.price',
          soldCount: 1,
          revenue: 1
        }
      }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      topProducts
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});