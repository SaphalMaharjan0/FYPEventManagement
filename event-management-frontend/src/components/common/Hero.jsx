import React from "react";
import { Search, MapPin } from "lucide-react";

export default function Hero({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  activeCategory,
  setActiveCategory,
  onSearchSubmit
}) {
  const quickTags = [
    { label: "Music", value: "music" },
    { label: "Technology", value: "technology" },
    { label: "Business", value: "business" },
    { label: "Arts", value: "arts" },
    { label: "Sports", value: "sports" }
  ];

  const handleTagClick = (tagValue) => {
    if (activeCategory === tagValue) {
      setActiveCategory("all");
    } else {
      setActiveCategory(tagValue);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-shape-left"></div>
      <div className="hero-shape-right"></div>
      
      <div className="container">
        {/* Pulse Event badge */}
        <div className="badge-pill">
          <span className="badge-dot"></span>
          <span>10,500+ events happening this month</span>
        </div>

        {/* Hero Headers */}
        <h1 className="hero-title">
          Discover Events<br />
          <span>That Move You</span>
        </h1>
        <p className="hero-subtitle">
          Find, book, and manage events across technology, music, business, arts, and more — all in one place.
        </p>

        {/* Search Bar Container */}
        <div className="search-container">
          <div className="search-field">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </div>
          
          <div className="search-divider"></div>
          
          <div className="search-field">
            <MapPin size={18} />
            <input
              type="text"
              placeholder="Location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </div>

          <button className="btn-search" onClick={onSearchSubmit}>
            Search
          </button>
        </div>

        {/* Quick Tag Badges */}
        <div className="hero-tags">
          {quickTags.map((tag) => (
            <button
              key={tag.value}
              className={`hero-tag ${activeCategory === tag.value ? "active" : ""}`}
              onClick={() => handleTagClick(tag.value)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="hero-wave"></div>
    </section>
  );
}
