import React, { useState } from "react";
import { X, Check, Ticket } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice, formatDate } from "../../utils/formatting";

export default function BookingModal({ event, onClose, onBookingSuccess, initialQuantity }) {
  const { currency, region } = useSettings();
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    // Deplete seats in parent state
    onBookingSuccess(event.id, quantity);
    setIsSuccess(true);
  };

  const totalPrice = event.price * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Success State */}
        {isSuccess ? (
          <div className="success-anim-container">
            <div className="success-circle">
              <Check size={36} />
            </div>
            <h3 className="success-title">Booking Confirmed!</h3>
            <p className="success-desc">
              You have successfully booked {quantity} ticket{quantity > 1 ? "s" : ""} to:<br />
              <strong>{event.title}</strong>
            </p>
            
            <div style={{ width: "100%", textAlign: "left", backgroundColor: "var(--color-slate-50)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Order Reference:</span>
                <span style={{ fontWeight: 700, marginLeft: "auto" }}>EP-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Tickets:</span>
                <span style={{ fontWeight: 700, marginLeft: "auto" }}>{quantity}x General Admission</span>
              </div>
              <div style={{ display: "flex", justifyContent: "between" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Paid:</span>
                <span style={{ fontWeight: 700, color: "var(--color-green-500)", marginLeft: "auto" }}>{formatPrice(totalPrice, currency)}</span>
              </div>
            </div>

            <button className="btn-success-close" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Booking Standard Form */
          <>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
              <X size={20} />
            </button>

            <h3 className="modal-title">Book Tickets</h3>
            <p className="modal-desc">Secure your spot for this experience</p>

            <form onSubmit={handleCheckoutSubmit}>
              <div className="modal-body">
                {/* Event Summary Row */}
                <div className="modal-event-summary">
                  <img src={event.image} alt={event.title} className="modal-event-thumbnail" />
                  <div className="modal-event-details">
                    <h4 className="modal-event-title">{event.title}</h4>
                    <span className="modal-event-meta">{formatDate(event.date, region) || event.date} • {event.time}</span>
                  </div>
                </div>

                {/* Price Row */}
                <div className="modal-row">
                  <span className="modal-row-label">Price per ticket</span>
                  <span className="modal-price-val">{formatPrice(event.price, currency)}</span>
                </div>

                {/* Quantity Row */}
                <div className="modal-row">
                  <span className="modal-row-label">Quantity</span>
                  <div className="modal-counter">
                    <button 
                      type="button" 
                      className="btn-counter" 
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="counter-value">{quantity}</span>
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

                {/* Total Price Row */}
                <div className="modal-row" style={{ borderBottom: "none", paddingTop: "0.5rem" }}>
                  <span className="modal-row-label" style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total</span>
                  <span className="modal-total-val">{formatPrice(totalPrice, currency)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button type="submit" className="btn-checkout">
                <Ticket size={18} />
                <span>Confirm Reservation</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
