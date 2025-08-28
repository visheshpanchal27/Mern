import { motion } from 'framer-motion';
import { FaUsers, FaShoppingCart, FaStar, FaGift } from 'react-icons/fa';

const StatsSection = () => {
  const stats = [
    { icon: FaUsers, label: 'Happy Customers', value: '10K+', color: 'text-blue-400' },
    { icon: FaShoppingCart, label: 'Products Sold', value: '25K+', color: 'text-green-400' },
    { icon: FaStar, label: 'Average Rating', value: '4.8', color: 'text-yellow-400' },
    { icon: FaGift, label: 'Special Offers', value: '50+', color: 'text-pink-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="mt-12 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + (index * 0.1), duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <stat.icon className={`text-3xl ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsSection;