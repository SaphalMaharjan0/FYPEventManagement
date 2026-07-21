import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  Tag,
  DollarSign,
  MapPin,
  AlertCircle,
} from "lucide-react";
import EventCard from "../../components/event/EventCard";

export default function EventsPage({
  events = [],
  onBookClick,
  initialCategory = "all",
  initialSearchQuery = "",
  initialLocationQuery = "",
  isDashboardContext = false,
  isDarkMode = false, // Synced with your navbar / application state
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

  // Sync navigation triggers
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setLocationQuery(initialLocationQuery);
  }, [initialLocationQuery]);

  const categoriesList = [
    { label: "All Categories", value: "all" },
    { label: "Technology", value: "technology" },
    { label: "Music", value: "music" },
    { label: "Business", value: "business" },
    { label: "Food & Drink", value: "food & drink" },
    { label: "Arts", value: "arts" },
    { label: "Sports", value: "sports" },
  ];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Free", value: "free" },
    { label: "Under $100", value: "under100" },
    { label: "$100 - $300", value: "100-300" },
    { label: "$300+", value: "300plus" },
  ];

  const locationsList = [
    { label: "All Cities", value: "all" },
    { label: "San Francisco, CA", value: "san francisco" },
    { label: "New York, NY", value: "new york" },
    { label: "Chicago, IL", value: "chicago" },
    { label: "Los Angeles, CA", value: "los angeles" },
  ];

  // Filtering Logic
  const filteredEvents = events.filter((evt) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (
        !evt.title.toLowerCase().includes(q) &&
        !evt.category.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (locationQuery.trim() !== "") {
      const loc = locationQuery.toLowerCase();
      if (!evt.venue.toLowerCase().includes(loc)) return false;
    } else if (selectedLocation !== "all") {
      const targetLoc = selectedLocation.toLowerCase();
      if (!evt.venue.toLowerCase().includes(targetLoc)) return false;
    }
    if (
      selectedCategory !== "all" &&
      evt.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }
    if (selectedPrice !== "all") {
      const price = evt.price;
      if (selectedPrice === "free" && price > 0) return false;
      if (selectedPrice === "under100" && price >= 100) return false;
      if (selectedPrice === "100-300" && (price < 100 || price > 300))
        return false;
      if (selectedPrice === "300plus" && price < 300) return false;
    }
    if (selectedDate !== "all") {
      const dateStr = evt.date.toLowerCase();
      if (selectedDate === "weekend")
        return dateStr.includes("aug 28") || dateStr.includes("sep 20");
      if (selectedDate === "this_month") return dateStr.includes("aug");
      if (selectedDate === "next_month")
        return dateStr.includes("sep") || dateStr.includes("oct");
      if (selectedDate === "today") return false;
    }
    return true;
  });

  // Sorting Logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0;
  });

  // Global CSS Variable Theme Mappings
  const cardStyle = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-main)",
    borderRadius: "var(--radius-md)",
    padding: "1.25rem",
    boxShadow: "var(--shadow-sm)",
  };

  const sectionHeadingStyle = {
    fontFamily: "var(--font-heading)",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "var(--text-subtle)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "0.75rem",
  };

  const inputContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    backgroundColor: "var(--bg-body-alt)",
    border: "1px solid var(--border-input)",
    borderRadius: "var(--radius-sm)",
    marginBottom: "0.75rem",
  };

  const filterItemStyle = (isActive) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    padding: "0.45rem 0.75rem",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.85rem",
    fontWeight: isActive ? "700" : "500",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    transition: "var(--transition-fast)",
    backgroundColor: isActive
      ? isDarkMode
        ? "rgba(37, 99, 235, 0.2)"
        : "var(--primary-light)"
      : "transparent",
    color: isActive
      ? isDarkMode
        ? "#60a5fa"
        : "var(--primary)"
      : "var(--text-subtle)",
  });

  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--bg-body)",
        color: "var(--text-main)",
        paddingTop: isDashboardContext ? "1.5rem" : "5.5rem",
        paddingBottom: "3rem",
        transition: "var(--transition-fast)",
      }}
    >
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Page Title & Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Browse Events
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-subtle)",
                margin: "0.25rem 0 0 0",
              }}
            >
              Discover experiences across all categories
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-input)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "var(--transition-fast)",
            }}
          >
            <Tag size={14} color="var(--text-subtle)" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Outer Split Layout Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT COLUMN: Sidebar */}
          {showFilters && (
            <aside
              style={{
                width: "260px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* PART 2: Search Input & Date Picker */}
              <div style={cardStyle}>
                <span style={sectionHeadingStyle}>Search</span>

                {/* Text Box */}
                <div style={inputContainerStyle}>
                  <Search size={14} color="var(--text-subtle)" />
                  <input
                    type="text"
                    placeholder="Search name or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>

                {/* Date Dropdown */}
                <div style={inputContainerStyle}>
                  <CalendarIcon size={14} color="var(--text-subtle)" />
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                      cursor: "pointer",
                    }}
                  >
                    <option
                      value="all"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      Any Date
                    </option>
                    <option
                      value="today"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      Today
                    </option>
                    <option
                      value="weekend"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      This Weekend
                    </option>
                    <option
                      value="this_month"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      This Month
                    </option>
                    <option
                      value="next_month"
                      style={{
                        background: "var(--bg-card)",
                        color: "var(--text-main)",
                      }}
                    >
                      Next Month
                    </option>
                  </select>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                >
                  Submit Search
                </button>
              </div>

              {/* PART 3: Navigation Filters */}
              <div
                style={{
                  ...cardStyle,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Categories Navigation */}
                <div>
                  <span style={sectionHeadingStyle}>Categories</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {categoriesList.map((cat) => {
                      const isActive =
                        selectedCategory.toLowerCase() ===
                        cat.value.toLowerCase();
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          style={filterItemStyle(isActive)}
                        >
                          <Tag
                            size={13}
                            color={
                              isActive
                                ? isDarkMode
                                  ? "#60a5fa"
                                  : "var(--primary)"
                                : "var(--text-subtle)"
                            }
                          />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Navigation */}
                <div>
                  <span style={sectionHeadingStyle}>Price Range</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {priceRanges.map((rng) => {
                      const isActive = selectedPrice === rng.value;
                      return (
                        <button
                          key={rng.value}
                          onClick={() => setSelectedPrice(rng.value)}
                          style={filterItemStyle(isActive)}
                        >
                          <DollarSign
                            size={13}
                            color={
                              isActive
                                ? isDarkMode
                                  ? "#60a5fa"
                                  : "var(--primary)"
                                : "var(--text-subtle)"
                            }
                          />
                          {rng.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location Navigation */}
                <div>
                  <span style={sectionHeadingStyle}>Location</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {locationsList.map((loc) => {
                      const isActive = selectedLocation === loc.value;
                      return (
                        <button
                          key={loc.value}
                          onClick={() => setSelectedLocation(loc.value)}
                          style={filterItemStyle(isActive)}
                        >
                          <MapPin
                            size={13}
                            color={
                              isActive
                                ? isDarkMode
                                  ? "#60a5fa"
                                  : "var(--primary)"
                                : "var(--text-subtle)"
                            }
                          />
                          {loc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* RIGHT COLUMN: Results Area */}
          <div style={{ flex: 1, width: "100%" }}>
            {/* Control Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--border-main)",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "var(--text-main)",
                  }}
                >
                  {sortedEvents.length}
                </span>{" "}
                events found
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-subtle)",
                }}
              >
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-input)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.35rem 0.6rem",
                    color: "var(--text-main)",
                    outline: "none",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="date" style={{ background: "var(--bg-card)" }}>
                    Date
                  </option>
                  <option
                    value="rating"
                    style={{ background: "var(--bg-card)" }}
                  >
                    Rating
                  </option>
                  <option
                    value="price_asc"
                    style={{ background: "var(--bg-card)" }}
                  >
                    Price (Low to High)
                  </option>
                  <option
                    value="price_desc"
                    style={{ background: "var(--bg-card)" }}
                  >
                    Price (High to Low)
                  </option>
                </select>
              </div>
            </div>

            {/* Event Output Grid */}
            {sortedEvents.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {sortedEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onBookClick={onBookClick}
                  />
                ))}
              </div>
            ) : (
              /* Empty Fallback State */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "4rem 1rem",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-main)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <AlertCircle
                  size={40}
                  color="var(--text-subtle)"
                  style={{ marginBottom: "1rem" }}
                />
                <h4
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: "700",
                    color: "var(--text-main)",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  No events found
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-subtle)",
                    maxWidth: "320px",
                    margin: "0 0 1.25rem 0",
                    lineHeight: "1.6",
                  }}
                >
                  No events match the active filter criteria. Try expanding your
                  search queries or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedCategory("all");
                    setSelectedPrice("all");
                    setSelectedLocation("all");
                    setSelectedDate("all");
                  }}
                  style={{
                    padding: "0.6rem 1.25rem",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
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
