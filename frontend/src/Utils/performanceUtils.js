import { useCallback, useMemo, useState, useEffect } from 'react';

// Memoized callback hook to prevent unnecessary re-renders
export const useStableCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

// Memoized value hook
export const useStableValue = (factory, deps) => {
  return useMemo(factory, deps);
};

// Debounce hook for search inputs
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};