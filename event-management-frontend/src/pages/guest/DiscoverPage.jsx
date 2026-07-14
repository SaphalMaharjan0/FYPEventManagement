import React from "react";
import EventCard from "../../components/event/EventCard";
import BrowseCategories from "../../components/common/BrowseCategories";
import { Compass, TrendingUp, Star } from "lucide-react";

export default function DiscoverPage({ events, categories, onBookClick, setActiveCategory }) {
  // Simple logic to feature some events and recommend others
  const trendingEvents = events.filter((e) => e.featured).slice(0, 3);
  const recommendedEvents = events.filter((e) => !e.featured).slice(0, 3);

  return (
    <div style={{ paddingTop: "8rem", paddingBottom: "5rem", minHeight: "80vh", backgroundColor: "#f8fafc" }}>
      <div className="container">
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <Compass size={32} color="var(--primary)" />
            Discover
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Find your next unforgettable experience.
          </p>
        </div>

        {/* Categories Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--text-dark)" }}>Explore Categories</h3>
          <BrowseCategories categories={categories} activeCategory="all" setActiveCategory={setActiveCategory} />
        </section>

        {/* Trending Events */}
        {trendingEvents.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={24} color="#ef4444" />
              Trending Now
            </h3>
            <div className="cards-grid">
              {trendingEvents.map((event) => (
                <EventCard key={event.id} event={event} onBook={() => onBookClick(event)} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Events */}
        {recommendedEvents.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={24} color="#eab308" />
              Recommended For You
            </h3>
            <div className="cards-grid">
              {recommendedEvents.map((event) => (
                <EventCard key={event.id} event={event} onBook={() => onBookClick(event)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
