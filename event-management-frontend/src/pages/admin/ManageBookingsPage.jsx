import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function ManageBookingsPage() {
  const fetchWithAuth = useFetch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchWithAuth("/api/admin/bookings");
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load admin bookings", err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [fetchWithAuth]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed": return { bg: "#ecfdf5", text: "#047857", icon: <CheckCircle size={14} /> };
      case "Pending": return { bg: "#fffbeb", text: "#d97706", icon: <Clock size={14} /> };
      case "Cancelled": return { bg: "#fef2f2", text: "#b91c1c", icon: <XCircle size={14} /> };
      default: return { bg: "#f1f5f9", text: "#475569", icon: null };
    }
  };

  // Get unique list of events for the filter dropdown
  const eventsList = ["all", ...new Set(bookings.map(b => b.event))];

  // Filter bookings based on search term and selected event dropdown
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.event || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesEvent = selectedEvent === "all" || b.event === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Booking Management</h1>
        <button style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Plus size={16} />
          Create Booking
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        
        {/* Search and Filter Bar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            flex: 1,
            minWidth: "280px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--color-slate-50)",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            border: "1px solid #e2e8f0"
          }}>
            <Search size={18} color="var(--color-slate-400)" />
            <input 
              type="text" 
              placeholder="Search by Ticket ID, User, or Event..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "0.75rem",
                width: "100%",
                fontSize: "0.9rem",
                color: "var(--color-slate-900)"
              }}
            />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-slate-500)", fontWeight: "600" }}>Event:</span>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                backgroundColor: "var(--color-slate-50)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "0.9rem",
                color: "var(--color-slate-700)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              {eventsList.map(evt => (
                <option key={evt} value={evt}>
                  {evt === "all" ? "All Events" : evt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Ticket ID</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>User</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Event</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Amount</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Tickets</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>Loading bookings...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking, idx) => {
                  const statusStyle = getStatusStyle(booking.status);
                  return (
                  <tr key={booking.id} style={{ borderBottom: idx !== filteredBookings.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-slate-600)", fontWeight: "600", fontFamily: "monospace" }}>{booking.id}</td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: "500", color: "var(--color-slate-900)", fontSize: "0.95rem" }}>{booking.user}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{booking.event}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)" }}>{booking.amount}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{booking.tickets}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{booking.date}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ 
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        backgroundColor: statusStyle.bg, 
                        color: statusStyle.text, 
                        padding: "0.25rem 0.6rem", 
                        borderRadius: "1rem", 
                        fontSize: "0.75rem", 
                        fontWeight: "600",
                        textTransform: "capitalize"
                      }}>
                        {statusStyle.icon}
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Eye size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
