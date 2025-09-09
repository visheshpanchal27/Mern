import { useState, useEffect, useMemo, useCallback } from "react"
import { useGetProductsQuery, useGetCategoriesQuery } from "../api/apiSlice"
import ProductCard from "../components/ProductCard"
import { FaSearch, FaTimes, FaStar } from "react-icons/fa"
import { motion } from "framer-motion"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]")
    } catch {
      return []
    }
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [minRating, setMinRating] = useState(0)

  const { data: productsData, isLoading } = useGetProductsQuery(
    {
      search: debouncedSearch,
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    },
    { skip: !debouncedSearch }
  )

  const { data: categories } = useGetCategoriesQuery()

  const popularSearches = ["iPhone", "Laptop", "Headphones", "Watch", "Camera", "Gaming"]

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      if (searchTerm && !recentSearches.includes(searchTerm)) {
        const updated = [searchTerm, ...recentSearches.slice(0, 4)]
        setRecentSearches(updated)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchTerm(suggestion)
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }, [])

  const sortedProducts = useMemo(() => {
    if (!productsData?.products) return []
    return [...productsData.products]
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          default:
            return 0
        }
      })
      .filter((product) => product.rating >= minRating)
  }, [productsData, sortBy, minRating])

  return (
    <div className="safe-area-top bg-gray-900 min-h-screen">
      <div className="bg-gray-800 p-4 sticky top-0">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          {searchTerm && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {debouncedSearch && (
        <div className="bg-gray-800 p-3 border-b border-gray-700">
          <div className="flex items-center space-x-3 overflow-x-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2 text-sm">
              <FaStar className="text-yellow-400" size={14} />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-gray-700 text-white px-2 py-2 rounded-lg border border-gray-600 focus:border-blue-500"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4★ & Up</option>
                <option value={3}>3★ & Up</option>
                <option value={2}>2★ & Up</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {!searchTerm && (
        <div className="p-4 bg-gray-800">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Recent Searches</span>
                <button onClick={clearRecentSearches} className="text-xs text-blue-400">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-300 block mb-2">Popular Searches</span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(search)}
                  className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {!searchTerm ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-blue-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Search Products</h2>
            <p className="text-gray-400 mb-6">Find what you're looking for</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 4).map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(search)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-white">{sortedProducts.length}</span> results for
                <span className="font-semibold text-blue-400"> "{searchTerm}"</span>
              </p>
              <div className="text-xs text-gray-400">Sorted by {sortBy.replace("-", " ")}</div>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">Try different keywords or check spelling</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setMinRating(0)
                setPriceRange([0, 1000])
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search