import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export default function ProfilePage({ currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(" ")[0] || "Alex",
    lastName: currentUser?.name?.split(" ")[1] || "Morgan",
    email: currentUser?.email || "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  });

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>My Profile</h1>
          <p style={{ color: "#64748b" }}>Manage your personal information.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: "0.5rem 1.25rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => setIsEditing(false)}
              style={{ padding: "0.5rem 1.25rem", backgroundColor: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              style={{ padding: "0.5rem 1.25rem", backgroundColor: "#22c55e", color: "white", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        
        {/* Profile Header Card */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", display: "flex", alignItems: "center", gap: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold" }}>
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            {isEditing && (
              <button style={{ position: "absolute", bottom: "0", right: "0", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <Camera size={16} />
              </button>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>{formData.firstName} {formData.lastName}</h2>
            <p style={{ color: "#64748b", textTransform: "capitalize" }}>{currentUser?.role || "Customer"}</p>
          </div>
        </div>

        {/* Profile Details Form */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.5rem" }}>Personal Information</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>First Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} color="#94a3b8" />
                  {formData.firstName}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Last Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} color="#94a3b8" />
                  {formData.lastName}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Mail size={16} color="#94a3b8" />
                  {formData.email}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Phone Number</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={16} color="#94a3b8" />
                  {formData.phone}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "span 2" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Location</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{ padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
                />
              ) : (
                <div style={{ padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={16} color="#94a3b8" />
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
