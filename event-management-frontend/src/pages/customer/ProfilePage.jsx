import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function ProfilePage({ currentUser, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fetchWithAuth = useFetch();

  const [formData, setFormData] = useState({
    firstName: currentUser?.fullName?.split(" ")[0] || "Alex",
    lastName: currentUser?.fullName?.split(" ")[1] || "Morgan",
    email: currentUser?.email || "alex@example.com",
    phone: currentUser?.phone || "+1 (555) 123-4567",
    location: "San Francisco, CA"
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone
        })
      });

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>My Profile</h1>
          <p style={{ color: "var(--color-slate-500)" }}>Manage your personal information.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: "0.5rem 1.25rem", backgroundColor: "var(--color-blue-600)", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => setIsEditing(false)}
              style={{ padding: "0.5rem 1.25rem", backgroundColor: "var(--color-white)", color: "var(--color-slate-500)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              style={{ padding: "0.5rem 1.25rem", backgroundColor: isSaving ? "#86efac" : "#22c55e", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "0.9rem", cursor: isSaving ? "not-allowed" : "pointer" }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        
        {/* Profile Header Card */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", display: "flex", alignItems: "center", gap: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "var(--color-blue-600)", color: "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold" }}>
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            {isEditing && (
              <button style={{ position: "absolute", bottom: "0", right: "0", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-slate-500)", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <Camera size={16} />
              </button>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{formData.firstName} {formData.lastName}</h2>
            <p style={{ color: "var(--color-slate-500)", textTransform: "capitalize" }}>{currentUser?.role || "Customer"}</p>
          </div>
        </div>

        {/* Profile Details Form */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Personal Information</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>First Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} color="var(--color-slate-400)" />
                  {formData.firstName}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Last Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} color="var(--color-slate-400)" />
                  {formData.lastName}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Mail size={16} color="var(--color-slate-400)" />
                  {formData.email}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={16} color="var(--color-slate-400)" />
                  {formData.phone}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "span 2" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Location</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={16} color="var(--color-slate-400)" />
                  {formData.location}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
