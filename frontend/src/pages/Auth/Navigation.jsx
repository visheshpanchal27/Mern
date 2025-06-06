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
import { logOut } from "../../redux/features/auth/authSlice";
import _ from "lodash";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favoriteItems = useSelector((state) => state.favorites || []);

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
    _.debounce((value) => setShowSidebar(value), 100),
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
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between p-4 bg-[#000]/90 backdrop-blur-md text-white z-50 transition-all duration-300 group
        ${showSidebar ? "w-[14rem]" : "w-[4rem] hover:w-[14rem]"}
        rounded-r-xl shadow-lg border-r border-gray-900 overflow-y-auto overflow-x-hidden custom-scrollbar`}
      id="navigation-container"
      onMouseEnter={!isMobile ? () => debouncedSetShowSidebar(true) : undefined}
      onMouseLeave={!isMobile ? () => debouncedSetShowSidebar(false) : undefined}
      onClick={isMobile ? handleSidebarInteraction : undefined}
    >
      <ul className="flex flex-col space-y-6 pt-8">
        <NavItem to="/" icon={<AiOutlineHome size={24} />} label="Home" expanded={showSidebar} />
        <NavItem to="/shop" icon={<AiOutlineShopping size={24} />} label="Shop" expanded={showSidebar} />
        <NavItem
          to="/cart"
          icon={<AiOutlineShoppingCart size={24} />}
          label="Cart"
          badge={cartItems.reduce((a, c) => a + c.qty, 0)}
          expanded={showSidebar}
        />
        <NavItem
          to="/favorite"
          icon={<FaHeart size={20} />}
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
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-700 text-black font-bold text-sm uppercase"
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
                  className="absolute bottom-7 left-0 bg-[#01010d] text-white rounded-lg shadow-xl w-47 py-2 space-y-1 z-50 border border-gray-700"
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
            <NavItem to="/login" icon={<AiOutlineLogin size={24} />} label="Login" expanded={showSidebar} />
            <NavItem to="/register" icon={<AiOutlineUserAdd size={24} />} label="Register" expanded={showSidebar} />
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
      className="flex items-center justify-center md:justify-start space-x-4 w-full px-0.8 py-2 rounded-xl transition-all duration-300 hover:bg-[#272738] hover:shadow-lg hover:text-pink-400"
      aria-label={label}
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        {icon}
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm"
            aria-label={`${badge} items in ${label}`}
          >
            {badge}
          </motion.span>
        )}
      </div>
      <span className="nav-item-name hidden group-hover:inline text-sm font-medium">
        {label}
      </span>
    </Link>
    {!expanded && (
      <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
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