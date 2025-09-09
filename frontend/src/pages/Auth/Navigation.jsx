import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { useGetCartQuery } from "../../redux/api/cartApiSlice";
import { logOut } from "../../redux/features/auth/authSlice";

import "./Navigation.css";

const Navigation = () => {
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const { userInfo } = useSelector((state) => state.auth);
  
  // Force re-render when userInfo changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [userInfo]);
  const { data: cartData } = useGetCartQuery(undefined, { 
    skip: !userInfo,
    pollingInterval: 500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true
  });
  const favoriteItems = useSelector((state) => state.favorites || []);
  
  const cartItems = userInfo ? (cartData?.items || []) : [];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management for dropdown
  useEffect(() => {
    if (dropdownOpen && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [dropdownOpen]);

  // Debounced sidebar hover
  const debouncedSetShowSidebar = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setShowSidebar(value), 100);
      };
    })(),
    []
  );

  const logoutHandler = async () => {
    try {
      setDropdownOpen(false);
      await logoutApiCall().unwrap();
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSidebarInteraction = useCallback(() => {
    if (isMobile) {
      setShowSidebar((prev) => !prev);
    }
  }, [isMobile]);

  return (
    <motion.div
      key={`nav-${forceUpdate}-${userInfo?._id || 'null'}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between p-2 sm:p-4 bg-gradient-to-b from-black/95 via-gray-900/90 to-black/95 backdrop-blur-xl text-white z-50 transition-all duration-500 group
        ${showSidebar ? "w-[12rem] sm:w-[14rem]" : "w-[3rem] sm:w-[4rem] hover:w-[12rem] sm:hover:w-[14rem]"}
        rounded-r-2xl shadow-2xl shadow-pink-500/10 border-r border-gray-800/50 overflow-y-auto overflow-x-hidden custom-scrollbar hover:shadow-pink-500/20`}
      id="navigation-container"
      onMouseEnter={!isMobile ? () => debouncedSetShowSidebar(true) : undefined}
      onMouseLeave={!isMobile ? () => debouncedSetShowSidebar(false) : undefined}
      onClick={isMobile ? handleSidebarInteraction : undefined}
    >
      {/* Logo/Brand */}
      <Link to="/" className="flex items-center justify-center py-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <path d="M8 20c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" fill="#2563eb" />
            <path d="M16 20c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" fill="#059669" />
            <path d="M12 16c2-2 6-2 8 0s2 6 0 8-6 2-8 0-2-6 0-8z" fill="none" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>
        {showSidebar && (
          <div className="ml-3">
            <div className="text-xs font-bold text-white">INFINITY</div>
            <div className="text-xs font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">PLAZA</div>
          </div>
        )}
      </Link>
      
      <ul className="flex flex-col space-y-3 sm:space-y-6 pt-4">
        <NavItem to="/" icon={<AiOutlineHome className="w-5 h-5 sm:w-6 sm:h-6" />} label="Home" expanded={showSidebar} />
        <NavItem to="/shop" icon={<AiOutlineShopping className="w-5 h-5 sm:w-6 sm:h-6" />} label="Shop" expanded={showSidebar} />
        <NavItem
          to="/cart"
          icon={<AiOutlineShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />}
          label="Cart"
          badge={cartItems.reduce((a, c) => a + (c.quantity || c.qty || 0), 0)}
          expanded={showSidebar}
        />
        <NavItem
          to="/favorite"
          icon={<FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Favorites"
          badge={favoriteItems.length}
          expanded={showSidebar}
        />
      </ul>

      <div className="relative pb-3">
        {userInfo ? (
          <div
            className="relative user-dropdown group"
            onMouseEnter={!isMobile ? () => setDropdownOpen(true) : undefined}
            onMouseLeave={!isMobile ? () => setDropdownOpen(false) : undefined}
          >
            <button
              className="flex items-center text-sm font-semibold hover:text-pink-400 transition"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setDropdownOpen(!dropdownOpen);
                } else if (e.key === "Escape") {
                  setDropdownOpen(false);
                }
              }}
              tabIndex="0"
              onClick={isMobile ? () => setDropdownOpen(!dropdownOpen) : undefined}
            >
              {showSidebar ? (
                <span className="px-2">{userInfo.username}</span>
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm uppercase shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110"
                  title={userInfo.username}
                  aria-label="User avatar"
                >
                  {userInfo.username.slice(0, 1)}
                </div>
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-7 left-0 bg-[#01010d] text-white rounded-lg shadow-xl w-40 sm:w-47 py-2 space-y-1 z-50 border border-gray-700"
                  role="menu"
                >
                  {userInfo.isAdmin && (
                    <>
                      <DropdownItem to="/admin/dashboard" label="Dashboard" />
                      <DropdownItem to="/admin/productlist" label="Products" />
                      <DropdownItem to="/admin/allproductslist" label="All Products List" />
                      <DropdownItem to="/admin/categorylist" label="Category" />
                      <DropdownItem to="/admin/orderlist" label="Orders" />
                      <DropdownItem to="/admin/userlist" label="Users" />
                    </>
                  )}
                  <DropdownItem to="/profile" label="Profile" />
                  <li role="none">
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition rounded-md text-sm"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <ul className="space-y-3">
            <NavItem to="/login" icon={<AiOutlineLogin className="w-5 h-5 sm:w-6 sm:h-6" />} label="Login" expanded={showSidebar} />
            <NavItem to="/register" icon={<AiOutlineUserAdd className="w-5 h-5 sm:w-6 sm:h-6" />} label="Register" expanded={showSidebar} />
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const NavItem = React.memo(({ to, icon, label, badge = 0, expanded }) => (
  <li className="group relative">
    <Link
      to={to}
      className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-4 w-full px-1 sm:px-2 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 hover:shadow-lg hover:shadow-pink-500/25 hover:text-pink-400 hover:scale-105"
      aria-label={label}
    >
      <div className="relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
        {icon}
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-1 -right-1 bg-pink-600 text-white text-[8px] sm:text-[10px] w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full font-bold shadow-sm"
            aria-label={`${badge} items in ${label}`}
          >
            {badge > 99 ? '99+' : badge}
          </motion.span>
        )}
      </div>
      <span className="nav-item-name hidden group-hover:inline text-xs sm:text-sm font-medium">
        {label}
      </span>
    </Link>
    {!expanded && (
      <span className="absolute left-full ml-1 sm:ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] sm:text-xs bg-black text-white px-1 sm:px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
        {label}
      </span>
    )}
  </li>
));

const DropdownItem = React.memo(({ to, label }) => (
  <li role="none">
    <Link
      to={to}
      className="block px-4 py-2 hover:bg-gray-600 rounded-md transition text-sm"
      role="menuitem"
    >
      {label}
    </Link>
  </li>
));

export default Navigation;