import { toast } from 'react-toastify';

// Cart optimization utilities
export const cartOptimization = {
  // Calculate cart totals with discounts
  calculateTotals: (cartItems, promoCode = '') => {
    const subtotal = cartItems.reduce((acc, item) => 
      acc + item.qty * (item.product?.price || 0), 0
    );
    
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const processingFee = subtotal > 50 ? 0 : 2.99;
    
    // Apply discounts
    let discount = 0;
    if (promoCode === 'SAVE10') {
      discount = subtotal * 0.1;
    } else if (promoCode === 'SAVE20') {
      discount = subtotal * 0.2;
    } else if (promoCode === 'FREESHIP') {
      discount = shipping;
    }
    
    const total = Math.max(0, subtotal + shipping + tax + processingFee - discount);
    
    return {
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      processingFee: Number(processingFee.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount: cartItems.reduce((acc, item) => acc + item.qty, 0)
    };
  },

  // Validate promo codes
  validatePromoCode: (code) => {
    const validCodes = {
      'SAVE10': { discount: 0.1, type: 'percentage', description: '10% off your order' },
      'SAVE20': { discount: 0.2, type: 'percentage', description: '20% off your order' },
      'FREESHIP': { discount: 'shipping', type: 'shipping', description: 'Free shipping' },
      'WELCOME': { discount: 0.15, type: 'percentage', description: '15% welcome discount' },
      'BULK25': { discount: 0.25, type: 'percentage', description: '25% off bulk orders', minItems: 5 }
    };
    
    return validCodes[code.toUpperCase()] || null;
  },

  // Smart cart recommendations
  getCartRecommendations: (cartItems) => {
    const recommendations = [];
    const subtotal = cartItems.reduce((acc, item) => 
      acc + item.qty * (item.product?.price || 0), 0
    );
    
    // Free shipping recommendation
    if (subtotal > 80 && subtotal < 100) {
      recommendations.push({
        type: 'shipping',
        message: `Add $${(100 - subtotal).toFixed(2)} more for free shipping!`,
        action: 'Add more items'
      });
    }
    
    // Bulk discount recommendation
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    if (totalItems >= 3 && totalItems < 5) {
      recommendations.push({
        type: 'discount',
        message: 'Add 2 more items to unlock 25% bulk discount!',
        action: 'Browse products'
      });
    }
    
    // Low stock warning
    const lowStockItems = cartItems.filter(item => 
      item.product?.countInStock <= 3 && item.product?.countInStock > 0
    );
    if (lowStockItems.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${lowStockItems.length} item(s) are low in stock. Order soon!`,
        action: 'Checkout now'
      });
    }
    
    return recommendations;
  },

  // Optimize cart for checkout
  optimizeForCheckout: (cartItems) => {
    // Remove out of stock items
    const availableItems = cartItems.filter(item => 
      item.product?.countInStock > 0
    );
    
    // Adjust quantities for items with limited stock
    const optimizedItems = availableItems.map(item => {
      if (item.qty > item.product.countInStock) {
        toast.warning(
          `${item.product.name} quantity reduced to ${item.product.countInStock} (available stock)`
        );
        return { ...item, qty: item.product.countInStock };
      }
      return item;
    });
    
    return optimizedItems;
  },

  // Save cart state
  saveCartState: (cartItems, userInfo) => {
    if (userInfo) {
      // Save to server for logged-in users
      localStorage.setItem(`cart_${userInfo._id}`, JSON.stringify({
        items: cartItems,
        timestamp: Date.now()
      }));
    } else {
      // Save to localStorage for guests
      localStorage.setItem('guest_cart', JSON.stringify({
        items: cartItems,
        timestamp: Date.now()
      }));
    }
  },

  // Restore cart state
  restoreCartState: (userInfo) => {
    try {
      const key = userInfo ? `cart_${userInfo._id}` : 'guest_cart';
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const { items, timestamp } = JSON.parse(saved);
        
        // Check if cart is not too old (7 days)
        const isExpired = Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000;
        
        if (!isExpired) {
          return items;
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Failed to restore cart state:', error);
    }
    
    return [];
  },

  // Merge guest cart with user cart
  mergeGuestCart: async (guestCart, userCart, updateCartMutation) => {
    try {
      const mergedItems = [...userCart];
      
      guestCart.forEach(guestItem => {
        const existingItem = mergedItems.find(item => 
          item.product._id === guestItem.product._id
        );
        
        if (existingItem) {
          // Combine quantities
          existingItem.qty = Math.min(
            existingItem.qty + guestItem.qty,
            guestItem.product.countInStock
          );
        } else {
          mergedItems.push(guestItem);
        }
      });
      
      // Update cart on server
      const cartData = mergedItems.map(item => ({
        product: item.product._id,
        qty: item.qty
      }));
      
      await updateCartMutation(cartData).unwrap();
      
      // Clear guest cart
      localStorage.removeItem('guest_cart');
      
      toast.success('Cart items merged successfully!');
      return mergedItems;
    } catch (error) {
      toast.error('Failed to merge cart items');
      return userCart;
    }
  },

  // Quick add multiple items
  quickAddMultiple: async (products, addToCartMutation) => {
    try {
      const promises = products.map(({ productId, quantity }) =>
        addToCartMutation({ _id: productId, qty: quantity }).unwrap()
      );
      
      await Promise.all(promises);
      toast.success(`Added ${products.length} items to cart!`);
      return true;
    } catch (error) {
      toast.error('Failed to add items to cart');
      return false;
    }
  },

  // Smart quantity suggestions
  getQuantitySuggestions: (product, currentQty) => {
    const suggestions = [];
    const stock = product?.countInStock || 0;
    
    if (stock > 0) {
      // Common quantities
      const commonQtys = [1, 2, 3, 5, 10].filter(qty => 
        qty <= stock && qty !== currentQty
      );
      
      suggestions.push(...commonQtys.map(qty => ({
        qty,
        label: `${qty} item${qty > 1 ? 's' : ''}`,
        savings: qty >= 5 ? '5% bulk discount' : null
      })));
      
      // Max available
      if (stock > 10 && currentQty < stock) {
        suggestions.push({
          qty: stock,
          label: `All ${stock} available`,
          savings: 'Maximum quantity'
        });
      }
    }
    
    return suggestions;
  }
};

export default cartOptimization;