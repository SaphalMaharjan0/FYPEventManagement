import { useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export function useFetch() {
  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      const contentType = response.headers.get("content-type");
      let data = null;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data?.message || data || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  return fetchWithAuth;
}
