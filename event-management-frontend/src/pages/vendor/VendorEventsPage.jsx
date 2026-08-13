import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar as CalendarIcon, DollarSign, Send } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { formatPrice, formatDate, formatShortAddress, convertToUSD } from "../../utils/formatting";

export default function VendorEventsPage({ currentUser }) {
  const fetchWithAuth = useFetch();
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, vendorData] = await Promise.all([
          fetchWithAuth("/api/events"),
          fetchWithAuth("/api/vendor/profile")
        ]);
        setEvents(eventsData || []);
        setServices(vendorData?.services || []);
        setIsVerified(vendorData?.isVerified || false);
      } catch (err) {
        console.error("Failed to load events or services", err);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchWithAuth]);

  const handleApplyClick = (event) => {
    setSelectedEvent(event);
    setSelectedServiceId(services.length > 0 ? services[0].id : "");
    setIsApplyModalOpen(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    
    setIsApplying(true);
    try {
      const response = await fetchWithAuth(`/api/vendor/requests/events/${selectedEvent.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedServiceId })
      });
      if (response) {
        alert("Application submitted successfully!");
        setIsApplyModalOpen(false);
      }
    } catch (err) {
      alert("Failed to submit application: " + (err.message || "Unknown error"));
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading events...</div>;
  }

  if (isVerified === false) {
    return (
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "3rem 2rem", textAlign: "center", backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Action Required</h2>
        <p style={{ color: "var(--color-slate-600)", marginBottom: "1.5rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 2rem" }}>
          You must be approved by an administrator before you can browse and apply to events. Please complete your profile and upload the necessary business documents for verification.
        </p>
        <button 
          onClick={() => navigate("/vendor/profile")}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Browse Events</h1>
      <p style={{ color: "var(--text-subtle)", marginBottom: "2rem" }}>
        Find upcoming events and propose your services to the event organizers.
      </p>

      {services.length === 0 && (
        <div style={{ padding: "1rem", backgroundColor: "#FEF2F2", color: "#991B1B", borderRadius: "8px", marginBottom: "2rem" }}>
          You must add at least one service to your profile before you can apply to events.
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem"
      }}>
        {events.map((event) => (
          <div key={event.id} style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <div style={{ height: "160px", backgroundColor: "#f3f4f6", position: "relative" }}>
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                  No Image
                </div>
              )}
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                backgroundColor: "rgba(255,255,255,0.9)", padding: "4px 8px",
                borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600",
                color: "#4f46e5"
              }}>
                {event.category}
              </div>
            </div>
            
            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{event.title}</h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-subtle)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                <CalendarIcon size={14} />
                <span>{formatDate(event.date)} at {event.time}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-subtle)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                <MapPin size={14} />
                <span>{formatShortAddress(event.venue)}</span>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                <button
                  onClick={() => handleApplyClick(event)}
                  disabled={services.length === 0}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: services.length === 0 ? "#9ca3af" : "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: services.length === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Send size={16} />
                  Offer Service
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isApplyModalOpen && selectedEvent && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "var(--bg-card)",
            padding: "2rem",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Offer Service</h2>
            <p style={{ color: "var(--text-subtle)", marginBottom: "1.5rem" }}>
              Apply to provide a service for <strong>{selectedEvent.title}</strong>.
            </p>

            <form onSubmit={submitApplication}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Select Service to Offer</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  style={{
                    width: "100%", padding: "0.75rem", borderRadius: "8px",
                    border: "1px solid var(--border-main)", backgroundColor: "var(--bg-main)"
                  }}
                  required
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.serviceName} - ${s.price}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.5rem", border: "1px solid var(--border-main)",
                    borderRadius: "8px", backgroundColor: "transparent", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  style={{
                    padding: "0.75rem 1.5rem", backgroundColor: "#2563eb",
                    color: "white", border: "none", borderRadius: "8px",
                    fontWeight: "500", cursor: isApplying ? "wait" : "pointer"
                  }}
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
