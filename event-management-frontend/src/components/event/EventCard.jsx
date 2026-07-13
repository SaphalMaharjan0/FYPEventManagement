import React from "react";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

export default function EventCard({ event, onBookClick }) {
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
    image
  } = event;

  // Calculate percentage of seats filled/booked or percentage remaining
  const percentageAvailable = Math.round((seatsLeft / totalSeats) * 100);
  const isSoldOut = seatsLeft <= 0;

  return (
    <div className="event-card" onClick={() => onBookClick(event)} style={{ cursor: "pointer" }}>
      {/* Event Image & Badges */}
      <div className="card-img-wrapper">
        <img src={image} alt={title} className="card-img" loading="lazy" />
        <span className="card-category-badge">{category}</span>
        <span className="card-price-badge">${price}</span>
      </div>

      {/* Card Content Details */}
      <div className="card-content">
        <h3 className="card-title" title={title}>{title}</h3>
        
        <div className="card-meta-list">
          <div className="card-meta-item">
            <Calendar size={14} />
            <span>{date}</span>
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
              style={{ width: `${percentageAvailable}%`, backgroundColor: isSoldOut ? "#ef4444" : "var(--primary)" }}
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
            style={isSoldOut ? { opacity: 0.5, cursor: "not-allowed", backgroundColor: "#f1f5f9", color: "#94a3b8" } : {}}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
