import { useState, useCallback } from 'react';
import { useFetch } from './useFetch';

export function useAuth() {
  const fetchWithAuth = useFetch();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const data = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  }, [fetchWithAuth]);

  const register = useCallback(async (userData) => {
    try {
      const data = await fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // Do not auto-login on registration
      return data.user;
    } catch (error) {
      throw error;
    }
  }, [fetchWithAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}
