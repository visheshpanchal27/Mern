import { Link } from "react-router-dom";
import axios from "axios";
import { HomeSkeleton } from "../components/Skeletons";
import EnhancedHomeSkeleton from "../components/AdvancedSkeleton";
import Header from "../components/Header";
import Massage from "../components/Massage";
import ProductAll from "./Products/ProductAll.jsx";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/HeroSection";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PRODUCTS_URL } from "../redux/constants.js";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaShoppingBag } from "react-icons/fa";
import StatsSection from "../components/StatsSection";
import { useAllProductsQuery } from "../redux/api/productApiSlice";

const Home = () => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);
  const [headerRefreshKey, setHeaderRefreshKey] = useState(0);
  
  const { data: allProductsData, isLoading, error } = useAllProductsQuery();

  // Generate random products when data changes or refresh is triggered
  const memoizedProducts = useMemo(() => {
    if (!allProductsData?.products) return [];
    const shuffled = [...allProductsData.products].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [allProductsData?.products, refreshKey]);

  useEffect(() => {
    setSpecialProducts(memoizedProducts);
  }, [memoizedProducts]);
  
  const handleRefreshProducts = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setHeaderRefreshKey(prev => prev + 1);
    setVisibleCount(8);
  }, []);
  
  const handleShowMore = useCallback(() => {
    setVisibleCount(prev => prev + 8);
  }, []);
  
  const visibleProducts = specialProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < specialProducts.length;

  return (
    <>
      <SEOHead 
        title="MERN E-Commerce Store - Premium Products"
        description="Discover amazing products at great prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout."
        keywords="ecommerce, online shopping, electronics, fashion, home goods, premium products"
      />
      <Header refreshKey={headerRefreshKey} />
      {isLoading ? (
        <HomeSkeleton />
      ) : error ? (
        <Massage variant="danger">Something went wrong!</Massage>
      ) : (
        <>
          {/* Hero & Special Products Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mt-12 sm:mt-16 px-3 sm:px-4 md:px-20 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 md:mx-8 mb-8 sm:mb-12"
          >
            <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
            <div className="relative z-10">
              {/* Hero Content */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-6"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                    Welcome to Our Store
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 sm:mb-6">
                    Discover Amazing Products
                  </p>
                </motion.div>
                

              </div>
              
              {/* Special Products Title */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <FaStar className="text-yellow-400 text-lg sm:text-xl md:text-2xl" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Special Products
                  </h2>
                  <FaStar className="text-yellow-400 text-lg sm:text-xl md:text-2xl" />
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto"
                >
                  Handpicked collection of premium products, refreshed every time you visit!
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link
                    to="/shop"
                    className="btn-primary group rounded-full py-3 px-8 flex items-center gap-2"
                  >
                    <FaShoppingBag className="text-lg" />
                    Explore All Products
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button
                    onClick={handleRefreshProducts}
                    className="btn-secondary rounded-full py-3 px-6"
                  >
                    🎲 Refresh Selection
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Special Products Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="px-2 sm:px-4 md:px-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
              {visibleProducts.map((product, index) => (
                <motion.div 
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <ProductAll product={product} />
                </motion.div>
              ))}
            </div>
            
            {/* Show More Button */}
            {hasMoreProducts && (
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <button
                  onClick={handleShowMore}
                  className="btn-primary rounded-full py-4 px-8 flex items-center gap-2 mx-auto hover:scale-105 transform transition-all"
                >
                  <FaArrowRight className="text-lg" />
                  Show More
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Section */}
          <StatsSection />

          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-16 mb-8 text-center px-4"
          >
            <div className="card-secondary p-8 mx-4 md:mx-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Want to see more amazing products?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Browse our complete collection and find exactly what you're looking for.
              </p>
              <Link
                to="/shop"
                className="btn-primary inline-flex items-center gap-2 rounded-full py-3 px-8"
              >
                View All Products
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Home;
