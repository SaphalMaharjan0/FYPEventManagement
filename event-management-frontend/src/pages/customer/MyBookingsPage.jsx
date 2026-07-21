import React, { useState } from "react";
import { X, QrCode } from "lucide-react";

export default function MyBookingsPage({ events = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fallback mock data if events are passed in
  const bookings = [
    {
      ...(events[0] || {
        title: "TechConf 2025 — AI & Machine Learning Summit",
        date: "Aug 15, 2025",
        venue: "Moscone Center, San Francisco, CA",
        image:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
        time: "09:00 AM",
      }),
      tickets: 2,
      pricePaid: 598,
      bookingId: "BK-00101",
      status: "Active",
    },
    {
      ...(events[1] || {
        title: "Global Music Festival 2025",
        date: "Sep 20, 2025",
        venue: "Central Park, New York, NY",
        image:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
        time: "04:00 PM",
      }),
      tickets: 2,
      pricePaid: 178,
      bookingId: "BK-00102",
      status: "Active",
    },
    {
      ...(events[2] || {
        title: "Food & Wine Expo",
        date: "Oct 05, 2025",
        venue: "Navy Pier, Chicago, IL",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500",
        time: "11:00 AM",
      }),
      tickets: 2,
      pricePaid: 130,
      bookingId: "BK-00103",
      status: "Pending",
    },
    {
      ...(events[3] || {
        title: "Startup Founders Summit",
        date: "Nov 12, 2025",
        venue: "Convention Center, Austin, TX",
        image:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500",
        time: "10:00 AM",
      }),
      tickets: 2,
      pricePaid: 798,
      bookingId: "BK-00104",
      status: "Inactive",
    },
  ];

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
              src={booking.image}
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
                      marginTops: 0,
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
                    {booking.date} · {booking.venue}
                  </p>
                </div>

                {booking.status === "Active" && (
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
                    Active
                  </span>
                )}
                {booking.status === "Pending" && (
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
                {booking.status === "Inactive" && (
                  <span
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      color: "#ef4444",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    Inactive
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
                  <strong>{booking.tickets} Tickets</strong> - $
                  {booking.pricePaid}
                </span>
                <span>Booking ID: {booking.bookingId}</span>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
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
                <button
                  type="button"
                  style={{
                    padding: "0.45rem 1rem",
                    backgroundColor: "transparent",
                    color: "var(--text-subtle)",
                    border: "1px solid var(--border-main)",
                    borderRadius: "var(--radius-sm, 0.5rem)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            }}
          >
            {/* Ticket Modal Header */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "2px dashed var(--border-main)",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-subtle)",
                }}
                aria-label="Close ticket modal"
              >
                <X size={20} />
              </button>
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
                {selectedTicket.venue}
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
                }}
              >
                <QrCode size={120} color="#0f172a" />
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
        </div>
      )}
    </div>
  );
}
