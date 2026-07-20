import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Star, User, ShieldAlert, Award } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice, formatDate } from "../../utils/formatting";
import EventCard from "../../components/event/EventCard";

export default function EventDetailsPage({
  event,
  allEvents,
  onNavigate,
  onInitiateBooking,
  currentUser,
  isDashboardContext = false
}) {
  const { currency, region } = useSettings();
  const [quantity, setQuantity] = useState(1);

  // Scroll to top on page load/change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [event]);

  if (!event) return null;

  const handleIncrement = () => {
    if (quantity < event.seatsLeft) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = event.price * quantity;

  // Filter similar events (same category, excluding current one)
  const similarEvents = allEvents
    .filter((e) => e.category === event.category && e.id !== event.id)
    .slice(0, 3);

  return (
    <div className="details-page" style={isDashboardContext ? { paddingTop: '1rem', marginTop: 0 } : {}}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumbs">
          <span onClick={() => onNavigate("landing")}>Home</span>
          <span>&rsaquo;</span>
          <span onClick={() => onNavigate("events")}>Events</span>
          <span>&rsaquo;</span>
          <span className="active">{event.title}</span>
        </div>

        {/* 2-Column Details Grid */}
        <div className="details-grid">
          
          {/* Main Left Details column */}
          <div className="details-main-content">
            {/* Event Hero Cover Image */}
            <img src={event.image} alt={event.title} className="details-hero-image" />

            {/* Title & Badge */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="details-badge-row">
                <span className="details-badge">{event.category}</span>
                {event.rating && (
                  <span className="details-rating">
                    <Star size={16} fill="currentColor" />
                    <span>{event.rating}</span>
                  </span>
                )}
              </div>
              <h1 className="details-title">{event.title}</h1>
            </div>

            {/* Info Grid (Time, Venue, Host) */}
            <div className="details-meta-grid">
              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Calendar size={20} />
                </div>
                <div className="details-meta-info">
                  <span className="details-meta-label">Date</span>
                  <span className="details-meta-value">{formatDate(event.date, region) || event.date}</span>
                </div>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Clock size={20} />
                </div>
                <div className="details-meta-info">
                  <span className="details-meta-label">Time</span>
                  <span className="details-meta-value">{event.time}</span>
                </div>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <MapPin size={20} />
                </div>
                <div className="details-meta-info">
                  <span className="details-meta-label">Venue</span>
                  <span className="details-meta-value">{event.venue}</span>
                </div>
              </div>

              <div className="details-meta-item">
                <div className="details-meta-icon">
                  <Award size={20} />
                </div>
                <div className="details-meta-info">
                  <span className="details-meta-label">Organizer</span>
                  <span className="details-meta-value">{event.organizer}</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="details-description-box">
              <h3 className="details-section-title">About the Event</h3>
              <p className="details-text">{event.description || "No description provided for this event."}</p>
            </div>
          </div>

          {/* Sticky Checkout Sidebar Card */}
          <div className="details-sidebar-container">
            <div className="details-sticky-card">
              <div className="details-price-row">
                <span className="details-price-label">Ticket Price</span>
                <span className="details-price-amount">{formatPrice(event.price, currency)}</span>
              </div>

              {/* Capacities indicator */}
              <div className="details-seats-box">
                <div className="details-seats-header">
                  <span className="details-seats-count">{event.seatsLeft} seats left</span>
                  <span className="details-seats-pct">{event.percentAvailable}% available</span>
                </div>
                <div className="progress-bar-container" style={{ margin: "0.25rem 0 0 0" }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${event.percentAvailable}%` }}
                  ></div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="details-qty-row">
                <span className="details-qty-label">Quantity</span>
                <div className="modal-counter" style={{ margin: 0 }}>
                  <button 
                    type="button" 
                    className="btn-counter" 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="counter-val">{quantity}</span>
                  <button 
                    type="button" 
                    className="btn-counter" 
                    onClick={handleIncrement}
                    disabled={quantity >= event.seatsLeft}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total display */}
              <div className="details-total-row">
                <span>Total Cost</span>
                <span className="details-total-price">{formatPrice(totalPrice, currency)}</span>
              </div>

              {/* Book tickets guard button */}
              <button
                className="btn-book"
                onClick={() => onInitiateBooking(event, quantity)}
                style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: 700 }}
                disabled={event.seatsLeft <= 0}
              >
                {event.seatsLeft > 0 ? "Book Tickets" : "Sold Out"}
              </button>
              
              {!currentUser && (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", backgroundColor: "var(--color-amber-50)", padding: "0.75rem", borderRadius: "8px", border: "1px solid #fef3c7", fontSize: "0.75rem", color: "var(--color-amber-700)" }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                  <span>You must be logged in to reserve tickets.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Events Carousel section */}
        {similarEvents.length > 0 && (
          <div className="similar-events-section">
            <h3 className="section-title" style={{ marginBottom: "1.5rem" }}>Similar Events You Might Like</h3>
            <div className="cards-grid">
              {similarEvents.map((evt) => (
                <EventCard 
                  key={evt.id} 
                  event={evt} 
                  onBookClick={() => onNavigate("event-details", evt)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
