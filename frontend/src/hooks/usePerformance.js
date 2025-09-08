import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Throttle hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Lazy loading hook
export const useLazyLoad = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isVisible;
};

// Memoized component wrapper
export const withMemo = (Component) => {
  return React.memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
};