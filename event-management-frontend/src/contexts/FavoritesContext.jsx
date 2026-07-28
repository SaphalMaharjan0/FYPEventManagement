import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children, currentUser }) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const fetchWithAuth = useFetch();

  // Load favorites when user changes (logs in/out)
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      const loadFavorites = async () => {
        setIsLoading(true);
        try {
          const data = await fetchWithAuth('/api/customer/favorites');
          // data is an array of EventDto objects
          const ids = new Set(data.map(event => event.id || event.eventId));
          setFavoriteIds(ids);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadFavorites();
    } else {
      // Clear if logged out
      setFavoriteIds(new Set());
    }
  }, [currentUser, fetchWithAuth]);

  const toggleFavorite = async (eventId) => {
    if (!currentUser || currentUser.role !== 'customer') return false;
    
    // Optimistic UI update
    const isCurrentlyFavorite = favoriteIds.has(eventId);
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyFavorite) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });

    try {
      const response = await fetchWithAuth(`/api/customer/favorites/${eventId}`, {
        method: "POST"
      });
      
      // Sync with real response if needed, but optimistic usually works
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        if (response.isFavorited) {
          newSet.add(eventId);
        } else {
          newSet.delete(eventId);
        }
        return newSet;
      });
      return response.isFavorited;
    } catch (error) {
      // Revert on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyFavorite) {
          newSet.add(eventId);
        } else {
          newSet.delete(eventId);
        }
        return newSet;
      });
      console.error("Failed to toggle favorite:", error);
      return isCurrentlyFavorite;
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
};
