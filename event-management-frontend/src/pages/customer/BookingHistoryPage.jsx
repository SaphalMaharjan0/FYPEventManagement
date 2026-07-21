import React, { useState } from "react";
import { Download, Eye, X, MapPin, Calendar, Clock } from "lucide-react";

export default function BookingHistoryPage({ events = [] }) {
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Fallback mock data if events are passed in
  const history = [
    {
      ...(events[4] || {
        title: "International Film Festival",
        date: "Jan 10, 2025",
        time: "06:30 PM",
        venue: "Paramount Theatre, Oakland, CA",
        image:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
        price: 0,
      }),
      tickets: 1,
      pricePaid: 0,
      bookingId: "BK-00092",
      dateBooked: "Jan 12, 2025",
      status: "Attended",
    },
    {
      ...(events[5] || {
        title: "Symphony in the Park",
        date: "Dec 01, 2024",
        time: "05:00 PM",
        venue: "Golden Gate Park, San Francisco, CA",
        image:
          "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500",
        price: 89,
      }),
      tickets: 3,
      pricePaid: 267,
      bookingId: "BK-00085",
      dateBooked: "Dec 05, 2024",
      status: "Attended",
    },
    {
      ...(events[6] || {
        title: "Modern Art Gala",
        date: "Nov 15, 2024",
        time: "08:00 PM",
        venue: "SFMOMA, San Francisco, CA",
        image:
          "https://images.unsplash.com/photo-1531058240690-006c446962d8?w=500",
        price: 75,
      }),
      tickets: 2,
      pricePaid: 150,
      bookingId: "BK-00071",
      dateBooked: "Nov 20, 2024",
      status: "Cancelled",
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
        Booking History
      </h1>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-md, 0.75rem)",
          border: "1px solid var(--border-main)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              backgroundColor: "var(--bg-body-alt)",
              borderBottom: "1px solid var(--border-main)",
            }}
          >
            <tr>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Event Details
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Booking ID
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Date Booked
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-subtle)",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={item.bookingId || idx}
                style={{
                  borderBottom:
                    idx !== history.length - 1
                      ? "1px solid var(--border-main)"
                      : "none",
                  transition: "var(--transition-fast)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--bg-body-alt)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-sm, 0.25rem)",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--text-main)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-subtle)",
                        }}
                      >
                        {item.date}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem 1.5rem",
                    fontSize: "0.85rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {item.bookingId}
                </td>
                <td
                  style={{
                    padding: "1rem 1.5rem",
                    fontSize: "0.85rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  {item.dateBooked}
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span
                    style={{
                      backgroundColor:
                        item.status === "Attended"
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                      color: item.status === "Attended" ? "#22c55e" : "#ef4444",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "1rem 1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "var(--text-main)",
                  }}
                >
                  ${item.pricePaid}
                </td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedHistory(item)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary, #3b82f6)",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-subtle)",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                      title="Download Invoice"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Details Modal */}
      {selectedHistory && (
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
              maxWidth: "500px",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid var(--border-main)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "var(--text-main)",
                  margin: 0,
                }}
              >
                Booking Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-subtle)",
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <img
                  src={selectedHistory.image}
                  alt={selectedHistory.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "var(--radius-sm, 0.5rem)",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
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
                    {selectedHistory.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-subtle)",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    <MapPin size={14} /> {selectedHistory.venue}
                  </p>
                  <p
                    style={{
                      color: "var(--text-subtle)",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      margin: 0,
                    }}
                  >
                    <Calendar size={14} /> {selectedHistory.date}{" "}
                    <Clock size={14} style={{ marginLeft: "0.5rem" }} />{" "}
                    {selectedHistory.time || "07:00 PM"}
                  </p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div
                style={{
                  backgroundColor: "var(--bg-body-alt)",
                  border: "1px solid var(--border-main)",
                  padding: "1rem",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Booking ID
                  </p>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    {selectedHistory.bookingId}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Date Booked
                  </p>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    {selectedHistory.dateBooked}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Status
                  </p>
                  <p
                    style={{
                      fontWeight: "600",
                      color:
                        selectedHistory.status === "Attended"
                          ? "#22c55e"
                          : "#ef4444",
                      margin: 0,
                    }}
                  >
                    {selectedHistory.status}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Tickets
                  </p>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    {selectedHistory.tickets} x General Admission
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "var(--text-main)",
                    marginBottom: "0.75rem",
                    marginTop: 0,
                  }}
                >
                  Payment Summary
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  <span>Ticket Price ({selectedHistory.tickets}x)</span>
                  <span>
                    ${selectedHistory.price || selectedHistory.pricePaid}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--text-subtle)",
                  }}
                >
                  <span>Taxes & Fees</span>
                  <span>$0.00</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "0.5rem",
                    borderTop: "1px dashed var(--border-main)",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "var(--text-main)",
                  }}
                >
                  <span>Total Paid</span>
                  <span>${selectedHistory.pricePaid}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border-main)",
                backgroundColor: "var(--bg-body-alt)",
                textAlign: "right",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedHistory(null)}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "var(--primary, #3b82f6)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-sm, 0.5rem)",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
