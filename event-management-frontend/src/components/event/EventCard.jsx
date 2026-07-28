import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, Heart } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice, formatDate } from "../../utils/formatting";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function EventCard({ event, onBookClick, initialIsFavorite = false }) {
  const { currency, region } = useSettings();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const {
    title,
    category,
    price,
    date,
    time,
    venue,
    seatsLeft,
    totalSeats,
    rating,
    image,
    id, // Ensure id is destructured, might be eventId
    eventId
  } = event;

  const actualId = id || eventId;
  const isFavorite = favoriteIds ? favoriteIds.has(actualId) : initialIsFavorite;

  // Calculate percentage of seats filled/booked or percentage remaining
  const percentageAvailable = Math.round((seatsLeft / totalSeats) * 100) || 0;
  const isSoldOut = seatsLeft <= 0;

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!actualId) return; // if no ID, can't favorite
    if (toggleFavorite) {
      await toggleFavorite(actualId);
    }
  };

  return (
    <div className="event-card" onClick={() => onBookClick(event)} style={{ cursor: "pointer", position: "relative" }}>
      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteToggle}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          background: "var(--bg-card, white)",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s"
        }}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Heart size={16} fill={isFavorite ? "var(--color-red-500, #ef4444)" : "none"} color={isFavorite ? "var(--color-red-500, #ef4444)" : "var(--text-subtle, #64748b)"} />
      </button>

      {/* Event Image & Badges */}
      <div className="card-img-wrapper">
        <img src={image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt={title} className="card-img" loading="lazy" />
        <span className="card-category-badge">{category}</span>
        <span className="card-price-badge">{formatPrice(price, currency)}</span>
      </div>

      {/* Card Content Details */}
      <div className="card-content">
        <h3 className="card-title" title={title}>{title}</h3>
        
        <div className="card-meta-list">
          <div className="card-meta-item">
            <Calendar size={14} />
            <span>{formatDate(date, region) || date}</span>
          </div>
          <div className="card-meta-item">
            <Clock size={14} />
            <span>{time}</span>
          </div>
          <div className="card-meta-item">
            <MapPin size={14} />
            <span>{venue}</span>
          </div>
        </div>

        {/* Progress Bar of Available Seats */}
        <div className="card-seats-wrapper">
          <div className="card-seats-text">
            <span className="card-seats-left">
              {isSoldOut ? "Sold Out" : `${seatsLeft} seats left`}
            </span>
            <span className="card-seats-percentage">
              {percentageAvailable}% available
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${percentageAvailable}%`, backgroundColor: isSoldOut ? "var(--color-red-500)" : "var(--primary)" }}
            ></div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="card-footer">
          <div className="card-rating">
            <Star size={14} />
            <span>{rating}</span>
          </div>
          <button 
            className="btn-book" 
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(event);
            }}
            disabled={isSoldOut}
            style={isSoldOut ? { opacity: 0.5, cursor: "not-allowed", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-400)" } : {}}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
