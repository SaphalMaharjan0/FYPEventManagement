import React from "react";
import { Download, Eye } from "lucide-react";

export default function BookingHistoryPage({ events }) {
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
              <tr key={idx} style={{ borderBottom: idx !== history.length - 1 ? "1px solid #e2e8f0" : "none" }}>
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
                    <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.25rem" }} title="View Details">
                      <Eye size={16} />
                    </button>
                    <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.25rem" }} title="Download Invoice">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
