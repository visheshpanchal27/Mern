import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetCartQuery, useClearCartMutation } from '../../redux/api/cartApiSlice';
import { useCreateOrderMutation } from '../../redux/api/orderApiSlice';
import { FaBolt, FaCheck, FaCreditCard, FaShieldAlt, FaTruck, FaEdit } from 'react-icons/fa';
import Loader from '../../components/Loader';

const ExpressCheckout = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStep, setOrderStep] = useState('review'); // review, payment, processing, success
  
  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/express-checkout');
    }
  }, [userInfo, navigate]);
  
  const cartItems = cart?.items || [];
  
  // Get saved addresses and payment methods
  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
  const savedPaymentMethod = localStorage.getItem('paymentMethod') || 'PayPal';
  
  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => 
      acc + item.qty * (item.product?.price || 0), 0
    );
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  }, [cartItems]);
  
  // Express order handler
  const handleExpressOrder = async () => {
    if (!savedAddress.address || !savedAddress.city) {
      toast.error('Please set up your shipping address first');
      navigate('/shipping');
      return;
    }
    
    setIsProcessing(true);
    setOrderStep('processing');
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        orderItems: cartItems.map(item => ({
          _id: item.product._id,
          qty: item.qty,
          price: item.product.price,
          name: item.product.name,
          image: item.product.image,
        })),
        shippingAddress: savedAddress,
        paymentMethod: savedPaymentMethod,
        itemsPrice: totals.subtotal,
        shippingPrice: totals.shipping,
        taxPrice: totals.tax,
        totalPrice: totals.total,
      };
      
      const result = await createOrder(orderData).unwrap();
      
      await clearCart().unwrap();
      
      setOrderStep('success');
      
      setTimeout(() => {
        navigate(`/order-summary/${result.trackingId}`);
      }, 3000);
      
    } catch (error) {
      toast.error(error?.data?.message || 'Order failed');
      setOrderStep('review');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cartLoading) return <Loader />;
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary px-6 py-3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaBolt className="text-orange-500 text-2xl" />
            <h1 className="text-3xl font-bold text-white">Express Checkout</h1>
          </div>
          <p className="text-gray-400">Complete your order in seconds</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['review', 'payment', 'processing', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  orderStep === step ? 'bg-orange-500 text-white' :
                  ['review', 'payment', 'processing'].indexOf(orderStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-600 text-gray-400'
                }`}>
                  {['review', 'payment', 'processing'].indexOf(orderStep) > index ? (
                    <FaCheck />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    ['review', 'payment', 'processing'].indexOf(orderStep) > index ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {orderStep === 'review' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="card-primary p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.product._id} className="flex items-center gap-4">
                      <img
                        src={item.product.image?.startsWith('http') 
                          ? item.product.image 
                          : `${import.meta.env.VITE_API_URL}${item.product.image}`
                        }
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.qty}</p>
                      </div>
                      <p className="text-white font-semibold">
                        ${(item.qty * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <hr className="border-gray-600 my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax:</span>
                    <span>${totals.tax}</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total:</span>
                    <span>${totals.total}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="card-primary p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaTruck className="text-blue-400" />
                    Shipping Address
                  </h3>
                  <button
                    onClick={() => navigate('/shipping')}
                    className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
                
                {savedAddress.address ? (
                  <div className="text-gray-300">
                    <p>{savedAddress.address}</p>
                    <p>{savedAddress.city}, {savedAddress.postalCode}</p>
                    <p>{savedAddress.country}</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">No shipping address set</p>
                    <button
                      onClick={() => navigate('/shipping')}
                      className="btn-primary px-4 py-2"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
              
              {/* Payment Method */}
              <div className="card-primary p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FaCreditCard className="text-green-400" />
                    Payment Method
                  </h3>
                  <button
                    onClick={() => navigate('/payment')}
                    className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                </div>
                
                <div className="text-gray-300">
                  <p>{savedPaymentMethod}</p>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="card-primary p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FaShieldAlt className="text-green-400 text-xl" />
                  <h3 className="text-lg font-semibold text-white">Secure Checkout</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-400" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-400" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-400" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>
              
              {/* Express Order Button */}
              <button
                onClick={handleExpressOrder}
                disabled={!savedAddress.address || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaBolt />
                Complete Express Order - ${totals.total}
              </button>
            </div>
          </div>
        )}
        
        {orderStep === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Processing Your Order</h2>
            <p className="text-gray-400">Please wait while we process your payment...</p>
          </div>
        )}
        
        {orderStep === 'success' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Order Successful!</h2>
            <p className="text-gray-400 mb-6">Your order has been placed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to order summary...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpressCheckout;