import { useState } from "react";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { FaDice, FaSpinner } from "react-icons/fa";

const RandomProductsDemo = () => {
  const [limit, setLimit] = useState(6);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: allProductsData, isLoading, error, refetch } = useAllProductsQuery();
  
  // Shuffle and limit the products on frontend
  const data = allProductsData ? {
    products: [...(allProductsData.products || allProductsData)].sort(() => Math.random() - 0.5).slice(0, limit),
    count: Math.min(limit, (allProductsData.products || allProductsData).length),
    limit: limit,
    timestamp: new Date().toISOString()
  } : null;

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    console.error('Random products API error:', error);
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-lg">
        <p>Error loading products: {error?.data?.message || error?.message || 'Unknown error'}</p>
        <p className="text-sm mt-2">Check console for details</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Random Products API Demo</h2>
        <div className="flex items-center gap-4">
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600"
          >
            <option value={3}>3 Products</option>
            <option value={6}>6 Products</option>
            <option value={10}>10 Products</option>
            <option value={20}>20 Products</option>
          </select>
          <motion.button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaDice />}
            {isLoading ? 'Loading...' : 'Get Random Products'}
          </motion.button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.products?.map((product, index) => (
            <motion.div
              key={`${product._id}-${refreshKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-pink-500/50 transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain bg-white rounded mb-4"
              />
              <h3 className="text-white font-semibold truncate mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-pink-400 font-bold">${product.price}</span>
                <span className="text-yellow-400 text-sm">★ {product.rating || 'N/A'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {data && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Showing {data.count} random products • Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default RandomProductsDemo;