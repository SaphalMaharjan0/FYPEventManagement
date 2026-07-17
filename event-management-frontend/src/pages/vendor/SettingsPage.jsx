import React from "react";
import { Save, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>Settings</h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your account preferences and security.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bell size={20} color="#3b82f6" /> Notifications
        </h2>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            "Email me when I receive a new booking request.",
            "Email me when a booking is confirmed or canceled.",
            "Send me marketing emails and promotions.",
            "Notify me of system updates and feature releases."
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="checkbox" defaultChecked={i < 2} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
              <label style={{ fontSize: "0.95rem", color: "#0f172a", cursor: "pointer" }}>{text}</label>
            </div>
          ))}
        </form>

        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", marginTop: "3rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={20} color="#10b981" /> Security
        </h2>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
            />
          </div>
          <div>
            <button style={{ padding: "0.6rem 1.25rem", backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
