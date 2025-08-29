import { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBox } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    // Fetch analytics data
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className={`text-3xl ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={analytics.totalUsers}
          color="text-blue-500"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={analytics.totalOrders}
          color="text-green-500"
        />
        <StatCard
          icon={FaDollarSign}
          title="Total Revenue"
          value={`$${analytics.totalRevenue?.toLocaleString()}`}
          color="text-yellow-500"
        />
        <StatCard
          icon={FaBox}
          title="Total Products"
          value={analytics.totalProducts}
          color="text-purple-500"
        />
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {analytics.recentOrders?.map((order) => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                  <p className="text-white font-medium">#{order._id.slice(-6)}</p>
                  <p className="text-gray-400 text-sm">{order.user?.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">${order.totalPrice}</p>
                  <p className="text-gray-400 text-sm">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          <div className="space-y-3">
            {analytics.topProducts?.map((product) => (
              <div key={product._id} className="flex items-center p-3 bg-gray-700 rounded">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm">{product.soldCount} sold</p>
                </div>
                <p className="text-green-400 font-medium">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;