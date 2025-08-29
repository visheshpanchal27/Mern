import { useCallback, useMemo, useRef } from 'react';

// Optimized event handlers to prevent re-renders
export const useOptimizedHandlers = (handlers) => {
  return useMemo(() => {
    const optimizedHandlers = {};
    Object.keys(handlers).forEach(key => {
      optimizedHandlers[key] = useCallback(handlers[key], []);
    });
    return optimizedHandlers;
  }, [handlers]);
};

// Debounced callback hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Throttled callback hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};