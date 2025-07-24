import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/Cart/CartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaMoneyBillWave, FaPaypal, FaMousePointer } from "react-icons/fa";

const ShippingCountry = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

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

    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-10 px-4">
      <ProgressSteps step1 step2 />
      <div className="mt-12 flex justify-center">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl space-y-6"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Shipping Information</h1>

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
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-pink-500 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-pink-500 mr-3"
                />
                <FaPaypal className="text-blue-400 text-xl mr-2" />
                <span className="text-white">PayPal or Credit Card</span>
              </label>

              <label className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-pink-500 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={paymentMethod === "CashOnDelivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-pink-500 mr-3"
                />
                <FaMoneyBillWave className="text-green-400 text-xl mr-2" />
                <span className="text-white">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full text-lg transition ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
             
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingCountry;