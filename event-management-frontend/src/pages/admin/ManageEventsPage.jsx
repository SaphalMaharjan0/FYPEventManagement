import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit2, Trash2, Filter, Star, X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function ManageEventsPage() {
  const fetchWithAuth = useFetch();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchWithAuth("/api/admin/events");
        setEvents(data || []);
      } catch (err) {
        console.error("Failed to load admin events", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [fetchWithAuth]);

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const updated = await fetchWithAuth(`/api/admin/events/${editingEvent.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      });
      if (updated) {
        setEvents(events.map(ev => ev.dbId === updated.dbId ? updated : ev));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update event", err);
      alert("Failed to update event.");
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Event Management</h1>
        <button style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        
        {/* Search and Filter Bar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "1rem" }}>
          <div style={{
            flex: 1,
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
              placeholder="Search events..." 
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
          
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 1rem", backgroundColor: "var(--color-slate-50)",
            border: "1px solid #e2e8f0", borderRadius: "8px", color: "var(--color-slate-600)",
            cursor: "pointer"
          }}>
            <Filter size={18} />
          </button>
        </div>

        {/* Events Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Event</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Category</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Venue</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Price</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Seats</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Rating</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>Loading events...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>No events found.</td>
                </tr>
              ) : (
                events.map((event, idx) => (
                  <tr key={event.id} style={{ borderBottom: idx !== events.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--color-slate-800)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {/* Placeholder image */}
                          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, #1e293b, #334155)` }}></div>
                        </div>
                        <span style={{ fontWeight: "500", color: "var(--color-slate-900)", fontSize: "0.95rem" }}>{event.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ 
                        backgroundColor: "var(--color-slate-100)", 
                        color: "var(--color-slate-600)", 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "1rem", 
                        fontSize: "0.8rem", 
                        fontWeight: "500" 
                      }}>
                        {event.category}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{event.date}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{event.venue}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)" }}>{event.price}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{event.seats}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-slate-900)", fontWeight: "600", fontSize: "0.9rem" }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        {event.rating}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Eye size={16} /></button>
                        <button onClick={() => handleEditClick(event)} style={{ background: "none", border: "none", color: "var(--color-blue-500)", cursor: "pointer" }}><Edit2 size={16} /></button>
                        <button style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Edit Event</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateEvent} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Event Name</label>
                <input 
                  type="text" 
                  value={editingEvent.name} 
                  onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Category</label>
                <input 
                  type="text" 
                  value={editingEvent.category} 
                  onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Date</label>
                <input 
                  type="date" 
                  value={editingEvent.date && editingEvent.date !== "N/A" ? editingEvent.date : ""} 
                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Venue</label>
                <input 
                  type="text" 
                  value={editingEvent.venue} 
                  onChange={(e) => setEditingEvent({...editingEvent, venue: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Description</label>
                <textarea 
                  value={editingEvent.description || ""} 
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows={3}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Start Time</label>
                  <input 
                    type="time" 
                    value={editingEvent.startTime || ""} 
                    onChange={(e) => setEditingEvent({...editingEvent, startTime: e.target.value})}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>End Time</label>
                  <input 
                    type="time" 
                    value={editingEvent.endTime || ""} 
                    onChange={(e) => setEditingEvent({...editingEvent, endTime: e.target.value})}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Status</label>
                <select 
                  value={editingEvent.status || "draft"} 
                  onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Capacity (Seats)</label>
                <input 
                  type="text" 
                  value={editingEvent.seats ? editingEvent.seats.split("/")[1] || editingEvent.seats : ""} 
                  onChange={(e) => setEditingEvent({...editingEvent, seats: `0/${e.target.value}`})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "white", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: "#3b82f6", color: "white", fontWeight: "600", cursor: "pointer" }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
