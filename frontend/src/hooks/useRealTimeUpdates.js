import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../redux/api/apiSlice';

export const useRealTimeUpdates = () => {
  const dispatch = useDispatch();
  const lastRefreshRef = useRef({});
  const THROTTLE_TIME = 3000; // 3 seconds throttle

  const throttledRefresh = (tags, key) => {
    const now = Date.now();
    if (!lastRefreshRef.current[key] || now - lastRefreshRef.current[key] > THROTTLE_TIME) {
      dispatch(apiSlice.util.invalidateTags(tags));
      lastRefreshRef.current[key] = now;
    }
  };

  const refreshAll = () => {
    throttledRefresh(['Product', 'Order', 'User', 'Category', 'Cart'], 'all');
  };

  const refreshProducts = () => {
    throttledRefresh(['Product'], 'products');
  };

  const refreshOrders = () => {
    throttledRefresh(['Order'], 'orders');
  };

  const refreshUsers = () => {
    throttledRefresh(['User'], 'users');
  };

  const refreshCategories = () => {
    throttledRefresh(['Category'], 'categories');
  };

  return {
    refreshAll,
    refreshProducts,
    refreshOrders,
    refreshUsers,
    refreshCategories
  };
};