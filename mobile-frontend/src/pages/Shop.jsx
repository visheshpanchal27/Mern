import { useState, useEffect } from 'react'
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/apiSlice'
import ProductCard from '../components/ProductCard'
import { FaFilter, FaTimes, FaStore, FaSearch, FaSort, FaTh, FaList, FaStar, FaHeart, FaEye } from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Shop = () => {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }))
    }
  }, [searchParams])

  const { data: productsData, isLoading } = useGetProductsQuery({
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(searchTerm && { search: searchTerm })
  })

  const { data: categories } = useGetCategoriesQuery()

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' })
    setSearchTerm('')
    setShowFilters(false)
  }

  if (isLoading) {
    return (
      <div className="p-4 safe-area-top">
        <div className="animate-pulse grid grid-cols-2 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 h-64 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      {/* Advanced Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40 shadow-2xl">
        <div className="p-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <FaStore className="text-white" size={20} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Shop
                </h1>
              </div>
            </div>

            {/* View Toggle & Filter */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTh size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaList size={14} />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFilters(true)}
                className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FaFilter className="mr-2" size={14} />
                Filters
              </motion.button>
            </div>
          </div>

          {/* Search & Quick Actions */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search products, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center bg-gray-800 px-3 py-3 rounded-xl text-gray-300 hover:text-white transition-all"
            >
              <FaSort className="mr-2" size={14} />
              Sort
            </button>
          </div>

          {/* Quick Filters & Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-x-auto"></div>

            <div className="relative">
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 min-w-40"
                  >
                    {[
                      { value: 'relevance', label: 'Relevance' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Top Rated' },
                      { value: 'newest', label: 'Newest First' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <motion.div
          className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {productsData?.products?.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              {viewMode === 'grid' ? (
                <ProductCard product={product} />
              ) : (
                <div className="bg-gray-800 rounded-xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-all">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-bold">${product.price}</span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400" size={12} />
                          <span className="text-gray-400 text-xs ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all">
                          <FaHeart className="text-gray-400 hover:text-red-400" size={14} />
                        </button>
                        <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all">
                          <FaEye className="text-gray-400 hover:text-blue-400" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Filter Modal */}
      {showFilters && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-t from-gray-900 to-gray-800 w-full rounded-t-3xl p-6 safe-area-bottom border-t border-gray-600/50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Filters</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"
              >
                <FaTimes size={16} className="text-gray-300" />
              </motion.button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-300">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value="">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 text-gray-300">Price Range</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Clear All
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Shop
