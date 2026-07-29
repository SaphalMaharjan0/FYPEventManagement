import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Save, X, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function AvailabilityPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [availability, setAvailability] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New blocked date form
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  const fetchWithAuth = useFetch();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWithAuth("/api/vendor/availability");
      
      // Ensure we have all 7 days in the correct order
      const sortedAvailability = days.map(dayName => {
        const found = data.availability?.find(a => a.dayOfWeek.toLowerCase() === dayName.toLowerCase());
        if (found) {
          return {
            ...found,
            startTime: found.startTimeStr || found.startTime || "09:00",
            endTime: found.endTimeStr || found.endTime || "17:00"
          };
        }
        return {
          dayOfWeek: dayName,
          isAvailable: dayName !== "Saturday" && dayName !== "Sunday",
          startTime: "09:00",
          endTime: "17:00"
        };
      });

      setAvailability(sortedAvailability);
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      setError(err.message || "Failed to load availability settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayIndex) => {
    const updated = [...availability];
    updated[dayIndex].isAvailable = !updated[dayIndex].isAvailable;
    setAvailability(updated);
  };

  const handleTimeChange = (dayIndex, field, value) => {
    const updated = [...availability];
    // Ensure format is HH:MM or HH:MM:SS
    let formattedVal = value;
    if (value && value.length === 5) {
      formattedVal = value + ":00";
    }
    updated[dayIndex][field] = formattedVal;
    setAvailability(updated);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const payload = {
        availability: availability.map(a => ({
          dayOfWeek: a.dayOfWeek,
          isAvailable: a.isAvailable,
          startTime: a.startTime.length === 5 ? a.startTime + ":00" : a.startTime,
          endTime: a.endTime.length === 5 ? a.endTime + ":00" : a.endTime
        })),
        blockedDates: blockedDates
      };

      await fetchWithAuth("/api/vendor/availability", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      setSuccess("Availability hours saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save availability changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    try {
      setError(null);
      setSuccess(null);
      const response = await fetchWithAuth("/api/vendor/availability/blocked", {
        method: "POST",
        body: JSON.stringify({
          blockedDate: newDate,
          reason: newReason || "Unavailable"
        })
      });

      setBlockedDates([...blockedDates, response]);
      setNewDate("");
      setNewReason("");
      setSuccess("Blocked date added successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to add blocked date.");
    }
  };

  const handleDeleteBlockedDate = async (dateToDelete) => {
    try {
      setError(null);
      setSuccess(null);
      await fetchWithAuth(`/api/vendor/availability/blocked/${dateToDelete}`, {
        method: "DELETE"
      });

      setBlockedDates(blockedDates.filter(d => d.blockedDate !== dateToDelete));
      setSuccess("Blocked date removed.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to remove blocked date.");
    }
  };

  const formatDisplayDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "var(--color-slate-500)" }}>
        Loading availability schedule...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>Availability & Schedule</h1>
          <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>Manage your working hours and block out specific dates.</p>
        </div>
        <button 
          onClick={handleSaveChanges}
          disabled={saving}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            padding: "0.6rem 1.25rem", 
            backgroundColor: saving ? "var(--color-slate-400)" : "var(--color-blue-500)", 
            color: "var(--color-white)", 
            border: "none", 
            borderRadius: "0.5rem", 
            fontWeight: "500", 
            cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Weekly Hours */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Clock size={20} color="var(--color-blue-500)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Standard Working Hours</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {availability.map((dayObj, i) => {
              // Strip seconds if present for time inputs (e.g. "09:00:00" -> "09:00")
              const displayStart = dayObj.startTime ? dayObj.startTime.substring(0, 5) : "09:00";
              const displayEnd = dayObj.endTime ? dayObj.endTime.substring(0, 5) : "17:00";

              return (
                <div key={dayObj.dayOfWeek} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "150px" }}>
                    <input 
                      type="checkbox" 
                      checked={dayObj.isAvailable} 
                      onChange={() => handleDayToggle(i)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }} 
                    />
                    <span style={{ fontWeight: "600", color: "var(--color-slate-900)", fontSize: "0.95rem" }}>{dayObj.dayOfWeek}</span>
                  </div>
                  
                  {dayObj.isAvailable ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
                      <input 
                        type="time" 
                        value={displayStart} 
                        onChange={(e) => handleTimeChange(i, "startTime", e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", outline: "none" }} 
                      />
                      <span style={{ color: "var(--color-slate-500)" }}>to</span>
                      <input 
                        type="time" 
                        value={displayEnd} 
                        onChange={(e) => handleTimeChange(i, "endTime", e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", outline: "none" }} 
                      />
                    </div>
                  ) : (
                    <div style={{ flex: 1, textAlign: "right", color: "var(--color-slate-400)", fontSize: "0.9rem", fontStyle: "italic" }}>
                      Unavailable
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <CalendarIcon size={20} color="var(--color-amber-500)" />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Blocked Dates</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-500)", marginBottom: "1rem" }}>Add specific dates when you are unavailable for bookings (e.g. holidays, vacations).</p>
            
            <form onSubmit={handleAddBlockedDate} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <input 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none" }} 
              />
              <input 
                type="text" 
                placeholder="Reason (e.g. Vacation, Holiday)"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none" }} 
              />
              <button 
                type="submit"
                style={{ 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  padding: "0.6rem 1rem", 
                  backgroundColor: "var(--color-slate-900)", 
                  color: "var(--color-white)", 
                  border: "none", 
                  borderRadius: "0.5rem", 
                  fontWeight: "500", 
                  cursor: "pointer" 
                }}
              >
                <Plus size={16} /> Add Blocked Date
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {blockedDates.map((item) => (
                <div key={item.id || item.blockedDate} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", backgroundColor: "var(--color-amber-50)", borderRadius: "0.5rem", border: "1px solid #fde68a", fontSize: "0.85rem", color: "var(--color-amber-700)" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "600" }}>{formatDisplayDate(item.blockedDate)}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{item.reason}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteBlockedDate(item.blockedDate)}
                    style={{ background: "none", border: "none", color: "var(--color-amber-700)", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {blockedDates.length === 0 && (
                <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--color-slate-400)", fontSize: "0.85rem", border: "1px dashed #cbd5e1", borderRadius: "0.5rem" }}>
                  No blocked dates scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
