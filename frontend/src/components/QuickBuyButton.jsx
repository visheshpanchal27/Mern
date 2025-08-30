import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaBolt, FaShoppingCart } from 'react-icons/fa';
import { useAddToCartMutation } from '../redux/api/cartApiSlice';

const QuickBuyButton = ({ 
  product, 
  quantity = 1, 
  variant = 'primary', // primary, secondary, icon-only
  size = 'md', // sm, md, lg
  className = '',
  showAddToCart = true 
}) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickBuy = async () => {
    if (!userInfo) {
      toast.error('Please login to buy now');
      navigate('/login');
      return;
    }

    if (!product?._id || quantity > product.countInStock) {
      toast.error('Product not available or insufficient stock');
      return;
    }

    setIsProcessing(true);

    try {
      await addToCart({ _id: product._id, qty: quantity }).unwrap();
      navigate('/express-checkout');
      toast.success('🚀 Proceeding to express checkout!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product?._id || quantity > product.countInStock) {
      toast.error('Product not available or insufficient stock');
      return;
    }

    setIsProcessing(true);

    try {
      await addToCart({ _id: product._id, qty: quantity }).unwrap();
      setJustAdded(true);
      toast.success('🛒 Added to cart!');
      
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      if (error?.status === 401) {
        toast.error('Please login to add items to cart');
        navigate('/login');
      } else {
        toast.error(error?.data?.message || 'Failed to add to cart');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white',
    secondary: 'bg-pink-600 hover:bg-pink-700 text-white',
    'icon-only': 'bg-gray-700 hover:bg-gray-600 text-white p-2'
  };

  const baseClasses = `
    font-medium rounded-lg transition-all duration-200 
    flex items-center justify-center gap-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-105 active:scale-95
    ${sizeClasses[size]} 
    ${variantClasses[variant]}
    ${className}
  `;

  if (product?.countInStock === 0) {
    return (
      <button
        disabled
        className={`${baseClasses} bg-gray-600 cursor-not-allowed hover:scale-100`}
      >
        Out of Stock
      </button>
    );
  }

  if (variant === 'icon-only') {
    return (
      <div className="flex gap-2">
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isProcessing}
            className={baseClasses}
            title="Add to Cart"
          >
            {isProcessing ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : justAdded ? (
              <span className="text-green-400">✓</span>
            ) : (
              <FaShoppingCart />
            )}
          </button>
        )}
        
        <button
          onClick={handleQuickBuy}
          disabled={isProcessing}
          className={baseClasses}
          title="Quick Buy"
        >
          {isProcessing ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <FaBolt />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 w-full">
      {showAddToCart && (
        <button
          onClick={handleAddToCart}
          disabled={isProcessing}
          className={`${baseClasses} flex-1`}
        >
          {isProcessing ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : justAdded ? (
            <>
              <span className="text-green-400">✓</span>
              Added
            </>
          ) : (
            <>
              <FaShoppingCart className="text-sm" />
              Add to Cart
            </>
          )}
        </button>
      )}
      
      <button
        onClick={handleQuickBuy}
        disabled={isProcessing}
        className={`${baseClasses} ${showAddToCart ? 'flex-1' : 'w-full'}`}
      >
        {isProcessing ? (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            <FaBolt className="text-sm" />
            Buy Now
          </>
        )}
      </button>
    </div>
  );
};

export default QuickBuyButton;