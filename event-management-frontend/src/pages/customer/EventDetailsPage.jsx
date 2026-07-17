import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Star, User, ShieldAlert, Award } from "lucide-react";
import EventCard from "../../components/event/EventCard";

export default function EventDetailsPage({
  event,
  allEvents,
  onNavigate,
  onInitiateBooking,
  currentUser,
  isDashboardContext = false
}) {
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

  // Mock extended descriptions based on event category/type
  const getExtendedDescription = () => {
    if (event.category.toLowerCase() === "music") {
      return "Get ready for an extraordinary night of live music, vibrant light shows, and energy under the stars! This festival brings together premier international chart-toppers and breakthrough indie performers across multiple curated stages. Enjoy artisan food vendors, interactive art installations, and premium lounges throughout the park grounds. Secure your spot now to experience the season's most anticipated acoustic and electronic event.";
    }
    if (event.category.toLowerCase() === "technology") {
      return "Join global tech leaders, visionary developers, and innovative founders at this year's premier technology summit. The conference features immersive technical workshops, panel debates on emerging frameworks, and inspirational keynotes covering the future of engineering, AI systems, and decentralized architectures. Networking sessions are structured to connect you with hiring teams and active venture funds.";
    }
    if (event.category.toLowerCase() === "business") {
      return "Unlock new scaling pathways and leadership models at this focused summit. Tailored specifically for modern startup founders, senior organizers, and strategic stakeholders, this summit offers hands-on break-out sessions, case studies of successful enterprise transitions, and networking lounges. Topics include early-stage funding rounds, building resilient corporate cultures, and go-to-market optimization.";
    }
    if (event.category.toLowerCase() === "food & drink") {
      return "Delight your senses at the city's largest gathering of culinary professionals and craft beverage makers. This year's expo highlights gourmet tastings prepared by Michelin-starred culinary groups, masterclasses on sommelier pairings, and specialized culinary showcases. Your ticket grants access to all vendor booths, tasting sessions, and live cooking stage presentations.";
    }
    return "Immerse yourself in this uniquely curated experience designed to inspire and connect community members. From local cultural showcases and panel presentations to live demonstrations and vendor marketplaces, this event promises high-quality organization and memorable interactions. Recommended for families, professionals, and enthusiasts alike.";
  };

  // Mock reviews feed
  const mockReviews = [
    {
      user: "Sarah Jenkins",
      rating: 5,
      comment: "Absolutely outstanding organization! Spacing was generous, the audio-visuals were high-fidelity, and the staff were incredibly helpful. Well worth the price!"
    },
    {
      user: "David Chen",
      rating: 4,
      comment: "A highly valuable and informative experience. The panels were top-tier, though food queue lines were slightly long. Will definitely attend next year!"
    }
  ];

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
                <span className="details-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{event.rating} (42 reviews)</span>
                </span>
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
                  <span className="details-meta-value">{event.date}</span>
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
                  <span className="details-meta-value">EventPulse Premium Partner</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="details-description-box">
              <h3 className="details-section-title">About the Event</h3>
              <p className="details-text">{getExtendedDescription()}</p>
            </div>

            {/* Reviews Card */}
            <div className="details-description-box">
              <h3 className="details-section-title">Attendee Reviews</h3>
              <div className="details-reviews-list">
                {mockReviews.map((rev, i) => (
                  <div key={i} className="details-review-card">
                    <div className="details-review-header">
                      <span className="details-review-user">{rev.user}</span>
                      <div className="details-review-rating">
                        {Array.from({ length: rev.rating }).map((_, starIdx) => (
                          <Star key={starIdx} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="details-review-comment">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Checkout Sidebar Card */}
          <div className="details-sidebar-container">
            <div className="details-sticky-card">
              <div className="details-price-row">
                <span className="details-price-label">Ticket Price</span>
                <span className="details-price-amount">${event.price}</span>
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
                <span className="details-total-price">${totalPrice}</span>
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
