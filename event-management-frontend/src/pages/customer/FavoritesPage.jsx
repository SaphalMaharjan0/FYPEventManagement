import React from "react";
import EventCard from "../../components/event/EventCard";

export default function FavoritesPage({ events, onBookClick }) {
  // Use a subset of events for favorites mock data
  const favorites = events.slice(0, 4);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>My Favorites</h1>
      <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem" }}>Events you've saved for later.</p>

      {favorites.length > 0 ? (
        <div className="cards-grid">
          {favorites.map((event) => (
            <EventCard key={event.id} event={event} onBookClick={() => onBookClick(event)} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>No favorites yet</h3>
          <p style={{ color: "var(--color-slate-500)" }}>When you find an event you like, click the heart icon to save it here.</p>
        </div>
      )}
    </div>
  );
}
