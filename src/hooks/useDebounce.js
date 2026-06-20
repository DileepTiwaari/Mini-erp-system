// src/hooks/useDebounce.js
// React Hook to debounce high-frequency state changes (like keyboard entries in the search bar).
// Reduces unnecessary API calls and component re-renders.

import { useState, useEffect } from 'react';

export const useDebounce = (val, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [val, delay]);

  return debouncedValue;
};

export default useDebounce;
