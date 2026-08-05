import React, { useState, useEffect } from "react";
import { Download, Eye, X, MapPin, Calendar, Clock, DollarSign, Tag, CheckCircle } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice, formatDate, formatShortAddress } from "../../utils/formatting";
import { useFetch } from "../../hooks/useFetch";

export default function BookingHistoryPage() {
  const { currency, region } = useSettings();
  const [selectedHistory, setSelectedHistory] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchWithAuth = useFetch();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth('/api/customer/bookings');
        
        // Let's assume Booking history shows all bookings regardless of status, 
        // or just the inactive ones. For now we will show all bookings here so 
        // they can see the full history.
        setHistory(data);
      } catch (err) {
        setError("Failed to load booking history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [fetchWithAuth]);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "2rem" }}>Booking History</h1>

      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-slate-500)" }}>Loading history...</div>
        ) : error ? (
          <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>{error}</div>
        ) : history.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-slate-500)" }}>No booking history found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Event Details</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Booking ID</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Date Event</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Amount</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item.bookingId || idx} style={{ borderBottom: idx !== history.length - 1 ? "1px solid #e2e8f0" : "none", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-slate-50)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img src={item.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt={item.title} style={{ width: "40px", height: "40px", borderRadius: "0.25rem", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: "600", color: "var(--color-slate-900)", fontSize: "0.9rem" }}>{item.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-slate-500)" }}>{item.date}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-slate-500)" }}>{item.bookingId}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-slate-500)" }}>{item.date}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      backgroundColor: item.status === "Confirmed" ? "#dcfce7" : "var(--color-slate-100)", 
                      color: item.status === "Confirmed" ? "#166534" : "var(--color-slate-600)", 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "0.25rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600" 
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)" }}>{formatPrice(item.pricePaid, currency)}</td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <button 
                        onClick={() => setSelectedHistory(item)}
                        style={{ background: "none", border: "none", color: "var(--color-blue-500)", cursor: "pointer", padding: "0.25rem" }} 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button style={{ background: "none", border: "none", color: "var(--color-slate-500)", cursor: "pointer", padding: "0.25rem" }} title="Download Invoice">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
            backgroundColor: "var(--color-white)",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "500px",
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>
                Booking Details
              </h2>
              <button 
                onClick={() => setSelectedHistory(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-500)" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <img src={selectedHistory.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt={selectedHistory.title} style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }} />
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{selectedHistory.title}</h3>
                  <p style={{ color: "var(--color-slate-500)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
                    <MapPin size={14} /> {formatShortAddress(selectedHistory.venue)}
                  </p>
                  <p style={{ color: "var(--color-slate-500)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={14} /> {selectedHistory.date} <Clock size={14} style={{ marginLeft: "0.5rem" }} /> {selectedHistory.time}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--color-slate-50)", padding: "1rem", borderRadius: "0.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", textTransform: "uppercase" }}>Booking ID</p>
                  <p style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{selectedHistory.bookingId}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", textTransform: "uppercase" }}>Event Date</p>
                  <p style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{selectedHistory.date}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", textTransform: "uppercase" }}>Status</p>
                  <p style={{ fontWeight: "600", color: selectedHistory.status === "Confirmed" ? "#166534" : "var(--color-slate-600)" }}>{selectedHistory.status}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", textTransform: "uppercase" }}>Tickets</p>
                  <p style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{selectedHistory.tickets} x General Admission</p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.75rem" }}>Payment Summary</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-500)" }}>
                  <span>Ticket Price ({selectedHistory.tickets}x)</span>
                  <span>{formatPrice(selectedHistory.pricePaid, currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-500)" }}>
                  <span>Taxes & Fees</span>
                  <span>{formatPrice(0, currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px dashed #cbd5e1", fontSize: "1rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>
                  <span>Total Paid</span>
                  <span>{formatPrice(selectedHistory.pricePaid, currency)}</span>
                </div>
              </div>
            </div>
            
            <div style={{ padding: "1.5rem", borderTop: "1px solid #e2e8f0", backgroundColor: "var(--color-slate-50)", textAlign: "right" }}>
              <button 
                onClick={() => setSelectedHistory(null)}
                style={{ padding: "0.5rem 1.5rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}
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
