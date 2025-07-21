import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddToCartMutation, useGetCartQuery, useUpdateCartMutation, useClearCartMutation } from "../redux/api/cartApiSlice";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";

const Cart = () => {
  const navigate = useNavigate();

  // RTK Query hooks for cart API
  const { data: cart, isLoading, isError, refetch } = useGetCartQuery();
  const [addToCart] = useAddToCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [clearCart] = useClearCartMutation();

  const cartItems = cart?.items || [];

  // Add/Update item quantity
  const addToCartHandler = async (product, qty) => {
    try {
      await addToCart({ _id: product.product || product._id, qty }).unwrap();
      refetch();
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  // Remove item from cart
  const removeFromCartHandler = async (id) => {
    try {
      const updatedItems = cartItems.filter((item) => item.product._id !== id);
      await updateCart(updatedItems).unwrap();
      refetch();
    } catch (error) {
      console.error("Remove from cart failed", error);
    }
  };

  // Proceed to checkout
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  // Clear entire cart
  const clearCartHandler = async () => {
    await clearCart();
    refetch();
  };

  if (isLoading) return <div className="text-white p-6">Loading cart...</div>;
  if (isError) return <div className="text-red-500 p-6">Failed to load cart</div>;

  return (
    <div className="w-full h-screen overflow-hidden px-4 pt-6">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white border border-gray-600 py-2 px-4 rounded-full hover:bg-gray-700 transition duration-300 cursor-pointer mb-6"
      >
        <IoArrowBackSharp />
        Go Back
      </button>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 space-y-6">
          <FaShoppingCart className="text-7xl text-gray-500" />
          <h2 className="text-2xl font-semibold text-white">Your Cart is Empty</h2>
          <p className="text-gray-400">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition duration-300 cursor-pointer"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-6rem)]">
          {/* Scrollable Cart List */}
          <div className="flex-1 pr-4 overflow-y-auto scroll-smooth custom-scroll max-h-[calc(100vh-6rem)]">
            <h1 className="text-2xl font-semibold mb-4 text-white">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center mb-6 pb-4 border-b border-gray-700"
              >
                <div className="w-[5rem] h-[5rem] flex-shrink-0">
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

                <div className="flex-1 ml-4">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="text-pink-500 hover:underline cursor-pointer"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-1 text-white">{item.product.brand}</div>
                  <div className="mt-1 font-bold text-white">${item.product.price}</div>
                  <div className="text-sm text-gray-400">
                    Subtotal: ${(item.qty * item.product.price).toFixed(2)}
                  </div>
                </div>

                <div className="w-24">
                  <select
                    className="w-full p-1 rounded bg-[#1f1f1f] border border-gray-600 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item.product, Number(e.target.value))
                    }
                  >
                    {[...Array(item.product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="text-red-500 hover:text-white ml-6 cursor-pointer"
                  title="Remove item"
                  onClick={() => removeFromCartHandler(item.product._id)}
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            ))}
          </div>

          {/* Sticky Checkout Summary */}
          <div className="w-[350px] flex-shrink-0 pl-4">
            <div className="p-6 rounded-lg border border-gray-700 text-white bg-[#1a1a1a] sticky top-10">
              <h2 className="text-xl font-semibold mb-3">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>
              <div className="text-2xl font-bold mb-4">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.product.price, 0)
                  .toFixed(2)}
              </div>

              <button
                className="bg-pink-500 w-full py-3 rounded-full text-lg hover:bg-pink-600 transition-colors duration-200 cursor-pointer"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>

              <button
                className="bg-red-600 w-full py-2 mt-4 rounded-full text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                onClick={clearCartHandler}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
