import React from "react";

export default function MyBookingsPage({ events }) {
  // Use a mix of upcoming and past events for bookings mock data
  const bookings = [
    {
      ...events[0],
      tickets: 2,
      pricePaid: 598,
      bookingId: "BK-00101",
      status: "Active"
    },
    {
      ...events[1],
      tickets: 2,
      pricePaid: 178,
      bookingId: "BK-00102",
      status: "Active"
    },
    {
      ...events[2],
      tickets: 2,
      pricePaid: 130,
      bookingId: "BK-00103",
      status: "Pending"
    },
    {
      ...events[3],
      tickets: 2,
      pricePaid: 798,
      bookingId: "BK-00104",
      status: "Inactive"
    }
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "2rem" }}>My Bookings</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {bookings.map((booking, idx) => (
          <div key={idx} style={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            display: "flex",
            gap: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <img 
              src={booking.image} 
              alt={booking.title} 
              style={{ width: "100px", height: "100px", borderRadius: "0.5rem", objectFit: "cover" }} 
            />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>{booking.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>{booking.date} · {booking.venue}</p>
                </div>
                
                {booking.status === "Active" && (
                  <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>
                    Active
                  </span>
                )}
                {booking.status === "Pending" && (
                  <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>
                    Pending
                  </span>
                )}
                {booking.status === "Inactive" && (
                  <span style={{ backgroundColor: "#fef2f2", color: "#ef4444", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>
                    Inactive
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
                <span><strong>{booking.tickets} Tickets</strong> - ${booking.pricePaid}</span>
                <span>Booking ID: {booking.bookingId}</span>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button style={{ 
                  padding: "0.4rem 1rem", 
                  backgroundColor: "#eff6ff", 
                  color: "#2563eb", 
                  border: "none", 
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  View Ticket
                </button>
                <button style={{ 
                  padding: "0.4rem 1rem", 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0", 
                  color: "#64748b", 
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  cursor: "pointer"
                }}>
                  Download PDF
                </button>
                {booking.status === "Active" && (
                  <button style={{ 
                    padding: "0.4rem 1rem", 
                    backgroundColor: "transparent", 
                    border: "none", 
                    color: "#ef4444", 
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
