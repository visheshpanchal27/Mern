import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/Cart/CartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaMoneyBillWave, FaPaypal, FaTruck, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

const ShippingCountry = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  
  // Check if this is buy now flow
  const urlParams = new URLSearchParams(window.location.search);
  const isBuyNow = urlParams.get('buyNow') === 'true';

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePostalCode = () => {
    if (postalCode && !/^\d+$/.test(postalCode)) {
      setErrors((prev) => ({ ...prev, postalCode: "Postal code must be numeric!" }));
    } else {
      setErrors((prev) => ({ ...prev, postalCode: "" }));
    }
  };

  const isFormValid =
    address && city && postalCode && country && !errors.postalCode;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const shippingData = { address, city, postalCode, country };

    dispatch(saveShippingAddress(shippingData));
    dispatch(savePaymentMethod(paymentMethod));

    // Save shipping address and payment method to localStorage
    localStorage.setItem("shippingAddress", JSON.stringify(shippingData));
    localStorage.setItem("paymentMethod", paymentMethod);

    navigate(isBuyNow ? "/placeorder?buyNow=true" : "/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <ProgressSteps step1 step2 />
        
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <FaTruck className="text-pink-500 text-2xl" />
              <h1 className="text-2xl font-bold text-white">Shipping Details</h1>
            </div>
            
            <form onSubmit={submitHandler} className="space-y-6">

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:outline-none text-white"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:outline-none text-white"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Postal Code</label>
            <input
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onBlur={validatePostalCode}
              required
              className={`w-full p-3 rounded-lg bg-gray-700 border ${
                errors.postalCode ? "border-red-500" : "border-gray-600"
              } focus:border-pink-500 focus:outline-none text-white`}
            />
            {errors.postalCode && (
              <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <input
              type="text"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-pink-500 focus:outline-none text-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaPaypal className="text-pink-500" />
              Choose Payment Method
            </label>
            <div className="grid gap-4">
              <label className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                paymentMethod === "PayPal" 
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" 
                  : "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-blue-500/5"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  paymentMethod === "PayPal" ? "border-blue-500 bg-blue-500" : "border-gray-400"
                }`}>
                  {paymentMethod === "PayPal" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <FaPaypal className="text-blue-400 text-2xl mr-3" />
                <div className="flex-1">
                  <span className="text-white font-medium">PayPal</span>
                  <p className="text-sm text-gray-400 mt-1">Secure payment with PayPal</p>
                </div>
                {paymentMethod === "PayPal" && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>

              <label className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                paymentMethod === "CashOnDelivery" 
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20" 
                  : "border-gray-600 bg-gray-700/50 hover:border-green-400 hover:bg-green-500/5"
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={paymentMethod === "CashOnDelivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  paymentMethod === "CashOnDelivery" ? "border-green-500 bg-green-500" : "border-gray-400"
                }`}>
                  {paymentMethod === "CashOnDelivery" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <FaMoneyBillWave className="text-green-400 text-2xl mr-3" />
                <div className="flex-1">
                  <span className="text-white font-medium">Cash on Delivery</span>
                  <p className="text-sm text-gray-400 mt-1">Pay when you receive your order</p>
                </div>
                {paymentMethod === "CashOnDelivery" && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-300 ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
              >
                <FaMapMarkerAlt className="text-sm" />
                Continue to Order
              </button>
            </form>
          </div>
          
          {/* Right Side - Info Panel */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-green-500 text-2xl" />
              <h2 className="text-xl font-bold text-white">Secure Checkout</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SSL Encrypted Transaction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Safe & Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fast Delivery Worldwide</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-xl border border-pink-500/20">
              <h3 className="text-white font-semibold mb-2">Delivery Information</h3>
              <p className="text-sm text-gray-400">Free shipping on orders over $100. Standard delivery takes 3-5 business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCountry;