import ReactDOM from "react-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { FaTimes, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaEye, FaShare, FaExpand, FaInfoCircle, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaChevronLeft, FaChevronRight, FaDownload, FaCheck, FaTruck, FaUndo, FaTag, FaGift, FaFire } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SizeSelector, ColorSelector, SpecsDisplay } from "./ProductOptions";

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleAddToCart = useCallback(() => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCartBackend({ ...product, qty: quantity }));
    toast.success(`${product.name} added to cart!`);
  }, [dispatch, product, quantity, userInfo]);

  const toggleWishlist = useCallback(() => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  }, [isWishlisted, userInfo]);

  const handleViewDetails = useCallback(() => {
    navigate(`/product/${product._id}`);
    onClose();
  }, [navigate, product._id, onClose]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/product/${product._id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Product link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  }, [product._id]);

  const handleImageZoom = useCallback((e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  }, []);

  const offers = [
    { text: '🔥 Limited Time: 20% OFF', color: 'from-red-500 to-orange-500' },
    { text: '🚚 Free Shipping on Orders $50+', color: 'from-blue-500 to-cyan-500' },
    { text: '🎁 Buy 2 Get 1 Free', color: 'from-purple-500 to-pink-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring" }}
        >
          <FaStar className="text-yellow-400 drop-shadow-sm" />
        </motion.div>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <motion.div
          key="half"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: fullStars * 0.1, type: "spring" }}
        >
          <FaStarHalfAlt className="text-yellow-400 drop-shadow-sm" />
        </motion.div>
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <motion.div
          key={`empty-${i}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1, type: "spring" }}
        >
          <FaRegStar className="text-gray-400" />
        </motion.div>
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const images = product?.images || [product?.image].filter(Boolean);
  const videos = product?.videos || [];
  const mediaItems = [...images, ...videos];
  const sizes = product?.sizes || ['S', 'M', 'L', 'XL'];
  const colors = product?.colors || [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }];
  const features = product?.features || ['Premium Quality', 'Fast Delivery', '30-Day Return'];
  const badges = [];
  if (product?.isNew) badges.push({ text: 'NEW', color: 'bg-green-500' });
  if (product?.isBestseller) badges.push({ text: 'BESTSELLER', color: 'bg-orange-500' });
  if (product?.isLimited) badges.push({ text: 'LIMITED', color: 'bg-red-500' });
  
  if (!isOpen || !product) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl w-[1200px] max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-gray-600/30 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(31,41,55,0.95) 50%, rgba(17,24,39,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Enhanced Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
            <div className="relative flex justify-between items-center p-6 border-b border-gray-700/30">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                >
                  <FaEye className="text-white" size={16} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick View</h2>
                  <p className="text-xs text-gray-400">Premium Product Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl transition-all duration-300 border border-blue-500/30"
                >
                  {copied ? <FaCheck className="text-green-400" size={16} /> : <FaShare className="text-blue-400" size={16} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 rounded-xl transition-all duration-300 border border-red-500/30"
                >
                  <FaTimes className="text-red-400" size={16} />
                </motion.button>
              </div>
            </div>

          </div>

          {/* Enhanced Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col lg:flex-row gap-8 p-6">
              {/* Enhanced Media Section */}
              <div className="lg:w-1/2 space-y-6">
                {/* Product Badges */}
                {badges.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {badges.map((badge, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                      >
                        {badge.text}
                      </motion.span>
                    ))}
                  </div>
                )}
                
                {/* Main Media Display */}
                <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-3xl p-6 group backdrop-blur-sm border border-gray-700/30">
                  <div className="relative overflow-hidden rounded-2xl">
                    {mediaItems[selectedImage]?.includes('.mp4') ? (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          src={mediaItems[selectedImage]}
                          className="w-full h-[450px] object-cover rounded-2xl"
                          muted={isMuted}
                          loop
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (isVideoPlaying) {
                                videoRef.current?.pause();
                              } else {
                                videoRef.current?.play();
                              }
                              setIsVideoPlaying(!isVideoPlaying);
                            }}
                            className="bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-all"
                          >
                            {isVideoPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                          </motion.button>
                        </div>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                        >
                          {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                        </button>
                      </div>
                    ) : (
                      <motion.img
                        ref={imageRef}
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        src={images[selectedImage] || product.image}
                        alt={product.name}
                        className="w-full h-[450px] object-contain rounded-2xl transition-transform duration-300"

                      />
                    )}
                  </div>
                  
                  {/* Media Controls */}
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsImageExpanded(true)}
                      className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <FaExpand size={14} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                    >
                      <FaDownload size={14} />
                    </motion.button>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {mediaItems.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : mediaItems.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedImage(selectedImage < mediaItems.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FaChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Enhanced Media Thumbnails */}
                {mediaItems.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {mediaItems.map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === idx 
                            ? 'border-pink-400 shadow-lg shadow-pink-400/25' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {item.includes('.mp4') ? (
                          <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                            <FaPlay className="text-white" size={12} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>
                        ) : (
                          <img src={item} alt="" className="w-full h-full object-cover" />
                        )}
                        {selectedImage === idx && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 border-2 border-pink-400 rounded-xl"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Product Info */}
              <div className="lg:w-1/2 text-white space-y-6">
                {/* Product Header */}
                <div className="space-y-4">
                  <div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
                    >
                      {product.name}
                    </motion.h3>
                    {product.brand && (
                      <p className="text-gray-400 text-sm mt-1">by <span className="text-pink-400 font-medium">{product.brand}</span></p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating || 4.5)}
                      </div>
                      <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFire className="text-orange-400" size={16} />
                      <span className="text-orange-400 text-sm font-medium">Trending</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                      >
                        ${product.price}
                      </motion.span>
                      {product.originalPrice && (
                        <div className="flex flex-col">
                          <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                          <span className="text-green-400 text-sm font-medium">
                            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>



                {/* Enhanced Tabs */}
                <div className="border-b border-gray-700/50">
                  <div className="flex gap-8">
                    {['overview', 'features', 'specs', 'reviews'].map((tab) => (
                      <motion.button
                        key={tab}
                        whileHover={{ y: -2 }}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-3 px-2 text-sm font-medium capitalize transition-all duration-300 ${
                          activeTab === tab 
                            ? 'text-pink-400' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Tab Content */}
                <div className="min-h-[140px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <FaCheck className="text-green-400" size={16} />
                            <span className="text-sm text-gray-300">Quality Guaranteed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaTruck className="text-blue-400" size={16} />
                            <span className="text-sm text-gray-300">Fast Shipping</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUndo className="text-yellow-400" size={16} />
                            <span className="text-sm text-gray-300">Easy Returns</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${
                              product.countInStock > 0 ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            <span className="text-sm text-gray-300">
                              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeTab === 'features' && (
                      <motion.div
                        key="features"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        {features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                          >
                            <FaCheck className="text-green-400" size={14} />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    
                    {activeTab === 'specs' && (
                      <motion.div
                        key="specs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <SpecsDisplay 
                          specifications={product.specifications}
                          variant="default"
                        />
                      </motion.div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-white">{product.rating || 4.5}</span>
                              <div className="flex items-center gap-1">
                                {renderStars(product.rating || 4.5)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">{product.numReviews || 0} reviews</p>
                          </div>
                          <button className="px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors text-sm">
                            Write Review
                          </button>
                        </div>
                        {product.numReviews === 0 && (
                          <p className="text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced Quantity & Actions */}
                <div className="space-y-6 pt-6 border-t border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 font-medium">Quantity:</span>
                      <div className="flex items-center bg-gray-800/50 border border-gray-600/50 rounded-xl overflow-hidden backdrop-blur-sm">
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-3 text-white hover:text-blue-400 transition-all"
                        >
                          -
                        </motion.button>
                        <span className="px-6 py-3 bg-gray-900/50 text-white min-w-[60px] text-center font-medium">{quantity}</span>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setQuantity(Math.min(product.countInStock || 99, quantity + 1))}
                          className="px-4 py-3 text-white hover:text-blue-400 transition-all"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-xl font-bold text-pink-400">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <motion.button
                        whileHover={{ 
                          scale: 1.05, 
                          y: -3,
                          boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className="col-span-2 relative overflow-hidden flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl font-bold transition-all duration-300 shadow-xl text-white group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <FaShoppingCart size={20} className="relative z-10" />
                        <span className="relative z-10">Add to Cart</span>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 5,
                          boxShadow: "0 15px 30px rgba(239, 68, 68, 0.3)"
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleWishlist}
                        className="relative overflow-hidden px-6 py-5 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-red-500/20 hover:to-pink-500/20 rounded-2xl transition-all duration-300 border-2 border-gray-700 hover:border-red-400/50 group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {isWishlisted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative z-10"
                          >
                            <FaHeart className="text-red-400" size={20} />
                          </motion.div>
                        ) : (
                          <FaRegHeart className="text-gray-400 group-hover:text-red-400 transition-colors relative z-10" size={20} />
                        )}
                      </motion.button>
                    </div>
                    
                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        y: -3,
                        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewDetails}
                      className="w-full relative overflow-hidden flex items-center justify-center gap-4 px-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-2xl font-bold transition-all duration-300 shadow-xl text-white group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                      <FaInfoCircle size={20} className="relative z-10" />
                      <span className="relative z-10 text-lg">View Full Details</span>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="relative z-10"
                      >
                        <FaFire className="text-yellow-300" size={18} />
                      </motion.div>
                    </motion.button>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-700/30">
                    <div className="text-center">
                      <FaCheck className="text-green-400 mx-auto mb-1" size={16} />
                      <p className="text-xs text-gray-400">Secure</p>
                    </div>
                    <div className="text-center">
                      <FaTruck className="text-blue-400 mx-auto mb-1" size={16} />
                      <p className="text-xs text-gray-400">Fast Ship</p>
                    </div>
                    <div className="text-center">
                      <FaUndo className="text-yellow-400 mx-auto mb-1" size={16} />
                      <p className="text-xs text-gray-400">Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Image Expansion Modal */}
        <AnimatePresence>
          {isImageExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[70] flex items-center justify-center p-4"
              onClick={() => setIsImageExpanded(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedImage] || product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
                <div className="absolute top-4 right-4 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
                  >
                    <FaDownload size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsImageExpanded(false)}
                    className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
                  >
                    <FaTimes size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default QuickViewModal;

// Add custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #ec4899, #8b5cf6);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #db2777, #7c3aed);
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
