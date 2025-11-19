import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFire, FaBolt, FaStar, FaEye, FaShoppingCart, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../../redux/features/Cart/CartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import QuickViewModal from "../../components/QuickViewModal";

const SmallProduct = ({ product, isLoading, refreshKey = 0 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  // Get all product images
  const allImages = useMemo(() => {
    if (!product) return [];
    const images = [];
    if (product.image) {
      const mainImageUrl = product.image.startsWith("http")
        ? product.image
        : `${import.meta.env.VITE_API_URL}${product.image}`;
      images.push(mainImageUrl);
    }
    if (product.images?.length) {
      const additionalImages = product.images.map(img => 
        img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
      );
      images.push(...additionalImages);
    }
    return images;
  }, [product]);

  // Set image index based on refresh key for variety
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Use product ID + refresh key for varied but consistent image selection
      const seed = (parseInt(product._id.slice(-4), 16) || 0) + refreshKey;
      const initialIndex = seed % allImages.length;
      setCurrentImageIndex(initialIndex);
    }
  }, [allImages.length, product?._id, refreshKey]);

  // Auto-cycle images with unique timing per product
  useEffect(() => {
    if (allImages.length > 1 && product?._id) {
      // Different interval for each product based on ID
      const baseInterval = 5000;
      const productOffset = (parseInt(product._id.slice(-2), 16) % 1500) || 0;
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      }, baseInterval + productOffset);
      return () => clearInterval(interval);
    }
  }, [allImages.length, product?._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    setIsLoading2(true);
    try {
      await dispatch(addToCartBackend({ ...product, qty: 1 }));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading2(false);
    }
  };
  
  const getDiscountPercentage = () => {
    if (product?.originalPrice && product?.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };
  
  const isOnSale = getDiscountPercentage() > 0;
  const isPopular = (product?.numReviews || 0) > 20 || (product?.rating || 0) >= 4.5;
  const isLowStock = (product?.countInStock || 0) > 0 && (product?.countInStock || 0) <= 3;

  if (isLoading || !product) {
    return null;
  }

  return (
    <motion.div 
      key={`${product?._id}-${refreshKey}`}
      className="w-full max-w-[16rem] p-3"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-2 group shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 border border-gray-700 hover:border-pink-500/50">
        {/* Advanced Badges */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {isOnSale && (
            <motion.span 
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-md flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <FaFire className="text-xs" /> -{getDiscountPercentage()}%
            </motion.span>
          )}
          {product.isNew && (
            <motion.span 
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-md flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <FaBolt className="text-xs" /> New
            </motion.span>
          )}
          {isPopular && (
            <motion.span 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🔥
            </motion.span>
          )}
        </div>
        
        <div className="h-32 bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden">
          <motion.img
            src={allImages[currentImageIndex] || allImages[0]}
            alt={product.name}
            className="h-full w-auto object-contain transition-all duration-300"
            loading="lazy"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Enhanced Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl items-center justify-center hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowQuickView(true)}
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-2 rounded-full text-sm hover:bg-white/30 transition-all shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
            >
              <FaEye />
            </motion.button>
            <motion.button
              onClick={handleAddToCart}
              disabled={product?.countInStock === 0 || isLoading2}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-2 rounded-full text-sm transition-all shadow-lg"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              <FaShoppingCart className={isLoading2 ? 'animate-spin' : ''} />
            </motion.button>
          </div>
        </motion.div>
        
        <div className="absolute top-2 right-2 z-20">
          <HeartIcon product={product} />
        </div>
        
        {allImages.length > 1 && (
          <>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImageIndex + 1}/{allImages.length}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex(prev => (prev + 1) % allImages.length);
              }}
              className="absolute top-2 left-2 bg-black/70 hover:bg-pink-600/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              ➡️
            </button>
          </>
        )}
      </div>

      <div className="p-3">
        <Link to={`/product/${product?._id}`}>
          <motion.h2 
            className="text-white font-semibold text-sm hover:text-pink-400 transition-colors truncate mb-2"
            whileHover={{ scale: 1.02 }}
          >
            {product?.name?.split(' ').slice(0, 2).join(' ')}
          </motion.h2>
        </Link>
        

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

export default SmallProduct;