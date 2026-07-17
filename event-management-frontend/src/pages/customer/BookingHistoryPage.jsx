import React, { useState } from "react";
import { Download, Eye, X, MapPin, Calendar, Clock, DollarSign, Tag, CheckCircle } from "lucide-react";

export default function BookingHistoryPage({ events }) {
  const [selectedHistory, setSelectedHistory] = useState(null);

  // Use past events for booking history mock data
  const history = [
    {
      ...events[4],
      tickets: 1,
      pricePaid: 0, // Free event
      bookingId: "BK-00092",
      dateBooked: "Jan 12, 2025",
      status: "Attended"
    },
    {
      ...events[5],
      tickets: 3,
      pricePaid: 267,
      bookingId: "BK-00085",
      dateBooked: "Dec 05, 2024",
      status: "Attended"
    },
    {
      ...events[6],
      tickets: 2,
      pricePaid: 150,
      bookingId: "BK-00071",
      dateBooked: "Nov 20, 2024",
      status: "Cancelled"
    }
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "2rem" }}>Booking History</h1>

      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Event Details</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Booking ID</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Date Booked</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Amount</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: idx !== history.length - 1 ? "1px solid #e2e8f0" : "none", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={item.image} alt={item.title} style={{ width: "40px", height: "40px", borderRadius: "0.25rem", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.9rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.date}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "#64748b" }}>{item.bookingId}</td>
                <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "#64748b" }}>{item.dateBooked}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span style={{ 
                    backgroundColor: item.status === "Attended" ? "#dcfce7" : "#f1f5f9", 
                    color: item.status === "Attended" ? "#166534" : "#475569", 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "0.25rem", 
                    fontSize: "0.75rem", 
                    fontWeight: "600" 
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a" }}>${item.pricePaid}</td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <button 
                      onClick={() => setSelectedHistory(item)}
                      style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: "0.25rem" }} 
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.25rem" }} title="Download Invoice">
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
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "500px",
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>
                Booking Details
              </h2>
              <button 
                onClick={() => setSelectedHistory(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <img src={selectedHistory.image} alt={selectedHistory.title} style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }} />
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>{selectedHistory.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
                    <MapPin size={14} /> {selectedHistory.venue}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={14} /> {selectedHistory.date} <Clock size={14} style={{ marginLeft: "0.5rem" }} /> {selectedHistory.time}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Booking ID</p>
                  <p style={{ fontWeight: "600", color: "#0f172a" }}>{selectedHistory.bookingId}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Date Booked</p>
                  <p style={{ fontWeight: "600", color: "#0f172a" }}>{selectedHistory.dateBooked}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Status</p>
                  <p style={{ fontWeight: "600", color: selectedHistory.status === "Attended" ? "#166534" : "#475569" }}>{selectedHistory.status}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>Tickets</p>
                  <p style={{ fontWeight: "600", color: "#0f172a" }}>{selectedHistory.tickets} x General Admission</p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.75rem" }}>Payment Summary</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#64748b" }}>
                  <span>Ticket Price ({selectedHistory.tickets}x)</span>
                  <span>${selectedHistory.price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#64748b" }}>
                  <span>Taxes & Fees</span>
                  <span>$0.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px dashed #cbd5e1", fontSize: "1rem", fontWeight: "bold", color: "#0f172a" }}>
                  <span>Total Paid</span>
                  <span>${selectedHistory.pricePaid}</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: "1.5rem", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", textAlign: "right" }}>
              <button 
                onClick={() => setSelectedHistory(null)}
                style={{ padding: "0.5rem 1.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}
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
