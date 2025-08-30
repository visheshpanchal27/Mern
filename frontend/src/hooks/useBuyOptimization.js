import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddToCartMutation } from '../redux/api/cartApiSlice';
import { useCreateOrderMutation } from '../redux/api/orderApiSlice';

export const useBuyOptimization = (product) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [addToCart] = useAddToCartMutation();
  const [createOrder] = useCreateOrderMutation();
  
  const [buyState, setBuyState] = useState({
    isAddingToCart: false,
    isOneClickBuying: false,
    addedToCart: false,
    quantity: 1,
    stockAlert: false,
  });

  // Stock monitoring
  useEffect(() => {
    if (product?.countInStock <= 5 && product?.countInStock > 0) {
      setBuyState(prev => ({ ...prev, stockAlert: true }));
    } else {
      setBuyState(prev => ({ ...prev, stockAlert: false }));
    }
  }, [product?.countInStock]);

  // Optimized add to cart
  const optimizedAddToCart = useCallback(async (qty = buyState.quantity) => {
    if (!product?._id) {
      toast.error("Product not available");
      return false;
    }
    
    if (qty > product.countInStock) {
      toast.error(`Only ${product.countInStock} items available`);
      return false;
    }
    
    setBuyState(prev => ({ ...prev, isAddingToCart: true }));
    
    try {
      await addToCart({ _id: product._id, qty }).unwrap();
      
      setBuyState(prev => ({ 
        ...prev, 
        addedToCart: true, 
        isAddingToCart: false 
      }));
      
      toast.success("🛒 Added to cart!");
      
      // Auto-hide success state
      setTimeout(() => {
        setBuyState(prev => ({ ...prev, addedToCart: false }));
      }, 2000);
      
      return true;
    } catch (error) {
      setBuyState(prev => ({ ...prev, isAddingToCart: false }));
      
      if (error?.status === 401) {
        toast.error("Please login to add items to cart");
        navigate("/login");
      } else {
        toast.error(error?.data?.message || "Failed to add to cart");
      }
      
      return false;
    }
  }, [product, buyState.quantity, addToCart, navigate]);

  // One-click buy
  const oneClickBuy = useCallback(async (qty = buyState.quantity) => {
    if (!userInfo) {
      toast.error("Please login to buy now");
      navigate("/login");
      return false;
    }
    
    setBuyState(prev => ({ ...prev, isOneClickBuying: true }));
    
    try {
      const success = await optimizedAddToCart(qty);
      if (success) {
        navigate("/shipping");
        toast.success("🚀 Proceeding to checkout!");
      }
      return success;
    } catch (error) {
      toast.error("Failed to process order");
      return false;
    } finally {
      setBuyState(prev => ({ ...prev, isOneClickBuying: false }));
    }
  }, [userInfo, buyState.quantity, optimizedAddToCart, navigate]);

  // Bulk add to cart
  const bulkAddToCart = useCallback(async (items) => {
    setBuyState(prev => ({ ...prev, isAddingToCart: true }));
    
    try {
      const promises = items.map(item => 
        addToCart({ _id: item.productId, qty: item.quantity }).unwrap()
      );
      
      await Promise.all(promises);
      toast.success(`🛒 Added ${items.length} items to cart!`);
      return true;
    } catch (error) {
      toast.error("Failed to add items to cart");
      return false;
    } finally {
      setBuyState(prev => ({ ...prev, isAddingToCart: false }));
    }
  }, [addToCart]);

  // Smart quantity validation
  const validateQuantity = useCallback((qty) => {
    if (!product) return false;
    
    if (qty < 1) {
      toast.warning("Quantity must be at least 1");
      return false;
    }
    
    if (qty > product.countInStock) {
      toast.warning(`Only ${product.countInStock} items available`);
      return false;
    }
    
    if (qty > 10) {
      toast.info("For bulk orders, please contact support");
      return false;
    }
    
    return true;
  }, [product]);

  // Update quantity with validation
  const updateQuantity = useCallback((qty) => {
    if (validateQuantity(qty)) {
      setBuyState(prev => ({ ...prev, quantity: qty }));
      return true;
    }
    return false;
  }, [validateQuantity]);

  // Quick actions
  const incrementQuantity = useCallback(() => {
    const newQty = buyState.quantity + 1;
    return updateQuantity(newQty);
  }, [buyState.quantity, updateQuantity]);

  const decrementQuantity = useCallback(() => {
    const newQty = buyState.quantity - 1;
    return updateQuantity(newQty);
  }, [buyState.quantity, updateQuantity]);

  // Buy now with express checkout
  const expressCheckout = useCallback(async () => {
    if (!userInfo) {
      navigate("/login?redirect=/express-checkout");
      return;
    }
    
    try {
      setBuyState(prev => ({ ...prev, isOneClickBuying: true }));
      
      // Add to cart and proceed to express checkout
      const success = await optimizedAddToCart();
      if (success) {
        navigate("/express-checkout");
      }
    } finally {
      setBuyState(prev => ({ ...prev, isOneClickBuying: false }));
    }
  }, [userInfo, optimizedAddToCart, navigate]);

  return {
    // State
    ...buyState,
    
    // Actions
    optimizedAddToCart,
    oneClickBuy,
    bulkAddToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    expressCheckout,
    validateQuantity,
    
    // Computed values
    canAddToCart: product?.countInStock > 0 && !buyState.isAddingToCart,
    maxQuantity: Math.min(product?.countInStock || 0, 10),
    isLowStock: product?.countInStock <= 5 && product?.countInStock > 0,
    isOutOfStock: product?.countInStock === 0,
  };
};

export default useBuyOptimization;