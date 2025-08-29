import { useCallback, useMemo } from 'react';

// Optimized callback hook to prevent unnecessary re-renders
export const useOptimizedCallback = (callback, dependencies) => {
  return useCallback(callback, dependencies);
};

// Memoized value hook
export const useOptimizedMemo = (factory, dependencies) => {
  return useMemo(factory, dependencies);
};

// Debounced callback hook
export const useDebouncedCallback = (callback, delay, dependencies) => {
  return useCallback(
    useMemo(() => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
      };
    }, [callback, delay]),
    dependencies
  );
};