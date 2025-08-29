import { Link } from "react-router-dom";
import axios from "axios";
import { HomeSkeleton } from "../components/Skeletons";
import Header from "../components/Header";
import Massage from "../components/Massage";
import ProductAll from "./Products/ProductAll.jsx";
import SEOHead from "../components/SEOHead";
import { useState, useEffect } from "react";
import { PRODUCTS_URL } from "../redux/constants.js";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaShoppingBag } from "react-icons/fa";
import StatsSection from "../components/StatsSection";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const { data } = await axios.get(`${PRODUCTS_URL}`);
        const allProducts = data.products || data;
        setProducts(allProducts);
        
        // Get random 6 products for special section
        const shuffledProducts = shuffleArray(allProducts);
        setSpecialProducts(shuffledProducts.slice(0, 6));
        
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchRandomProducts();
  }, []);

  return (
    <>
      <SEOHead 
        title="MERN E-Commerce Store - Premium Products"
        description="Discover amazing products at great prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout."
        keywords="ecommerce, online shopping, electronics, fashion, home goods, premium products"
      />
      <Header />
      {isLoading ? (
        <HomeSkeleton />
      ) : isError ? (
        <Massage variant="danger">Something went wrong!</Massage>
      ) : (
        <>
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mt-16 px-4 md:px-20 py-12 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 rounded-3xl mx-4 md:mx-8 mb-12"
          >
            <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <FaStar className="text-yellow-400 text-2xl" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Special Products
                </h1>
                <FaStar className="text-yellow-400 text-2xl" />
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              >
                Discover our handpicked collection of premium products, refreshed every time you visit!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link
                  to="/shop"
                  className="group bg-gradient-to-r from-pink-600 to-purple-600 font-bold rounded-full py-3 px-8 text-white hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaShoppingBag className="text-lg" />
                  Explore All Products
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-800/50 backdrop-blur-sm font-medium rounded-full py-3 px-6 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 border border-gray-600 hover:border-gray-500"
                >
                  🎲 Refresh Selection
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Special Products Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="px-4 md:px-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {specialProducts.map((product, index) => (
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
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mx-4 md:mx-8 border border-gray-700">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Want to see more amazing products?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Browse our complete collection and find exactly what you're looking for.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 font-bold rounded-full py-3 px-8 text-white hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
