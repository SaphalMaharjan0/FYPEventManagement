import React, { useState, useEffect } from "react";
import EventCard from "../../components/event/EventCard";
import { useFetch } from "../../hooks/useFetch";

export default function FavoritesPage({ onBookClick }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchWithAuth = useFetch();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth('/api/customer/favorites');
        setFavorites(data);
      } catch (err) {
        setError("Failed to load favorite events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [fetchWithAuth]);

  return (
    <div style={{ color: "var(--text-main)", fontFamily: "var(--font-body)" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-main)", marginBottom: "0.5rem" }}>My Favorites</h1>
      <p style={{ color: "var(--text-subtle)", marginBottom: "2rem" }}>Events you've saved for later.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-subtle)" }}>Loading favorites...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "red" }}>{error}</div>
      ) : favorites.length > 0 ? (
        <div className="cards-grid">
          {favorites.map((event) => (
            <EventCard 
              key={event.id || event.eventId} 
              event={event} 
              onBookClick={() => onBookClick(event)} 
              initialIsFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-main)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--text-main)", marginBottom: "0.5rem" }}>No favorites yet</h3>
          <p style={{ color: "var(--text-subtle)" }}>When you find an event you like, click the heart icon to save it here.</p>
        </div>
      )}
    </div>
  );
}
