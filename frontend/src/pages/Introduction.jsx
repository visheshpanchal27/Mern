import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { FaSearch, FaShoppingCart, FaHeart, FaStar, FaArrowUp, FaBars, FaMoon, FaSun, FaComments, FaMicrophone, FaFilter, FaEye, FaTimes, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';
import { HiSparkles, HiShieldCheck, HiChatAlt2, HiTruck, HiTag, HiGift, HiLightningBolt, HiCube, HiUsers, HiTrendingUp, HiChartBar, HiLocationMarker, HiMail, HiPhone, HiClock, HiShieldCheck as HiShield } from 'react-icons/hi';
import { RiSecurePaymentFill, RiCustomerService2Fill, RiVoiceprintFill } from 'react-icons/ri';
import { MdVerified, MdLocalShipping, MdSupportAgent, MdNotifications, MdSecurity, MdPayment } from 'react-icons/md';
import { SiVisa, SiMastercard, SiAmericanexpress, SiPaypal, SiApple, SiGooglepay, SiBitcoin } from 'react-icons/si';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom gold color styles and slider arrows
const goldStyles = `
  .text-gold { color: #FFD700; }
  .bg-gold { background-color: #FFD700; }
  .border-gold { border-color: #FFD700; }
  .from-gold { --tw-gradient-from: #FFD700; }
  .to-gold { --tw-gradient-to: #FFD700; }
  .via-gold { --tw-gradient-via: #FFD700; }
  .ring-gold { --tw-ring-color: #FFD700; }
  .focus\:border-gold:focus { border-color: #FFD700; }
  .focus\:ring-gold\/20:focus { --tw-ring-color: rgba(255, 215, 0, 0.2); }
  .border-gold\/30 { border-color: rgba(255, 215, 0, 0.3); }
  .border-gold\/20 { border-color: rgba(255, 215, 0, 0.2); }
  .border-gold\/50 { border-color: rgba(255, 215, 0, 0.5); }
  .from-gold\/10 { --tw-gradient-from: rgba(255, 215, 0, 0.1); }
  .from-gold\/20 { --tw-gradient-from: rgba(255, 215, 0, 0.2); }
  .to-gold\/20 { --tw-gradient-to: rgba(255, 215, 0, 0.2); }
  

  
  .slick-dots {
    bottom: -40px !important;
  }
  
  .slick-dots li button:before {
    color: #8B5CF6 !important;
    font-size: 10px !important;
  }
  
  .slick-dots li.slick-active button:before {
    color: #8B5CF6 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = goldStyles;
  document.head.appendChild(styleSheet);
}



const testimonials = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    role: 'Fashion Blogger',
    review: 'Absolutely love this platform! The variety of products is incredible and the quality exceeds expectations. Fast shipping and excellent customer service make this my go-to shopping destination.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'New York, USA'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    role: 'Tech Enthusiast',
    review: 'Best online shopping experience I\'ve had! The electronics section is amazing with competitive prices. The product descriptions are detailed and accurate.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'California, USA'
  },
  { 
    id: 3, 
    name: 'Emma Rodriguez', 
    role: 'Interior Designer',
    review: 'The home decor collection is stunning! I\'ve furnished my entire apartment through this site. Great deals and the quality is consistently excellent.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'Texas, USA'
  },
  { 
    id: 4, 
    name: 'David Thompson', 
    role: 'Fitness Coach',
    review: 'Outstanding customer service and product quality! The sports equipment I ordered arrived quickly and was exactly as described. Highly recommend!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'Florida, USA'
  },
  { 
    id: 5, 
    name: 'Lisa Park', 
    role: 'Small Business Owner',
    review: 'Perfect for bulk orders! The business account features are fantastic and the wholesale prices help my business thrive. Excellent platform!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'Washington, USA'
  },
  { 
    id: 6, 
    name: 'James Wilson', 
    role: 'College Student',
    review: 'Great prices for students! The discount codes and seasonal sales help me stay within budget while getting quality products. Love the mobile app too!',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    verified: true,
    location: 'Illinois, USA'
  }
];

const IntroPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [onlineUsers] = useState(Math.floor(Math.random() * 500) + 100);
  const [todayOrders] = useState(Math.floor(Math.random() * 50) + 20);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 text-white hover:text-purple-400 transition-colors"
    >
      <FaChevronLeft className="text-2xl" />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 text-white hover:text-purple-400 transition-colors"
    >
      <FaChevronRight className="text-2xl" />
    </button>
  );

  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: products.length > 4,
    speed: 800,
    slidesToShow: Math.min(4, products.length),
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    autoplay: products.length > 4,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    useTransform: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, products.length), infinite: products.length > 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, infinite: products.length > 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, infinite: products.length > 1 } },
    ],
  }), [products.length]);



  // Voice search functionality
  const startVoiceSearch = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        navigate(`/shop?search=${encodeURIComponent(transcript)}`);
      };
      
      recognition.start();
    }
  }, [navigate]);



  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    // Reset any body styles that might cause padding issues
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, [darkMode]);

  // Handle navigation from main website without refresh
  useEffect(() => {
    const handlePopState = () => {
      // Prevent auto-refresh when navigating
      window.history.replaceState(null, '', window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://mernbackend-tmp5.onrender.com/api/products/allProducts', {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const allProducts = data.products || data;
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const uniqueProducts = shuffled.filter((product, index, self) => 
          index === self.findIndex(p => p._id === product._id)
        );
        setProducts(uniqueProducts.slice(0, 8));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);





  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, navigate]);

  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  }, [email]);



  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-100'}`} style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
      <motion.header
        role="banner"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 shadow-lg backdrop-blur-md transition-colors ${darkMode ? 'bg-gray-900/95 border-b border-gray-700' : 'bg-white/95'}`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="https://res.cloudinary.com/dhyc478ch/image/upload/v1763318624/logo_kxilm7.svg" alt="INFINITY PLAZA Logo" className="w-8 h-8 select-none pointer-events-none" />

              <h1 className={`text-lg font-bold tracking-wide transition bg-gradient-to-r from-teal-500 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg`}>INFINITY PLAZA</h1>
            </div>
          </div>
          
          <nav aria-label="Main navigation" className="hidden lg:flex items-center space-x-4">
            <button onClick={() => { navigate('/home'); window.location.reload(); }} className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${darkMode ? 'text-white hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 hover:text-purple-300 hover:shadow-lg hover:shadow-purple-500/25' : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 hover:shadow-lg hover:shadow-purple-200/50'}`}>Home</button>
            <button onClick={() => { navigate('/shop'); window.location.reload(); }} className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${darkMode ? 'text-white hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-cyan-500/30 hover:text-teal-300 hover:shadow-lg hover:shadow-teal-500/25' : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:text-teal-700 hover:shadow-lg hover:shadow-teal-200/50'}`}>Shop</button>
            <button onClick={() => { navigate('/cart'); window.location.reload(); }} className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${darkMode ? 'text-white hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30 hover:text-orange-300 hover:shadow-lg hover:shadow-orange-500/25' : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 hover:text-orange-700 hover:shadow-lg hover:shadow-orange-200/50'}`}>Cart</button>
            <button onClick={() => { navigate('/favorite'); window.location.reload(); }} className={`relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${darkMode ? 'text-white hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/30 hover:text-pink-300 hover:shadow-lg hover:shadow-pink-500/25' : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-700 hover:shadow-lg hover:shadow-pink-200/50'}`}>Favorites</button>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
              <button onClick={() => window.location.href = '/login'} className="flex items-center gap-1 bg-transparent hover:bg-white/20 text-white px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                <AiOutlineLogin className="w-3 h-3" />
                Login
              </button>
              <button onClick={() => window.location.href = '/register'} className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:shadow-purple-500/50">
                <AiOutlineUserAdd className="w-4 h-4" />
                Create Account
              </button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${darkMode ? 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/20' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}>
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`md:hidden border-t overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
              <div className="container mx-auto px-4 py-4 space-y-3">
                <a href="#home" className={`block ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={() => setMobileMenuOpen(false)}>Home</a>
                <a href="#features" className={`block ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#products" className={`block ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={() => setMobileMenuOpen(false)}>Products</a>
                <a href="#testimonials" className={`block ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <button onClick={() => window.location.href = '/login'} className="w-full bg-purple-600 text-white px-4 py-2 rounded-full">Login</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="max-w-full overflow-x-hidden">
      <section id="home" aria-label="Hero section" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }} 
            className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg"
          >
            Welcome to the Ultimate Shopping Center
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2 }} 
            className="text-xl md:text-2xl mb-8 drop-shadow-md"
          >
            Discover amazing deals on electronics, fashion, and more. Shop smart, live better. With over 10,000 products and free shipping on orders over $50.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.4 }} 
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(168, 85, 247, 0.6)" }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => {
              window.location.href = '/shop';
            }} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full text-lg transition shadow-lg flex items-center gap-2 mx-auto"
          >
            <HiSparkles className="text-2xl" />
            Shop Now
            <HiSparkles className="text-2xl" />
          </motion.button>
        </div>
      </section>

      <section className={`py-4 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-purple-50'} overflow-x-hidden`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="relative">
              <HiLightningBolt className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-bold text-yellow-400">50%</span> Off Today</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <MdLocalShipping className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-bold text-green-400">Free</span> Shipping</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, rotate: -5 }}>
              <HiGift className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-bold text-pink-400">Daily</span> Deals</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <MdVerified className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-bold text-blue-400">Best</span> Quality</p>
            </motion.div>
            <motion.div ref={statsRef} whileHover={{ scale: 1.05 }} className="relative">
              <HiUsers className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <motion.span 
                  className="font-bold text-purple-400"
                  initial={{ opacity: 0 }}
                  animate={isStatsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 2 }}
                >
                  {isStatsInView ? onlineUsers : 0}
                </motion.span> Online
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <HiTrendingUp className={`text-3xl mx-auto mb-1 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <motion.span 
                  className="font-bold text-orange-400"
                  initial={{ opacity: 0 }}
                  animate={isStatsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 2, delay: 0.5 }}
                >
                  {isStatsInView ? todayOrders : 0}
                </motion.span> Orders
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-x-hidden`}>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Why Choose Us?</h3>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We offer unbeatable features to make your shopping experience seamless and enjoyable.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -10 }} className={`text-center p-8 rounded-xl transition shadow-lg ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850' : 'bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl'}`}>
              <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }} className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <HiTruck className={`text-4xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Free Shipping</h4>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>On orders over $50. Delivered to your door.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ y: -10 }} className={`text-center p-8 rounded-xl transition shadow-lg ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850' : 'bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl'}`}>
              <motion.div whileHover={{ scale: 1.2, rotate: -360 }} transition={{ duration: 0.5 }} className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <RiSecurePaymentFill className={`text-4xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Secure Payments</h4>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>100% secure checkout with multiple options.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ y: -10 }} className={`text-center p-8 rounded-xl transition shadow-lg ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850' : 'bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl'}`}>
              <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }} className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <MdSupportAgent className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </motion.div>
              <h4 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>24/7 Support</h4>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Our team is here to help anytime.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full py-3 px-4 pl-12 pr-20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition ${darkMode ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-400' : 'bg-white border border-gray-300 text-gray-800'}`} aria-label="Search products" />
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <button 
                  type="button" 
                  onClick={startVoiceSearch} 
                  className={`p-3 transition ${isListening ? 'text-red-500' : 'text-gray-600 hover:text-purple-600'}`} 
                  title="Voice Search"
                >
                  <FaMicrophone className="text-xl" />
                </button>
              </div>
            </form>
            <p className={`mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Find what you love in seconds. Browse categories like Electronics, Fashion, and Home.</p>
          </motion.div>
        </div>
      </section>

      <section id="products" aria-labelledby="products-heading" className={`py-20 overflow-x-hidden ${darkMode ? 'bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="container mx-auto px-16">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="inline-block mb-4">
              <HiSparkles className={`text-5xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </motion.div>
            <h3 id="products-heading" className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Featured Products
            </h3>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover our handpicked selection of trending items with exclusive deals
            </p>
          </motion.div>
          {error ? (
            <div className="text-center">
              <p className={`text-xl mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className={`rounded-2xl h-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className={`text-center text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No products available at the moment.
            </p>
          ) : (
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product._id} className="px-3">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ y: -10 }}
                    className={`rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${darkMode ? 'bg-gray-900 hover:shadow-purple-500/20' : 'bg-white hover:shadow-2xl'}`}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={product.image}
                        alt={product.name || 'Product image'}
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                        className="w-full h-56 object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {product.countInStock < 10 && (
                        <motion.div
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r from-red-500 to-orange-500"
                        >
                          Low Stock
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute top-4 right-4 flex gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-full backdrop-blur-md ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
                        >
                          <FaHeart className="text-white text-lg" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuickViewProduct(product)}
                          className={`p-2 rounded-full backdrop-blur-md ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
                        >
                          <FaEye className="text-white text-lg" />
                        </motion.button>
                      </motion.div>
                      

                    </div>
                    
                    <div className="p-5">
                      <h4 className={`text-xl font-bold mb-2 line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {product.name}
                      </h4>
                      <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {product.desc}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <FaStar
                                className={`${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400'
                                    : i < product.rating
                                    ? 'text-yellow-400 opacity-50'
                                    : 'text-gray-300'
                                }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {product.rating}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          ({product.numReviews || 0} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <p className={`font-bold text-2xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          ${product.price}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.location.href = `/product/${product._id}`}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 font-semibold"
                        >
                          <HiCube className="text-lg" />
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 rounded-xl transition shadow-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <FaShoppingCart className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                </div>
              ))}
            </Slider>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/shop'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-full text-lg transition shadow-xl flex items-center gap-3 mx-auto"
            >
              <HiSparkles className="text-2xl" />
              View All Products
              <HiSparkles className="text-2xl" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className={`py-20 ${darkMode ? 'bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'} overflow-x-hidden`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              whileInView={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 200 }} 
              className="inline-block mb-4"
            >
              <HiChatAlt2 className={`text-5xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </motion.div>
            <h3 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              What Our Customers Say
            </h3>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of satisfied customers who trust us for their shopping needs
            </p>
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <FaStar className="text-yellow-400 text-xl" />
                  </motion.div>
                ))}
              </div>
              <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                4.9/5 from 2,847 reviews
              </span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 rounded-2xl shadow-xl transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850' : 'bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                {/* Quote Icon */}
                <div className={`absolute top-4 right-4 ${darkMode ? 'text-purple-400/20' : 'text-purple-600/20'}`}>
                  <FaComments className="text-3xl" />
                </div>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.1) + (i * 0.05) }}
                    >
                      <FaStar
                        className={`${
                          i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonial.rating}.0
                  </span>
                </div>
                
                {/* Review Text */}
                <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  "{testimonial.review}"
                </p>
                
                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                      whileHover={{ scale: 1.1 }}
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=8B5CF6&color=fff&size=56`;
                      }}
                    />

                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}>
                      {testimonial.role}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-1`}>
                      <HiLocationMarker className="text-xs" />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                

              </motion.div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className={`inline-flex items-center gap-8 px-8 py-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>50K+</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Happy Customers</p>
              </div>
              <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>4.9★</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Rating</p>
              </div>
              <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>99%</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>





      </main>
      <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">INFINITY PLAZA</h3>
              <p className="text-gray-400 mb-4">Your trusted online shopping destination.</p>
              <div className="flex gap-3">
                <FaFacebookF className="text-gray-400 hover:text-purple-400 cursor-pointer transition" />
                <FaInstagram className="text-gray-400 hover:text-purple-400 cursor-pointer transition" />
                <FaTwitter className="text-gray-400 hover:text-purple-400 cursor-pointer transition" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-purple-400 transition">Home</a></li>
                <li><a href="#products" className="hover:text-purple-400 transition">Products</a></li>
                <li><a href="/categories" className="hover:text-purple-400 transition">Categories</a></li>
                <li><a href="/deals" className="hover:text-purple-400 transition">Deals</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-purple-400 transition">Help Center</a></li>
                <li><a href="/contact" className="hover:text-purple-400 transition">Contact Us</a></li>
                <li><a href="/returns" className="hover:text-purple-400 transition">Returns</a></li>
                <li><a href="/shipping" className="hover:text-purple-400 transition">Shipping</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Get updates on new products and offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} INFINITY PLAZA. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-purple-400 transition">Privacy Policy</a>
              <a href="#terms" className="hover:text-purple-400 transition">Terms of Service</a>
              <a href="#cookies" className="hover:text-purple-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>







      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl rounded-lg shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick View</h3>
                  <button onClick={() => setQuickViewProduct(null)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                    <FaTimes />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-64 object-cover rounded-lg" />
                  <div>
                    <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{quickViewProduct.name}</h4>
                    <p className={`text-3xl font-bold text-purple-600 mb-4`}>${quickViewProduct.price}</p>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{quickViewProduct.desc}</p>
                    <div className="flex gap-2">
                      <button onClick={() => window.location.href = `/product/${quickViewProduct._id}`} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
                        View Details
                      </button>
                      <button className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};
export default IntroPage;
