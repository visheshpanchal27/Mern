import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setChecked } from "../redux/features/Shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaTimes, FaTh, FaList, FaRedo } from "react-icons/fa";

// Custom CSS for slider
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ec4899, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
  }
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ec4899, #8b5cf6);
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}

// Memoized ProductCard for better performance
const MemoizedProductCard = memo(({ product, viewMode, index }) => (
  <motion.div
    key={product._id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
    className={viewMode === 'list' ? 'w-full' : ''}
  >
    <ProductCard p={product} viewMode={viewMode} />
  </motion.div>
));

MemoizedProductCard.displayName = 'MemoizedProductCard';

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, checked } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const { data: productsData, isLoading, isError, refetch } = useAllProductsQuery();

  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);


  // Load categories
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);





  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleClearFilters = useCallback(() => {
    dispatch(setChecked([]));
    setPriceFilter("");
    setSortOrder("");
    setSearchTerm("");
    setPriceRange([0, 50000]);

  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Debounced search
  const debouncedSearchTerm = useMemo(() => {
    const timer = setTimeout(() => searchTerm, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Extract products from API response
  const allProducts = useMemo(() => {
    return productsData?.products || [];
  }, [productsData]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!allProducts?.length) return [];

    let filtered = [...allProducts];

    // Category filter
    if (checked.length > 0) {
      filtered = filtered.filter(product => {
        const categoryId = product.category?._id || product.category;
        return checked.includes(categoryId);
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Price input filter
    if (priceFilter) {
      const parsedPrice = parseFloat(priceFilter);
      if (!isNaN(parsedPrice)) {
        filtered = filtered.filter(product => product.price <= parsedPrice);
      }
    }

    // Sort
    if (sortOrder === "low-high") filtered.sort((a,b) => a.price - b.price);
    else if (sortOrder === "high-low") filtered.sort((a,b) => b.price - a.price);
    else if (sortOrder === "name-asc") filtered.sort((a,b) => a.name.localeCompare(b.name));
    else if (sortOrder === "name-desc") filtered.sort((a,b) => b.name.localeCompare(a.name));
    else if (sortOrder === "newest") filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [allProducts, searchTerm, priceRange, priceFilter, sortOrder, checked]);



  const uniqueBrands = useMemo(() => {
    return [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
  }, [allProducts]);

  const totalProducts = productsData?.total || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center ml-12 sm:ml-16 lg:ml-20">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center ml-12 sm:ml-16 lg:ml-20">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading products</div>
          <button
            onClick={handleRefresh}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <FaRedo size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] relative">
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6 ml-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-1">
          Shop Collection
        </h1>
        <p className="text-gray-400 text-sm md:text-base">Discover amazing products at great prices</p>
      </div>
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <div className="text-white font-medium">{filteredProducts.length} Products</div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
        >
          <FaFilter size={16} /> Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] p-4 lg:p-6 rounded-2xl w-full lg:w-[300px] xl:w-[320px] shrink-0 shadow-2xl border border-gray-800/50 lg:sticky lg:top-4 backdrop-blur-sm"
            >
              {/* Search */}
              <div className="mb-8 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0f0f0f] border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300"
                />
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></span>
                  Price Range
                </h3>
                <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-6 rounded-2xl border border-gray-700/30 shadow-inner">
                  {/* Min Price Input */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-2 block">Minimum Price</label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Max Price Slider */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 mb-2 block">Maximum Price</label>
                    <div className="relative">
                      <input
                        type="range"
                        min={priceRange[0]}
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #374151 0%, #374151 ${((priceRange[1] - priceRange[0]) / 50000) * 100}%, #ec4899 ${((priceRange[1] - priceRange[0]) / 50000) * 100}%, #8b5cf6 100%)`
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="flex justify-between items-center">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 rounded-lg border border-gray-600/30">
                      <span className="text-xs text-gray-400">Min</span>
                      <div className="text-white font-semibold">${priceRange[0].toLocaleString()}</div>
                    </div>
                    <div className="w-8 h-px bg-gradient-to-r from-pink-500 to-purple-500"></div>
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-2 rounded-lg shadow-lg">
                      <span className="text-xs text-pink-100">Max</span>
                      <div className="text-white font-semibold">${priceRange[1].toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {/* Quick Price Buttons */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000].map(price => (
                      <button
                        key={price}
                        onClick={() => setPriceRange([0, price])}
                        className="px-2 py-1 text-xs bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-purple-600/20 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700/30 hover:border-pink-500/30"
                      >
                        ${price.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <h2 className="text-center bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl mb-6 text-white font-bold shadow-lg cursor-default text-sm sm:text-base border border-pink-500/20">
                Filter by Categories
              </h2>
              <div className="space-y-2">
                {(showAllCategories ? categories : categories.slice(0,4))?.map(c => (
                  <label key={c._id} className="flex items-center gap-3 cursor-pointer text-white select-none p-3 rounded-lg hover:bg-[#0f0f0f] transition-all duration-300 border border-transparent hover:border-gray-800/50">
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      checked={checked.includes(c._id)}
                      className="w-5 h-5 rounded-lg border-2 border-pink-500/50 bg-transparent checked:bg-gradient-to-r checked:from-pink-500 checked:to-purple-500 checked:border-transparent transition-all duration-300 ease-in-out hover:scale-110 focus:ring-2 focus:ring-pink-500/30 cursor-pointer"
                    />
                    <span className="text-sm cursor-pointer font-medium">{c.name}</span>
                  </label>
                ))}
              </div>
              {categories.length > 5 && (
                <button
                  className="text-pink-400 text-xs mt-2 hover:underline transition cursor-pointer"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? "Show Less" : "Show More"}
                </button>
              )}

              {/* Brands */}
              <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg cursor-default">
                Filter by Brands
              </h2>
              <div className="space-y-3">
                {(showAllBrands ? uniqueBrands : uniqueBrands.slice(0,4))?.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer text-white select-none">
                    <input
                      type="radio"
                      name="brand"
                      onChange={() => {
                        setSearchTerm(brand);
                      }}
                      className="appearance-none w-5 h-5 rounded-full border-2 border-pink-500 checked:bg-pink-500 transition-all duration-300 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-pink-500 cursor-pointer"
                    />
                    <span className="text-sm cursor-pointer">{brand}</span>
                  </label>
                ))}
              </div>
              {uniqueBrands.length > 5 && (
                <button
                  className="text-pink-400 text-xs mt-2 hover:underline transition cursor-pointer"
                  onClick={() => setShowAllBrands(!showAllBrands)}
                >
                  {showAllBrands ? "Show Less" : "Show More"}
                </button>
              )}

              {/* Price Filter Input */}
              <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg cursor-default">
                Filter by Price
              </h2>
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-pink-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-text"
              />

              {/* Sort Products */}
              <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg cursor-default">
                Sort Products
              </h2>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-pink-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Clear Filters */}
              <button
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 mt-8 font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-pink-500/20"
                onClick={handleClearFilters}
              >
                <FaTimes size={14} />
                Clear All Filters
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products Section */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">
                {filteredProducts.length} of {totalProducts} Products
              </h2>
              {searchTerm && (
                <p className="text-sm text-gray-400">
                  Results for <span className="text-pink-400 font-medium">"{searchTerm}"</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode */}
              <div className="flex bg-[#0f0f0f] rounded-xl p-1 border border-gray-800/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaTh size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaList size={16} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#0f0f0f] border border-gray-800/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                : "space-y-6"
              }
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} viewMode={viewMode} />
                ))
              ) : !allProducts.length ? (
                <motion.div className="col-span-full text-center py-12">
                  <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
                    <p className="text-gray-400 mb-4">Check back later for new products</p>
                    <button
                      onClick={handleRefresh}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaRedo size={14} />
                      Refresh
                    </button>
                  </div>
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-md mx-auto">
                    <FaSearch className="text-4xl text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm 
                        ? `No products match "${searchTerm}"`
                        : "No products match your current filters"
                      }
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              ) : (
                filteredProducts.map((product, index) => (
                  <MemoizedProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>


        </main>
      </div>
      </div>
    </div>
  );
};

export default Shop;
