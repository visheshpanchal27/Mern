import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useMemo, useCallback } from "react";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useGetCartQuery, useClearCartMutation } from "../../redux/api/cartApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Massage";
import ProgressSteps from "../../components/ProgressSteps";
import { FaCheck, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaTruck } from "react-icons/fa";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // Check if this is a buy now flow
  const urlParams = new URLSearchParams(window.location.search);
  const isBuyNow = urlParams.get('buyNow') === 'true';
  
  // Fetch cart from backend (skip if buy now)
  const { data: cart, isLoading: cartLoading, isError } = useGetCartQuery(undefined, {
    skip: isBuyNow
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  // Get items - either single buy now product or cart items
  const cartItems = isBuyNow 
    ? (() => {
        const buyNowProduct = localStorage.getItem('buyNowProduct');
        return buyNowProduct ? [JSON.parse(buyNowProduct)] : [];
      })()
    : cart?.items || [];

  const shippingAddress =
    cart?.shippingAddress || JSON.parse(localStorage.getItem("shippingAddress")) || {};

  const paymentMethod =
    cart?.paymentMethod || localStorage.getItem("paymentMethod") || "CashOnDelivery";

  // Promo code functions
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const response = await fetch(`https://mernbackend-tmp5.onrender.com/api/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode })
      });
      
      const result = await response.json();
      
      if (result.valid) {
        setPromoDiscount(result.discount);
        setPromoApplied(true);
        toast.success(`Promo code applied! ${result.discount}% discount`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to validate promo code');
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    toast.info('Promo code removed');
  };

  // Enhanced price calculations with memoization
  const priceCalculations = useMemo(() => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => {
        const price = isBuyNow ? item.price : item.product.price;
        return acc + item.qty * price;
      },
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2)); // 8% tax
    const processingFee = itemsPrice > 50 ? 0 : 2.99;
    const discountAmount = promoApplied ? (itemsPrice * promoDiscount / 100) : 0;
    const totalPrice = (itemsPrice + shippingPrice + taxPrice + processingFee - discountAmount).toFixed(2);
    
    return { itemsPrice, shippingPrice, taxPrice, processingFee, discountAmount, totalPrice };
  }, [cartItems, isBuyNow, promoApplied, promoDiscount]);
  
  const { itemsPrice, shippingPrice, taxPrice, processingFee, discountAmount, totalPrice } = priceCalculations;

  // Enhanced Place Order Handler
  const placeOrderHandler = useCallback(async () => {
    // Comprehensive validation
    const { address, city, postalCode, country } = shippingAddress || {};
    if (!address || !city || !postalCode || !country) {
      toast.error("Please complete your shipping address before placing the order.");
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate order processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await createOrder({
        orderItems: cartItems.map((item) => ({
          _id: isBuyNow ? item._id : item.product._id,
          qty: item.qty,
          price: isBuyNow ? item.price : item.product.price,
          name: isBuyNow ? item.name : item.product.name,
          image: isBuyNow ? item.image : item.product.image,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        processingFee,
        totalPrice,
        isBuyNow,
      }).unwrap();

      setOrderCreated(true);
      setOrderConfirmed(true);
      
      // Handle different payment methods
      if (paymentMethod === 'PayPal') {
        toast.success("🎉 Order created! Redirecting to PayPal...");
        navigate(`/order/${res._id}`);
      } else {
        toast.success("🎉 Order placed successfully!");
        navigate(`/order-summary/${res.trackingId}`);
      }
      
      // Clear data after navigation
      if (isBuyNow) {
        localStorage.removeItem('buyNowProduct');
      } else {
        await clearCart().unwrap();
      }
      
    } catch (err) {
      toast.error(err?.data?.error || "Something went wrong");
      setIsProcessing(false);
    }
  }, [cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, processingFee, totalPrice, createOrder, clearCart, navigate]);


  if (!isBuyNow && cartLoading) return <Loader />;
  if (!isBuyNow && isError) return <Message variant="danger">Failed to load cart</Message>;

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cartItems.length === 0 && !orderCreated ? (
          <Message>{isBuyNow ? "Buy now product not found" : "Your cart is empty"}</Message>
        ) : orderCreated ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white text-lg">Processing your order...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <td className="px-1 py-2 text-left">Image</td>
                    <td className="px-1 py-2 text-left">Product</td>
                    <td className="px-1 py-2 text-left">Qty</td>
                    <td className="px-1 py-2 text-left">Price</td>
                    <td className="px-1 py-2 text-left">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const product = isBuyNow ? item : item.product;
                    return (
                      <tr key={product._id}>
                        <td className="p-2">
                          <img
                            src={
                              product.image?.startsWith("http")
                                ? product.image
                                : `${import.meta.env.VITE_API_URL}${product.image}`
                            }
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-2">
                          <Link to={`/product/${product._id}`}>
                            {product.name}
                          </Link>
                        </td>
                        <td className="p-2">{item.qty}</td>
                        <td className="p-2">${product.price.toFixed(2)}</td>
                        <td className="p-2">
                          ${(item.qty * product.price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced Order Summary */}
            <div className="mt-8 grid lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
                
                {/* Price Breakdown */}
                <div className="bg-[#181818] p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Price Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Items ({cartItems.length}):</span>
                      <span>${itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className={shippingPrice === 0 ? 'text-green-400' : ''}>
                        {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${taxPrice.toFixed(2)}</span>
                    </div>
                    {processingFee > 0 && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Processing Fee:</span>
                        <span>${processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {promoApplied && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({promoDiscount}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-xl font-bold text-pink-400">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Info */}
                <div className="bg-[#181818] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaTruck className="text-blue-400" />
                    Shipping Address
                  </h3>
                  <p className="text-gray-300">
                    {shippingAddress.address}<br />
                    {shippingAddress.city}, {shippingAddress.postalCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
                
                {/* Payment Info */}
                <div className="bg-[#181818] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {paymentMethod === 'PayPal' ? <FaCreditCard className="text-blue-400" /> : <FaMoneyBillWave className="text-green-400" />}
                    Payment Method
                  </h3>
                  <p className="text-gray-300">{paymentMethod}</p>
                </div>
              </div>
              
              {/* Order Actions */}
              <div className="space-y-6">
                {/* Security Features */}
                <div className="bg-[#181818] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-green-400" />
                    Secure Checkout
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-400" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-400" />
                      <span>Secure Payment Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-400" />
                      <span>Money Back Guarantee</span>
                    </div>
                  </div>
                </div>
                
                {/* Promo Code Section */}
                <div className="bg-[#181818] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Promo Code</h3>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-green-500/20 border border-green-500 rounded-lg p-3">
                      <span className="text-green-400 font-medium">Code Applied: {promoCode.toUpperCase()}</span>
                      <button
                        onClick={removePromoCode}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code (VISHESH, INFINITY)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Place Order Button */}
                <div className="space-y-4">
                  {orderConfirmed ? (
                    <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg text-center">
                      <FaCheck className="mx-auto mb-2 text-2xl" />
                      <p className="font-semibold">Order Confirmed!</p>
                      <p className="text-sm">Redirecting to order summary...</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg text-lg font-semibold flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cartItems.length === 0 || isLoading || isProcessing}
                      onClick={placeOrderHandler}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                          Processing Order...
                        </>
                      ) : isLoading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Place Order - ${totalPrice}
                        </>
                      )}
                    </button>
                  )}
                  
                  <p className="text-xs text-gray-400 text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
