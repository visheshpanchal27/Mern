import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useClearCartMutation,
} from "../redux/api/cartApiSlice";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading, isError } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const cartItems = cart?.items || [];

  // Separate states for loaders
  const [updatingQtyId, setUpdatingQtyId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  // Update item quantity
  const updateCartHandler = async (product, qty) => {
    try {
      setUpdatingQtyId(product._id);
      const updatedItems = cartItems.map((i) =>
        i.product._id === product._id
          ? { product: product._id, qty }
          : { product: i.product._id, qty: i.qty }
      );
      await updateCart(updatedItems).unwrap();
      setTimeout(() => setUpdatingQtyId(null), 300);
    } catch (error) {
      alert("Update cart failed: " + (error?.data || error.message));
      setUpdatingQtyId(null);
    }
  };

  // Remove item from cart
  const removeFromCartHandler = async (id) => {
    try {
      setRemovingItemId(id);
      const updatedItems = cartItems
        .filter((item) => item.product._id !== id)
        .map((i) => ({ product: i.product._id, qty: i.qty }));
      await updateCart(updatedItems).unwrap();
      setTimeout(() => setRemovingItemId(null), 300);
    } catch (error) {
      alert("Remove from cart failed: " + (error?.data || error.message));
      setRemovingItemId(null);
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const clearCartHandler = async () => {
    try {
      await clearCart().unwrap();
    } catch (error) {
      alert("Clear cart failed: " + (error?.data || error.message));
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        Failed to load cart.
      </div>
    );

  return (
    <div className="w-full min-h-screen overflow-hidden px-2 sm:px-4 pt-4 sm:pt-6 bg-black">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white border border-gray-600 py-2 px-3 sm:px-4 rounded-full hover:bg-gray-700 transition duration-300 cursor-pointer mb-4 sm:mb-6 text-sm sm:text-base"
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
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-full transition duration-300 cursor-pointer text-sm sm:text-base"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 min-h-[calc(100vh-8rem)]">
          {/* Scrollable Cart List */}
          <div className="flex-1 lg:pr-4 overflow-y-auto scroll-smooth custom-scroll">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Shopping Cart</h1>

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 pb-4 border-b border-gray-700 gap-3 sm:gap-0"
                >
                  <div className="flex w-full sm:w-auto gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                      <img
                        src={
                          item.product.image?.startsWith("http")
                            ? item.product.image
                            : `${import.meta.env.VITE_API_URL}${item.product.image}`
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-pink-500 hover:underline cursor-pointer text-sm sm:text-base font-medium"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-white text-xs sm:text-sm">{item.product.brand}</div>
                      <div className="mt-1 font-bold text-white text-sm sm:text-base">${item.product.price}</div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Subtotal: ${(item.qty * item.product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:ml-4 gap-3">
                    <div className="w-20 sm:w-24 relative">
                      {updatingQtyId === item.product._id ? (
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
                          {[...Array(item.product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <button
                      className="text-red-500 hover:text-white cursor-pointer p-2"
                      title="Remove item"
                      onClick={() => removeFromCartHandler(item.product._id)}
                      disabled={removingItemId === item.product._id}
                    >
                      {removingItemId === item.product._id ? (
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

          {/* Checkout Summary */}
          <div className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 lg:pl-4">
            <div className="p-4 sm:p-6 rounded-lg border border-gray-700 text-white bg-[#1a1a1a] lg:sticky lg:top-10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>
              <div className="text-xl sm:text-2xl font-bold mb-4">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.product.price, 0)
                  .toFixed(2)}
              </div>

              <button
                className="bg-pink-500 w-full py-3 rounded-full text-sm sm:text-lg hover:bg-pink-600 transition-colors duration-200 cursor-pointer"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>

              <button
                className="bg-red-600 w-full py-2 mt-4 rounded-full text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                onClick={clearCartHandler}
                disabled={isClearing}
              >
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
