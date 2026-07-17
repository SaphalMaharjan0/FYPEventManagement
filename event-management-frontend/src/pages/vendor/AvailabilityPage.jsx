import React from "react";
import { Calendar as CalendarIcon, Clock, Save, X } from "lucide-react";

export default function AvailabilityPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>Availability & Schedule</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your working hours and block out dates.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Weekly Hours */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Clock size={20} color="#3b82f6" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>Standard Working Hours</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {days.map((day, i) => (
              <div key={day} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "150px" }}>
                  <input type="checkbox" defaultChecked={i < 5} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                  <span style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.95rem" }}>{day}</span>
                </div>
                
                {i < 5 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
                    <input type="time" defaultValue="09:00" style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", outline: "none" }} />
                    <span style={{ color: "#64748b" }}>to</span>
                    <input type="time" defaultValue="17:00" style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", outline: "none" }} />
                  </div>
                ) : (
                  <div style={{ flex: 1, textAlign: "right", color: "#94a3b8", fontSize: "0.9rem", fontStyle: "italic" }}>
                    Unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Dates */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <CalendarIcon size={20} color="#f59e0b" />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>Blocked Dates</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>Add specific dates when you are unavailable for bookings (e.g. holidays).</p>
            
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input type="date" style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none" }} />
              <button style={{ padding: "0.5rem 1rem", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>Add</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Sep 10, 2025 - Sep 14, 2025 (Vacation)", "Nov 27, 2025 (Holiday)"].map((date, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", backgroundColor: "#fffbeb", borderRadius: "0.5rem", border: "1px solid #fde68a", fontSize: "0.85rem", color: "#b45309" }}>
                  <span>{date}</span>
                  <button style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer" }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
