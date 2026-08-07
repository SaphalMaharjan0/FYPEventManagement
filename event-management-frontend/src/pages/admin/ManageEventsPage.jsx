import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit2, Trash2, Filter, Star, X, MapPin } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice, formatDate, formatShortAddress } from "../../utils/formatting";
import { useSettings } from "../../contexts/SettingsContext";
import MapLocationPicker from "../../components/admin/MapLocationPicker";

export default function ManageEventsPage() {
  const fetchWithAuth = useFetch();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState(null); // 'new' or 'edit'

  const [newEvent, setNewEvent] = useState({
    name: "",
    category: "",
    date: "",
    venue: "",
    description: "",
    startTime: "",
    endTime: "",
    status: "draft",
    seats: "0/100",
    price: "Free",
    imageUrl: "",
    serviceIds: []
  });

  const [availableServices, setAvailableServices] = useState([]);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, servicesData, categoriesData] = await Promise.all([
          fetchWithAuth("/api/admin/events"),
          fetchWithAuth("/api/admin/services"),
          fetchWithAuth("/api/public/categories")
        ]);
        setEvents(eventsData || []);
        setAvailableServices(servicesData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Failed to load admin events/services", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const created = await fetchWithAuth("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (created) {
        setEvents([created, ...events]);
        setIsAddModalOpen(false);
        setNewEvent({
          name: "", category: "", date: "", venue: "", description: "", startTime: "", endTime: "", status: "draft", seats: "0/100", price: "Free", imageUrl: "", serviceIds: []
        });
      }
    } catch (err) {
      console.error("Failed to add event", err);
      alert("Failed to add event.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetchWithAuth(`/api/admin/events/${id}`, {
        method: "DELETE",
      });
      // fetchWithAuth returns the parsed JSON or null if 204 No Content
      setEvents(events.filter(ev => ev.dbId !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Failed to delete event.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const added = await fetchWithAuth("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName })
      });
      if (added) {
        setCategories([...categories, added]);
        setNewCategoryName("");
      }
    } catch (err) {
      console.error("Failed to add category", err);
      alert("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetchWithAuth(`/api/admin/categories/${id}`, {
        method: "DELETE"
      });
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Failed to delete category.");
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.venue && event.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || (event.status && event.status.toLowerCase() === statusFilter.toLowerCase());
    const matchesCategory = categoryFilter === "All" || (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Event Management</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem", backgroundColor: "white", color: "#3b82f6",
              border: "1px solid #3b82f6", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
              cursor: "pointer", transition: "background-color 0.2s"
            }}>
            Manage Categories
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white",
              border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
              cursor: "pointer", transition: "background-color 0.2s"
            }}>
            <Plus size={16} />
            Add Event
          </button>
        </div>
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
              placeholder="Search events by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 1rem", backgroundColor: showFilters ? "var(--color-slate-200)" : "var(--color-slate-50)",
                border: "1px solid #e2e8f0", borderRadius: "8px", color: "var(--color-slate-600)",
                cursor: "pointer", height: "100%"
              }}>
              <Filter size={18} />
            </button>

            {showFilters && (
              <div style={{
                position: "absolute", top: "110%", right: 0,
                backgroundColor: "white", borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
                padding: "1rem", zIndex: 10, minWidth: "200px"
              }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-slate-500)", marginBottom: "0.25rem" }}>Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-slate-500)", marginBottom: "0.25rem" }}>Category</label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
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
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>No events found.</td>
                </tr>
              ) : (
                filteredEvents.map((event, idx) => (
                  <tr key={event.id} style={{ borderBottom: idx !== filteredEvents.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--color-slate-800)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, #1e293b, #334155)` }}></div>
                          )}
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
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{formatShortAddress(event.venue)}</td>
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
                        <button onClick={() => handleDeleteEvent(event.dbId)} style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Add New Event</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Event Name</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>


              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Category</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "white" }}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Event Poster</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("http://localhost:8080/api/upload", {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) {
                          setNewEvent({ ...newEvent, imageUrl: "http://localhost:8080" + data.url });
                        }
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    }
                  }}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "0.5rem" }}
                />
                <div style={{ textAlign: "center", color: "var(--color-slate-500)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>OR enter URL</div>
                <input
                  type="text"
                  value={newEvent.imageUrl}
                  onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  placeholder="https://example.com/poster.jpg"
                />
                {newEvent.imageUrl && (
                  <div style={{ marginTop: "0.5rem", width: "100%", height: "150px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
                    <img src={newEvent.imageUrl} alt="Poster Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Venue</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    required
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMapTarget('new');
                      setIsMapModalOpen(true);
                    }}
                    style={{
                      padding: "0 1rem",
                      backgroundColor: "var(--bg-body-alt)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--color-slate-700)"
                    }}
                    title="Choose on Map"
                  >
                    <MapPin size={18} />
                    Map
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Price</label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="priceTypeNew"
                      checked={newEvent.price === "Free" || newEvent.price === 0 || newEvent.price === "0"}
                      onChange={() => setNewEvent({ ...newEvent, price: "Free" })}
                    />
                    Free
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="priceTypeNew"
                      checked={newEvent.price !== "Free" && newEvent.price !== 0 && newEvent.price !== "0"}
                      onChange={() => setNewEvent({ ...newEvent, price: "" })}
                    />
                    Paid
                  </label>
                </div>
                {newEvent.price !== "Free" && newEvent.price !== 0 && newEvent.price !== "0" && (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price amount"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Status</label>
                <select
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
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
                  value={newEvent.seats.split("/")[1] || newEvent.seats}
                  onChange={(e) => setNewEvent({ ...newEvent, seats: `0/${e.target.value}` })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Contract Vendor Services</label>
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {availableServices.length === 0 ? (
                    <span style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>No vendor services available.</span>
                  ) : (
                    availableServices.map(service => (
                      <label key={service.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-slate-700)", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={newEvent.serviceIds?.includes(service.id) || false}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...(newEvent.serviceIds || []), service.id]
                              : (newEvent.serviceIds || []).filter(id => id !== service.id);
                            setNewEvent({ ...newEvent, serviceIds: newIds });
                          }}
                        />
                        {service.serviceName} - ${service.price}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "white", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: "#3b82f6", color: "white", fontWeight: "600", cursor: "pointer" }}>
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto"
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
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Category</label>
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "white" }}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Date</label>
                <input
                  type="date"
                  value={editingEvent.date && editingEvent.date !== "N/A" ? editingEvent.date : ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Event Poster</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const res = await fetch("http://localhost:8080/api/upload", {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) {
                          setEditingEvent({ ...editingEvent, imageUrl: "http://localhost:8080" + data.url });
                        }
                      } catch (err) {
                        console.error("Upload failed", err);
                      }
                    }
                  }}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "0.5rem" }}
                />
                <div style={{ textAlign: "center", color: "var(--color-slate-500)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>OR enter URL</div>
                <input
                  type="text"
                  value={editingEvent.imageUrl || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  placeholder="https://example.com/poster.jpg"
                />
                {editingEvent.imageUrl && (
                  <div style={{ marginTop: "0.5rem", width: "100%", height: "150px", borderRadius: "6px", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
                    <img src={editingEvent.imageUrl} alt="Poster Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Venue</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    required
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMapTarget('edit');
                      setIsMapModalOpen(true);
                    }}
                    style={{
                      padding: "0 1rem",
                      backgroundColor: "var(--bg-body-alt)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--color-slate-700)"
                    }}
                    title="Choose on Map"
                  >
                    <MapPin size={18} />
                    Map
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Price</label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="priceTypeEdit"
                      checked={editingEvent.price === "Free" || editingEvent.price === 0 || editingEvent.price === "0"}
                      onChange={() => setEditingEvent({ ...editingEvent, price: "Free" })}
                    />
                    Free
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="priceTypeEdit"
                      checked={editingEvent.price !== "Free" && editingEvent.price !== 0 && editingEvent.price !== "0"}
                      onChange={() => setEditingEvent({ ...editingEvent, price: "" })}
                    />
                    Paid
                  </label>
                </div>
                {editingEvent.price !== "Free" && editingEvent.price !== 0 && editingEvent.price !== "0" && (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price amount"
                    value={editingEvent.price}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Description</label>
                <textarea
                  value={editingEvent.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
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
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>End Time</label>
                  <input
                    type="time"
                    value={editingEvent.endTime || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Status</label>
                <select
                  value={editingEvent.status || "draft"}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
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
                  onChange={(e) => setEditingEvent({ ...editingEvent, seats: `0/${e.target.value}` })}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Contract Vendor Services</label>
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {availableServices.length === 0 ? (
                    <span style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>No vendor services available.</span>
                  ) : (
                    availableServices.map(service => (
                      <label key={service.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-slate-700)", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          disabled={editingEvent.lockedServiceIds?.includes(service.id)}
                          checked={editingEvent.serviceIds?.includes(service.id) || false}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...(editingEvent.serviceIds || []), service.id]
                              : (editingEvent.serviceIds || []).filter(id => id !== service.id);
                            setEditingEvent({ ...editingEvent, serviceIds: newIds });
                          }}
                        />
                        {service.serviceName} - ${service.price}
                        {editingEvent.rejectedServiceIds?.includes(service.id) && (
                          <span style={{
                            marginLeft: "auto",
                            backgroundColor: "#fee2e2",
                            color: "#ef4444",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "1rem",
                            fontSize: "0.7rem",
                            fontWeight: "600"
                          }}>
                            Rejected by Vendor
                          </span>
                        )}
                      </label>
                    ))
                  )}
                </div>
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

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "90%", maxWidth: "500px",
            maxHeight: "90vh", overflowY: "auto", position: "relative"
          }}>
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-500)" }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--color-slate-900)" }}>Manage Categories</h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              />
              <button
                onClick={handleAddCategory}
                style={{ padding: "0.75rem 1.25rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}
              >
                Add
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "500" }}>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p style={{ textAlign: "center", color: "var(--color-slate-500)", padding: "1rem 0" }}>No categories found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Location Modal */}
      {isMapModalOpen && (
        <MapLocationPicker
          onClose={() => setIsMapModalOpen(false)}
          onConfirm={(address) => {
            if (mapTarget === 'new') {
              setNewEvent({ ...newEvent, venue: address });
            } else if (mapTarget === 'edit') {
              setEditingEvent({ ...editingEvent, venue: address });
            }
            setIsMapModalOpen(false);
          }}
        />
      )}

    </div>
  );
}
