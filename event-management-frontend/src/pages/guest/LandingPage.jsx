import React from "react";
import Hero from "../../components/common/Hero";
import StatCard from "../../components/dashboard/StatCard";
import BrowseCategories from "../../components/common/BrowseCategories";
import EventCard from "../../components/event/EventCard";
import HostBanner from "../../components/common/HostBanner";
import Testimonials from "../../components/common/Testimonials";
import { X } from "lucide-react";

export default function LandingPage({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearchSubmit,
  featuredEvents,
  upcomingEvents,
  onBookClick,
  onViewAllEvents,
  onCategorySelect,
  onResetFilters,
  onNavigateToRegister,
}) {
  return (
    <>
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSearchSubmit={onSearchSubmit}
      />

      <StatCard />

      <main className="container" id="featured" style={{ minHeight: "20rem" }}>
        {activeCategory !== "all" && (
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Filtering by:
            </span>
            <span
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {activeCategory.toUpperCase()}
              <X
                size={14}
                style={{ cursor: "pointer" }}
                onClick={onResetFilters}
              />
            </span>
          </div>
        )}

        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">
              Hand-picked experiences you won't want to miss
            </p>
          </div>
          <span
            style={{ cursor: "pointer" }}
            onClick={onViewAllEvents}
            className="section-link"
          >
            <span>View all</span>
            <span>&rarr;</span>
          </span>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="cards-grid">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onBookClick={onBookClick} />
            ))}
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "3rem 0",
            }}
          >
            No featured events match the active filters.
          </p>
        )}

        <BrowseCategories
          activeCategory={activeCategory}
          setActiveCategory={onCategorySelect}
          categories={categories}
        />

        <div className="section-header" style={{ marginTop: "4rem" }}>
          <div className="section-title-area">
            <h2 className="section-title">Upcoming This Month</h2>
            <p className="section-subtitle">
              Trending events in your neighborhood
            </p>
          </div>
          <span
            style={{ cursor: "pointer" }}
            onClick={onViewAllEvents}
            className="section-link"
          >
            <span>See more</span>
            <span>&rsaquo;</span>
          </span>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="cards-grid">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onBookClick={onBookClick} />
            ))}
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "3rem 0",
            }}
          >
            No upcoming events match the active filters.
          </p>
        )}

        <div
          id="host"
          style={{ paddingTop: "2rem" }}
          onClick={onNavigateToRegister}
        >
          <HostBanner />
        </div>

        {/* <Testimonials testimonials={testimonials} /> */}
      </main>
    </>
  );
}
