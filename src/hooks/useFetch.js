// src/hooks/useFetch.js
// React Hook to perform declarative API queries using Axios.
// Manages loading state, error trapping, caching/refetching, and cleanup to avoid memory leaks.

import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Use refs to prevent dependency loops with options object
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(async (customUrl = null, customParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const fetchUrl = customUrl || url;
      const fetchParams = customParams || optionsRef.current.params;
      
      const response = await axiosInstance({
        url: fetchUrl,
        method: optionsRef.current.method || 'GET',
        params: fetchParams,
        data: optionsRef.current.body || optionsRef.current.data,
        ...optionsRef.current
      });
      
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message || 'API request failed');
      setLoading(false);
      throw err;
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData
  };
};

export default useFetch;
