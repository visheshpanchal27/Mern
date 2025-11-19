import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye, FaFire, FaBolt, FaTruck, FaShieldAlt, FaStar, FaHeart, FaShare, FaCompressArrowsAlt, FaClock, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../../redux/features/Cart/CartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import QuickViewModal from "../../components/QuickViewModal";

const Product = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  // Get all product images
  const allImages = useMemo(() => {
    const images = [];
    if (product.image) {
      const mainImageUrl = product.image.startsWith('http')
        ? product.image
        : `${import.meta.env.VITE_API_URL}${product.image}`;
      images.push(mainImageUrl);
    }
    if (product.images?.length) {
      const additionalImages = product.images.map(img => 
        img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    return images;
  }, [product.image, product.images]);

  // Set initial image index (no random on refresh)
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Use product ID to create consistent seed (no Date.now())
      const seed = parseInt(product._id.slice(-4), 16) || 0;
      const initialIndex = seed % allImages.length;
      setCurrentImageIndex(initialIndex);
    }
  }, [allImages.length, product?._id]);

  // Auto-cycle images with unique timing per product
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Different interval for each product based on ID
      const baseInterval = 3000;
      const productOffset = (parseInt(product._id.slice(-2), 16) % 1000) || 0;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      }, baseInterval + productOffset);
      return () => clearInterval(interval);
    }
  }, [allImages.length, product?._id]);



  const currentImage = allImages[currentImageIndex] || allImages[0];
  
  const handleAddToCart = useCallback(async () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(addToCartBackend({ ...product, qty: 1 }));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, dispatch, product]);

  const handleQuickView = useCallback(() => {
    setShowQuickView(true);
  }, []);

  const handleShare = useCallback((e) => {
    e.stopPropagation();
    navigator.share ? 
      navigator.share({ title: product.name, url: window.location.href }) :
      navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  }, [product.name]);
  
  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };
  
  const isOnSale = getDiscountPercentage() > 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const isPopular = product.numReviews > 50 || product.rating >= 4.5;
  const isTrending = product.views > 100 || product.recentSales > 10;
  const hasFlashSale = product.flashSale && new Date(product.flashSaleEnd) > new Date();
  
  // Flash sale countdown
  useEffect(() => {
    if (hasFlashSale) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(product.flashSaleEnd).getTime();
        const distance = end - now;
        
        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(null);
        }
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [hasFlashSale, product.flashSaleEnd]);

  return (
    <motion.div 
      className="w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-xs h-full p-1 sm:p-2 relative mx-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-gray-800 hover:border-pink-500/50 backdrop-blur-sm h-full flex flex-col">
        
        {/* Image Section */}
        <div className="relative w-full h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden rounded-t-2xl group flex-shrink-0">
          <motion.img
            src={currentImage}
            alt={product.name}
            className="object-contain w-full h-full bg-gradient-to-br from-white to-gray-50 transition-all duration-500"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Image Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-t-2xl" />
          )}
          
          {/* Image Indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
              {allImages.length > 3 && (
                <span className="text-white text-xs">+{allImages.length - 3}</span>
              )}
            </div>
          )}

          {/* Animated overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Advanced Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex flex-col gap-1">
            <motion.button
              onClick={handleShare}
              className="group relative p-1.5 bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-md rounded-full text-white shadow-lg border border-white/30 w-fit overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <FaShare className="text-xs relative z-10 drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 1 }}
                whileHover={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
            {product.countInStock === 0 && (
              <motion.span 
                className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                Sold Out
              </motion.span>
            )}
            {isOnSale && (
              <motion.span 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <FaFire className="text-xs" /> -{getDiscountPercentage()}%
              </motion.span>
            )}
            {product.isNew && (
              <motion.span 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <FaBolt className="text-xs" /> New
              </motion.span>
            )}
            {isPopular && (
              <motion.span 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🔥 Popular
              </motion.span>
            )}
            {isTrending && (
              <motion.span 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                📈 Trending
              </motion.span>
            )}
            {hasFlashSale && timeLeft && (
              <motion.span 
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaClock className="text-xs" /> {timeLeft}
              </motion.span>
            )}
          </div>
          
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20 flex gap-1 sm:gap-2">
            <HeartIcon product={product} />
          </div>
          
          {/* Quick Actions */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0 || isLoading}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            >
              <FaShoppingCart className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Adding...' : product.countInStock === 0 ? 'Sold Out' : 'Add to Cart'}
            </motion.button>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              <button 
                onClick={() => setShowQuickView(true)}
                className="bg-pink-600/90 backdrop-blur-sm border border-pink-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-pink-700 transition-all duration-300 flex items-center gap-1 shadow-lg"
              >
                <FaEye /> Quick View
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Product Info */}
        <div className="p-2 sm:p-3 space-y-1 sm:space-y-2 bg-gradient-to-b from-transparent to-black/10 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <Link to={`/product/${product._id}`}>
              <motion.h2 
                className="text-sm sm:text-base md:text-lg font-bold text-white hover:text-pink-400 transition truncate mb-1 sm:mb-2"
                whileHover={{ scale: 1.02 }}
              >
                {product.name}
              </motion.h2>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-2 sm:mb-3">
              {product.description?.substring(0, 50)}...
            </p>
          </div>

          <div className="mt-auto">
            {/* Rating & Features */}
            <div className="flex items-center justify-between mb-3">
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <motion.span 
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                    >
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </motion.span>
                  ))}
                </div>
                <span className="text-gray-400 text-xs">({product.numReviews || 0})</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-400 flex items-center gap-1">
                <FaTruck className="text-xs" /> Free Ship
              </span>
              {product.fastDelivery && (
                <span className="text-blue-400 flex items-center gap-1">
                  ⚡ Fast
                </span>
              )}
              {product.verified && (
                <span className="text-purple-400 flex items-center gap-1">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
          
          {/* Dynamic Alerts */}
          {isLowStock && (
            <motion.div 
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-2 text-center"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-orange-400 text-xs font-bold flex items-center justify-center gap-1">
                🔥 Only {product.countInStock} left!
              </span>
            </motion.div>
          )}
          
          {product.recentlyViewed && (
            <motion.div 
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-1.5 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-blue-400 text-xs font-medium flex items-center justify-center gap-1">
                👁️ {product.recentViews || 23} people viewed this
              </span>
            </motion.div>
          )}
          
          {product.recentPurchase && (
            <motion.div 
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-1.5 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-green-400 text-xs font-medium flex items-center justify-center gap-1">
                <FaThumbsUp className="text-xs" /> {product.recentSales || 5} bought today
              </span>
            </motion.div>
          )}

          {/* Price Section */}
          <div className="flex items-end justify-between pt-2 border-t border-gray-700/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  ${product.price}
                </motion.span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {isOnSale && (
                <motion.span 
                  className="text-xs text-green-400 font-medium flex items-center gap-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  💰 Save ${(product.originalPrice - product.price).toFixed(2)}
                </motion.span>
              )}
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex gap-1">
                <button
                  onClick={() => setShowQuickView(true)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center gap-1"
                >
                  <FaEye /> View
                </button>
                <Link 
                  to={`/product/${product._id}`}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1.5 rounded-lg text-xs transition-all duration-300 flex items-center"
                >
                  <FaCompressArrowsAlt />
                </Link>
              </div>
            </motion.div>
          </div>
          </div>
        </div>
      </div>
      
      {/* QuickView Modal */}
      <QuickViewModal 
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={product}
      />
    </motion.div>
  );
};

export default React.memo(Product, (prevProps, nextProps) => {
  return prevProps.product._id === nextProps.product._id &&
         prevProps.product.price === nextProps.product.price &&
         prevProps.product.countInStock === nextProps.product.countInStock;
});
