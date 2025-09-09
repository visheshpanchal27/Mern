import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/apiSlice'
import ProductCard from '../components/ProductCard'
import { FaFire, FaArrowRight, FaUser } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Home = () => {
  const { data: productsData, isLoading } = useGetProductsQuery({ limit: 8 })
  const { data: categories } = useGetCategoriesQuery()
  const { userInfo } = useSelector(state => state.auth)

  if (isLoading) {
    return (
      <div className="p-4 safe-area-top">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 h-48 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      {/* Enhanced Header */}
      <motion.div 
        className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur-2xl"></div>
        </div>
        
        {/* Logo and Brand */}
        <div className="flex items-center mb-6 relative z-10">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M8 20c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" fill="#2563eb" />
                <path d="M16 20c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" fill="#059669" />
                <path d="M12 16c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z" fill="none" stroke="#fff" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">INFINITY</div>
              <div className="text-xs font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">PLAZA</div>
            </div>
          </motion.div>
        </div>
        
        {/* Welcome Section */}
        <div className="text-center relative z-10">
          {userInfo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{userInfo.username}!</span>
              </h1>
              <p className="text-gray-300 text-lg">Ready to discover amazing products?</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Infinity Plaza</span>
              </h1>
              <p className="text-gray-300 text-lg">Discover amazing products and deals</p>
            </motion.div>
          )}
        </div>
      </motion.div>



      {/* Featured Products */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Featured Products</h2>
          <Link to="/shop" className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors">
            View All <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {productsData?.products?.slice(0, 8).map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link to="/shop" className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl text-center font-medium shadow-lg transition-all">
            Explore Products
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home