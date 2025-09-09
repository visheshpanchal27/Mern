import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaBars, 
  FaTimes, 
  FaBox, 
  FaShippingFast, 
  FaBolt, 
  FaReceipt,
  FaStore,
  FaUser,
  FaCog,
  FaHeart,
  FaBell,
  FaGift,
  FaChevronRight
} from 'react-icons/fa'

const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const { userInfo } = useSelector(state => state.auth)
  const location = useLocation()
  
  // Hide menu drawer on shop page
  if (location.pathname === '/shop') {
    return null
  }

  const slides = [
    {
      title: 'Shop',
      items: [
        { path: '/shop', icon: FaStore, label: 'All Products', color: 'text-blue-400' },

        { path: '/deals', icon: FaGift, label: 'Special Deals', color: 'text-red-400' },
        { path: '/favorites', icon: FaHeart, label: 'Favorites', color: 'text-pink-400' },
      ]
    },
    {
      title: 'Orders',
      items: [
        { path: '/user-orders', icon: FaBox, label: 'My Orders', color: 'text-orange-400' },
        { path: '/express-checkout', icon: FaBolt, label: 'Express Checkout', color: 'text-yellow-400' },
      ]
    },
    {
      title: 'Account',
      items: [
        { path: '/profile', icon: FaUser, label: 'Profile', color: 'text-indigo-400' },
        { path: '/settings', icon: FaCog, label: 'Settings', color: 'text-gray-400' },
        { path: '/notifications', icon: FaBell, label: 'Notifications', color: 'text-red-400' },
      ]
    }
  ]

  return (
    <>
      {/* Floating Menu Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-[18px] right-[18px] z-40 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <FaBars size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div 
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black z-50 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Menu
                  </motion.h2>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={20} />
                  </motion.button>
                </div>

                {/* User Info */}
                {userInfo && (
                  <motion.div 
                    className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl mb-6 border border-gray-600"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" size={16} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{userInfo.username}</p>
                        <p className="text-gray-400 text-sm">{userInfo.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Slide Navigation */}
                <div className="flex space-x-1 mb-4 bg-gray-800 p-1 rounded-lg">
                  {slides.map((slide, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        activeSlide === index 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {slide.title}
                    </motion.button>
                  ))}
                </div>

                {/* Sliding Content */}
                <div className="flex-1 overflow-hidden">
                  <motion.div 
                    className="flex h-full"
                    animate={{ x: `-${activeSlide * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {slides.map((slide, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0 pr-4">
                        <div className="space-y-2">
                          {slide.items.map(({ path, icon: Icon, label, color }, itemIndex) => (
                            <motion.div
                              key={path}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.1 }}
                            >
                              <Link
                                to={path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all group border border-gray-700/50 hover:border-gray-600"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-colors`}>
                                    <Icon className={color} size={18} />
                                  </div>
                                  <span className="font-medium">{label}</span>
                                </div>
                                <FaChevronRight className="text-gray-500 group-hover:text-gray-300 transition-colors" size={14} />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Auth Section */}
                <motion.div 
                  className="mt-6 pt-4 border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {!userInfo ? (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl text-center font-semibold hover:shadow-lg transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="block w-full bg-gray-700 text-white py-3 rounded-xl text-center font-semibold hover:bg-gray-600 transition-all"
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <motion.button 
                      onClick={() => {
                        localStorage.removeItem('mobileUserInfo')
                        localStorage.removeItem('mobileToken')
                        localStorage.removeItem('cartItems')
                        setIsOpen(false)
                        window.location.href = '/login'
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MenuDrawer