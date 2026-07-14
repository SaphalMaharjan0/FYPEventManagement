import React, { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, Tag, DollarSign, MapPin, Inbox, AlertCircle } from "lucide-react";
import EventCard from "../../components/event/EventCard";

export default function EventsPage({
  events,
  onBookClick,
  initialCategory = "all",
  initialSearchQuery = "",
  initialLocationQuery = "",
  isDashboardContext = false
}) {
  // Filter States
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocationQuery);
  const [selectedDate, setSelectedDate] = useState("all");
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Sync with initial page navigation triggers
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setLocationQuery(initialLocationQuery);
  }, [initialLocationQuery]);

  // Sidebar Filter categories
  const categoriesList = [
    { label: "All Categories", value: "all" },
    { label: "Technology", value: "technology" },
    { label: "Music", value: "music" },
    { label: "Business", value: "business" },
    { label: "Food & Drink", value: "food & drink" },
    { label: "Arts", value: "arts" },
    { label: "Sports", value: "sports" }
  ];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Free", value: "free" },
    { label: "Under $100", value: "under100" },
    { label: "$100 - $300", value: "100-300" },
    { label: "$300+", value: "300plus" }
  ];

  const locationsList = [
    { label: "All Cities", value: "all" },
    { label: "San Francisco, CA", value: "san francisco" },
    { label: "New York, NY", value: "new york" },
    { label: "Chicago, IL", value: "chicago" },
    { label: "Los Angeles, CA", value: "los angeles" }
  ];

  // Filtering Logic
  const filteredEvents = events.filter((evt) => {
    // 1. Keyword search (title or category)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (!evt.title.toLowerCase().includes(q) && !evt.category.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 2. Location search input OR sidebar selection
    if (locationQuery.trim() !== "") {
      const loc = locationQuery.toLowerCase();
      if (!evt.venue.toLowerCase().includes(loc)) {
        return false;
      }
    } else if (selectedLocation !== "all") {
      const targetLoc = selectedLocation.toLowerCase();
      if (!evt.venue.toLowerCase().includes(targetLoc)) {
        return false;
      }
    }

    // 3. Category sidebar selection
    if (selectedCategory !== "all") {
      if (evt.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // 4. Price range selection
    if (selectedPrice !== "all") {
      const price = evt.price;
      if (selectedPrice === "free" && price > 0) return false;
      if (selectedPrice === "under100" && price >= 100) return false;
      if (selectedPrice === "100-300" && (price < 100 || price > 300)) return false;
      if (selectedPrice === "300plus" && price < 300) return false;
    }

    // 5. Date selection
    if (selectedDate !== "all") {
      const dateStr = evt.date.toLowerCase();
      if (selectedDate === "today") {
        return false; // Mock - no events match today
      }
      if (selectedDate === "weekend") {
        return dateStr.includes("aug 28") || dateStr.includes("sep 20");
      }
      if (selectedDate === "this_month") {
        return dateStr.includes("aug");
      }
      if (selectedDate === "next_month") {
        return dateStr.includes("sep") || dateStr.includes("oct");
      }
    }

    return true;
  });

  // Sorting Logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "price_asc") {
      return a.price - b.price;
    }
    if (sortBy === "price_desc") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <section className="events-dashboard" style={isDashboardContext ? { paddingTop: '1rem', marginTop: 0 } : {}}>
      <div className="container">
        {/* Page Title & Toggle */}
        <div className="events-header-area" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 className="events-page-title">Browse Events</h2>
            <p className="events-page-subtitle">Discover experiences across all categories</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "500", color: "#0f172a" }}
          >
            <Tag size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Top Search bar with date filter */}
        <div className="events-search-bar">
          <div className="events-search-input-field">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search events or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="events-date-picker">
            <CalendarIcon size={16} />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Filter by Date"
            >
              <option value="all">Any Date</option>
              <option value="today">Today</option>
              <option value="weekend">This Weekend</option>
              <option value="this_month">This Month</option>
              <option value="next_month">Next Month</option>
            </select>
          </div>

          <button className="btn-search" style={{ height: "100%", padding: "0.5rem 1.5rem" }}>
            Search
          </button>
        </div>

        {/* Sidebar + Main Grid Split Layout */}
        <div className="events-layout" style={{ display: "flex", gap: "2rem", flexDirection: showFilters ? "row" : "column" }}>
          {/* Sidebar Filter panels */}
          {showFilters && (
            <aside className="events-sidebar" style={{ minWidth: "250px" }}>
            {/* Category Filter */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">
                <Tag size={16} />
                <span>Categories</span>
              </h4>
              <ul className="sidebar-filter-list">
                {categoriesList.map((cat) => (
                  <li
                    key={cat.value}
                    className={`sidebar-filter-item ${
                      selectedCategory.toLowerCase() === cat.value.toLowerCase() ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    <span>{cat.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">
                <DollarSign size={16} />
                <span>Price Range</span>
              </h4>
              <ul className="sidebar-filter-list">
                {priceRanges.map((rng) => (
                  <li
                    key={rng.value}
                    className={`sidebar-filter-item ${selectedPrice === rng.value ? "active" : ""}`}
                    onClick={() => setSelectedPrice(rng.value)}
                  >
                    <span>{rng.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Filter */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">
                <MapPin size={16} />
                <span>Location</span>
              </h4>
              <ul className="sidebar-filter-list">
                {locationsList.map((loc) => (
                  <li
                    key={loc.value}
                    className={`sidebar-filter-item ${selectedLocation === loc.value ? "active" : ""}`}
                    onClick={() => setSelectedLocation(loc.value)}
                  >
                    <span>{loc.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          )}

          {/* Main Content Area */}
          <div className="events-results-panel" style={{ flex: 1 }}>
            {/* Header controls for count & sorting */}
            <div className="events-results-header">
              <div>
                <span className="events-results-count">{sortedEvents.length}</span> events found
              </div>
              <div className="events-results-sort">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort events by">
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Event grid output */}
            {sortedEvents.length > 0 ? (
              <div className="events-grid-3col">
                {sortedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} onBookClick={onBookClick} />
                ))}
              </div>
            ) : (
              <div className="no-results-box">
                <AlertCircle size={48} />
                <h4 style={{ fontWeight: 800, color: "var(--text-dark)", fontSize: "1.1rem" }}>
                  No events found
                </h4>
                <p style={{ fontSize: "0.85rem", maxWidth: "260px", lineHeight: 1.5 }}>
                  No events match the active filter criteria. Try expanding your search queries or resetting filters.
                </p>
                <button
                  className="btn-book"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedCategory("all");
                    setSelectedPrice("all");
                    setSelectedLocation("all");
                    setSelectedDate("all");
                  }}
                  style={{ marginTop: "0.5rem" }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
