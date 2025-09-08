import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useClearCartMutation,
} from "../redux/api/cartApiSlice";
import { FaTrash, FaShoppingCart, FaUser, FaUserPlus, FaHeart, FaBolt, FaCheck } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: cart, isLoading, isError } = useGetCartQuery(undefined, {
    skip: !userInfo
  });
  const [updateCart] = useUpdateCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  // Enhanced states for better UX - moved to top
  const [updatingQtyId, setUpdatingQtyId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isQuickCheckout, setIsQuickCheckout] = useState(false);
  const [savedForLater, setSavedForLater] = useState(new Set());


  // Filter out items with null/deleted products
  const cartItems = (cart?.items || []).filter(item => item.product && item.product._id);
  
  // Calculate totals with memoization
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  // Update item quantity
  const updateCartHandler = async (product, qty) => {
    if (!product?._id) return;
    
    try {
      setUpdatingQtyId(product._id);
      const validItems = cartItems.filter(i => i.product?._id);
      const updatedItems = validItems.map((i) =>
        i.product._id === product._id
          ? { product: product._id, qty }
          : { product: i.product._id, qty: i.qty }
      );
      await updateCart(updatedItems).unwrap();
      setTimeout(() => setUpdatingQtyId(null), 300);
    } catch (error) {
      console.error('Update cart error:', error);
      setUpdatingQtyId(null);
    }
  };

  // Remove item from cart
  const removeFromCartHandler = async (id) => {
    if (!id) return;
    
    try {
      setRemovingItemId(id);
      const validItems = cartItems.filter(item => item.product?._id);
      const updatedItems = validItems
        .filter((item) => item.product._id !== id)
        .map((i) => ({ product: i.product._id, qty: i.qty }));
      await updateCart(updatedItems).unwrap();
      setTimeout(() => setRemovingItemId(null), 300);
    } catch (error) {
      console.error('Remove from cart error:', error);
      setRemovingItemId(null);
    }
  };

  const checkoutHandler = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/shipping");
  }, [cartItems.length, navigate]);
  
  // Quick checkout handler
  const quickCheckoutHandler = useCallback(async () => {
    setIsQuickCheckout(true);
    try {
      // Simulate quick checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/shipping?quick=true");
      toast.success("🚀 Quick checkout initiated!");
    } catch (error) {
      toast.error("Quick checkout failed");
    } finally {
      setIsQuickCheckout(false);
    }
  }, [navigate]);
  
  // Bulk operations
  const selectAllItems = useCallback(() => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.product._id)));
    }
  }, [cartItems, selectedItems.size]);
  
  const removeSelectedItems = useCallback(async () => {
    if (selectedItems.size === 0) return;
    
    try {
      const remainingItems = cartItems
        .filter(item => !selectedItems.has(item.product._id))
        .map(item => ({ product: item.product._id, qty: item.qty }));
      
      await updateCart(remainingItems).unwrap();
      setSelectedItems(new Set());
      toast.success(`Removed ${selectedItems.size} items from cart`);
    } catch (error) {
      toast.error("Failed to remove selected items");
    }
  }, [selectedItems, cartItems, updateCart]);
  
  // Save for later functionality
  const saveForLater = useCallback((productId) => {
    const newSavedItems = new Set(savedForLater);
    if (newSavedItems.has(productId)) {
      newSavedItems.delete(productId);
      toast.info("Removed from saved items");
    } else {
      newSavedItems.add(productId);
      toast.success("Saved for later");
    }
    setSavedForLater(newSavedItems);
    localStorage.setItem('savedForLater', JSON.stringify([...newSavedItems]));
  }, [savedForLater]);
  


  const clearCartHandler = async () => {
    try {
      await clearCart().unwrap();
    } catch (error) {
      alert("Clear cart failed: " + (error?.data || error.message));
    }
  };



  // Show login prompt if user is not authenticated
  if (!userInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-primary text-white px-4">
        <div className="card-primary p-8 text-center max-w-md w-full">
          <FaShoppingCart className="text-6xl text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Access Your Cart</h2>
          <p className="text-gray-400 mb-6">Please login or register to view your shopping cart</p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <FaUser className="text-lg" />
              Login
            </Link>
            <Link
              to="/register"
              className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
            >
              <FaUserPlus className="text-lg" />
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-background-primary text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-background-primary text-red-500">
        <div className="card-primary p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Failed to load cart</h3>
          <p className="text-gray-400 mb-4">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2"
          >
            Refresh
          </button>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen overflow-hidden px-2 sm:px-4 pt-4 sm:pt-6 bg-background-primary">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-secondary flex items-center gap-2 py-2 px-3 sm:px-4 mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <IoArrowBackSharp className="text-sm sm:text-base" />
        Go Back
      </button>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-10 sm:mt-20 space-y-4 sm:space-y-6 px-4">
          <FaShoppingCart className="text-5xl sm:text-7xl text-gray-500" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Your Cart is Empty</h2>
          <p className="text-gray-400 text-sm sm:text-base">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="btn-primary px-4 sm:px-6 py-2 text-sm sm:text-base"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 min-h-[calc(100vh-8rem)]">
          {/* Scrollable Cart List */}
          <div className="flex-1 lg:pr-4 overflow-y-auto scroll-smooth custom-scroll">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">Shopping Cart</h1>
            </div>

            <AnimatePresence>
              {cartItems.filter(item => item.product).map((item) => (
                <motion.div
                  key={item.product?._id || Math.random()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 pb-4 border-b border-gray-700 gap-3 sm:gap-0 rounded-lg p-3 transition-all hover:bg-gray-800/50"
                >
                  <div className="flex w-full sm:w-auto gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <img
                        src={
                          item.product?.image?.startsWith("http")
                            ? item.product.image
                            : `${import.meta.env.VITE_API_URL}${item.product?.image || ''}`
                        }
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?._id || ''}`}
                        className="text-pink-500 hover:underline cursor-pointer text-sm sm:text-base font-medium"
                      >
                        {item.product?.name || 'Unknown Product'}
                      </Link>
                      <div className="mt-1 text-white text-xs sm:text-sm">{item.product?.brand || 'No Brand'}</div>
                      <div className="mt-1 font-bold text-white text-sm sm:text-base">${item.product?.price || 0}</div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Subtotal: ${(item.qty * (item.product?.price || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:ml-4 gap-3">
                    <div className="w-20 sm:w-24 relative">
                      {updatingQtyId === item.product?._id ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1f1f1f] rounded">
                          <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <select
                          className="w-full p-1 rounded bg-[#1f1f1f] border border-gray-600 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer text-xs sm:text-sm"
                          value={item.qty}
                          onChange={(e) =>
                            updateCartHandler(item.product, Number(e.target.value))
                          }
                        >
                          {[...Array(Math.min(item.product?.countInStock || 1, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      className="text-red-500 hover:text-white cursor-pointer p-2 rounded hover:bg-red-500/20 transition"
                      title="Remove item"
                      onClick={() => removeFromCartHandler(item.product?._id)}
                      disabled={removingItemId === item.product?._id}
                    >
                      {removingItemId === item.product?._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-red-500"></div>
                      ) : (
                        <FaTrash className="text-sm sm:text-lg" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Enhanced Checkout Summary */}
          <div className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 lg:pl-4">
            <div className="card-primary p-4 sm:p-6 text-white lg:sticky lg:top-10 space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Order Summary ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
              </h2>
              
              {/* Detailed Pricing */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cartTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{cartTotals.shipping === 0 ? 'FREE' : `$${cartTotals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${cartTotals.tax.toFixed(2)}</span>
                </div>

                <hr className="border-gray-600" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${cartTotals.total.toFixed(2)}</span>
                </div>
              </div>



              {/* Checkout Button */}
              <button
                className="btn-primary w-full py-3 text-sm sm:text-lg"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>

              <button
                className="btn-secondary w-full py-2 text-xs sm:text-sm bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
                onClick={clearCartHandler}
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
              
              {/* Trust Badges */}
              <div className="text-center text-xs text-gray-400 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <FaCheck className="text-green-400" />
                  <span>Secure Checkout</span>
                </div>
                <div>Free shipping on orders over $100</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
