import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { FaHome, FaSearch, FaShoppingCart, FaUser, FaHeart, FaStore } from 'react-icons/fa'
import { motion } from 'framer-motion'

const BottomNav = () => {
  const cartItems = useSelector(state => state.cart.items || [])
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const { userInfo } = useSelector(state => state.auth)

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/shop', icon: FaStore, label: 'Shop' },
    { path: '/cart', icon: FaShoppingCart, label: 'Cart', badge: cartCount },
    { path: userInfo ? '/profile' : '/login', icon: FaUser, label: userInfo ? 'Profile' : 'Login' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-800/95 backdrop-blur-lg border-t border-gray-700/50 safe-area-bottom z-50">
      <div className="flex justify-around items-center py-1">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-blue-400 bg-blue-500/10 scale-110' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative">
                  <Icon size={isActive ? 22 : 20} className={isActive ? 'drop-shadow-lg' : ''} />
                  {badge > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {badge > 9 ? '9+' : badge}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                  isActive ? 'text-blue-400 scale-105' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav