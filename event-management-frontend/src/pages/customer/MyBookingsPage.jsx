import React, { useState, useEffect } from "react";
import { X, QrCode, Download, Ticket, Calendar, Clock, MapPin } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice, formatShortAddress } from "../../utils/formatting";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function MyBookingsPage({ events = [], onBookClick, onContinuePurchase }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const fetchWithAuth = useFetch();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/api/customer/bookings');
      
      // Filter out past/inactive bookings if we only want active ones here.
      // The backend returns uppercase status strings like "CONFIRMED" and "PENDING"
      const activeBookings = data.filter(b => {
        const s = b.status?.toUpperCase();
        return s === "CONFIRMED" || s === "PENDING";
      });
      
      setBookings(activeBookings);
      setError(null);
    } catch (err) {
      setError("Failed to load bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchWithAuth]);

  const triggerCancelBooking = (booking) => {
    setConfirmModal({
      message: `Are you sure you want to cancel the booking for "${booking.title}"?`,
      actionText: "Cancel Booking",
      actionColor: "#ef4444",
      action: async () => {
        try {
          await fetchWithAuth(`/api/customer/bookings/${booking.id}/cancel`, {
            method: "POST"
          });
          showToast("Booking cancelled successfully!");
          fetchBookings(); // Refresh bookings list
        } catch (err) {
          console.error("Cancellation failed:", err);
          showToast(err.message || "Failed to cancel booking. Please try again.");
        }
      }
    });
  };

  const handleDownloadPDF = () => {
    if (!selectedTicket) return;
    const element = document.getElementById("ticket-modal-content-to-print");
    if (!element) return;

    // Show a loading text or indicator if needed, but since it's instant:
    const loadAndGenerate = () => {
      const opt = {
        margin:       10,
        filename:     `Ticket-${selectedTicket.bookingId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().from(element).set(opt).save();
    };

    if (!window.html2pdf) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = loadAndGenerate;
      document.body.appendChild(script);
    } else {
      loadAndGenerate();
    }
  };


  return (
    <div style={{ color: "var(--text-main)", fontFamily: "var(--font-body)" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "var(--text-main)",
          marginBottom: "2rem",
          fontFamily: "var(--font-heading)",
        }}
      >
        My Bookings
      </h1>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>
          Loading your bookings...
        </div>
      ) : error ? (
        <div style={{ padding: "2rem", color: "red" }}>{error}</div>
      ) : bookings.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-subtle)" }}>
          You have no active bookings.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {bookings.map((booking, idx) => (
            <div
              key={booking.bookingId || idx}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-main)",
                borderRadius: "var(--radius-md, 0.75rem)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                gap: "1.5rem",
                boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
                transition: "var(--transition-fast)",
              }}
            >
              <img
                src={booking.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                alt={booking.title}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "var(--text-main)",
                        marginBottom: "0.25rem",
                        marginTop: 0,
                      }}
                    >
                      {booking.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-subtle)",
                        marginBottom: "0.75rem",
                        marginTop: 0,
                      }}
                    >
                      {booking.date} · {formatShortAddress(booking.venue)}
                    </p>
                  </div>

                  {booking.status?.toUpperCase() === "CONFIRMED" && (
                    <span
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.15)",
                        color: "#22c55e",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        flexShrink: 0,
                      }}
                    >
                      Confirmed
                    </span>
                  )}
                  {booking.status?.toUpperCase() === "PENDING" && (
                    <span
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        color: "#f59e0b",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        flexShrink: 0,
                      }}
                    >
                      Pending
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    fontSize: "0.85rem",
                    color: "var(--text-subtle)",
                    marginBottom: "1.25rem",
                  }}
                >
                  <span>
                    <strong>{booking.tickets} Tickets</strong> - ${booking.pricePaid}
                  </span>
                  <span>Booking ID: {booking.bookingId}</span>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {booking.status?.toUpperCase() === "CONFIRMED" ? (
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(booking)}
                      style={{
                        padding: "0.45rem 1rem",
                        backgroundColor: "rgba(59, 130, 246, 0.12)",
                        color: "var(--primary, #3b82f6)",
                        border: "none",
                        borderRadius: "var(--radius-sm, 0.5rem)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "var(--transition-fast)",
                      }}
                    >
                      View Ticket
                    </button>
                  ) : booking.status?.toUpperCase() === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const evt = events.find(e => e.id === booking.eventId || e.title === booking.title);
                        if (evt && onContinuePurchase) {
                          onContinuePurchase(evt, booking.tickets || 1);
                        } else if (evt && onBookClick) {
                          onBookClick(evt);
                        } else {
                          window.location.href = '/customer/events';
                        }
                      }}
                      style={{
                        padding: "0.45rem 1rem",
                        backgroundColor: "rgba(245, 158, 11, 0.12)",
                        color: "#f59e0b",
                        border: "none",
                        borderRadius: "var(--radius-sm, 0.5rem)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "var(--transition-fast)",
                      }}
                    >
                      Continue Purchase
                    </button>
                  ) : null}
                  {new Date(booking.date) >= new Date(new Date().setHours(0,0,0,0)) && (
                    <button
                      type="button"
                      onClick={() => triggerCancelBooking(booking)}
                    style={{
                      padding: "0.45rem 1rem",
                      backgroundColor: "transparent",
                      color: "#ef4444",
                      border: "1px solid #fecaca",
                      borderRadius: "var(--radius-sm, 0.5rem)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    Cancel Booking
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-main)",
              borderRadius: "var(--radius-md, 1rem)",
              width: "100%",
              maxWidth: "400px",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            {/* Close button outside printable area */}
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-subtle)",
                zIndex: 10,
              }}
              aria-label="Close ticket modal"
            >
              <X size={20} />
            </button>

            {/* Ticket to Print Wrapper */}
            <div id="ticket-modal-content-to-print" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-main)" }}>
              {/* Ticket Modal Header */}
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: "2px dashed var(--border-main)",
                  position: "relative",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "var(--text-main)",
                    marginBottom: "0.5rem",
                    paddingRight: "2rem",
                    marginTop: 0,
                  }}
                >
                  {selectedTicket.title}
                </h2>
                <p
                  style={{
                    color: "var(--text-subtle)",
                    fontSize: "0.9rem",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {selectedTicket.date} • {selectedTicket.time || "07:00 PM"}
                </p>
                <p
                  style={{
                    color: "var(--text-subtle)",
                    fontSize: "0.9rem",
                    margin: 0,
                  }}
                >
                  {formatShortAddress(selectedTicket.venue)}
                </p>
              </div>

              {/* Ticket Modal Content */}
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "var(--bg-body-alt)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* High Contrast QR Code Container */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    borderRadius: "var(--radius-sm, 0.5rem)",
                    marginBottom: "1rem",
                    border: "1px solid var(--border-main)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `Booking Ref: ${selectedTicket.bookingId}\nEvent: ${selectedTicket.title}\nTickets: ${selectedTicket.tickets}\nDate: ${selectedTicket.date}\nVenue: ${formatShortAddress(selectedTicket.venue)}`
                    )}`}
                    alt="Ticket QR Code"
                    style={{
                      width: "150px",
                      height: "150px",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    color: "var(--text-main)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {selectedTicket.bookingId}
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--border-main)",
                    paddingTop: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-subtle)",
                        textTransform: "uppercase",
                      }}
                    >
                      Type
                    </div>
                    <div style={{ fontWeight: "600", color: "var(--text-main)" }}>
                      General Admission
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-subtle)",
                        textTransform: "uppercase",
                      }}
                    >
                      Admit
                    </div>
                    <div style={{ fontWeight: "600", color: "var(--text-main)" }}>
                      {selectedTicket.tickets}{" "}
                      {selectedTicket.tickets === 1 ? "Person" : "People"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Modal Action Button */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border-main)",
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <button
                type="button"
                onClick={handleDownloadPDF}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "var(--color-primary, #6366f1)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-notif">
          <span>{toast}</span>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!confirmModal}
        title="Confirm Cancellation"
        message={confirmModal?.message}
        onConfirm={async () => {
          if (confirmModal?.action) {
            await confirmModal.action();
          }
          setConfirmModal(null);
        }}
        onCancel={() => setConfirmModal(null)}
        confirmText={confirmModal?.actionText || "Confirm"}
        confirmColor={confirmModal?.actionColor || "#ef4444"}
      />
    </div>
  );
}
