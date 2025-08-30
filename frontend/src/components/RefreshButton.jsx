import { useState, useRef } from 'react';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

const RefreshButton = ({ type = 'all', className = '', children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const lastClickRef = useRef(0);
  const { refreshAll, refreshProducts, refreshOrders, refreshUsers, refreshCategories } = useRealTimeUpdates();

  const handleRefresh = async () => {
    const now = Date.now();
    if (now - lastClickRef.current < 3000) {
      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), 1000);
      return;
    }
    
    lastClickRef.current = now;
    setIsRefreshing(true);
    
    try {
      switch (type) {
        case 'products':
          refreshProducts();
          break;
        case 'orders':
          refreshOrders();
          break;
        case 'users':
          refreshUsers();
          break;
        case 'categories':
          refreshCategories();
          break;
        default:
          refreshAll();
      }
      
      setTimeout(() => setIsRefreshing(false), 500);
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing || isThrottled}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
    >
      <svg
        className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {children || (isRefreshing ? 'Refreshing...' : isThrottled ? 'Wait...' : 'Refresh')}
    </button>
  );
};

export default RefreshButton;