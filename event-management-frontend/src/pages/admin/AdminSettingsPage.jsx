import React from "react";
import { Save, Shield, Bell, Globe, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>System Settings</h1>
        <button style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Settings Navigation */}
        <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "white", color: "#3b82f6", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", fontSize: "0.95rem", textAlign: "left", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Globe size={18} /> General
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "transparent", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "500", fontSize: "0.95rem", textAlign: "left", cursor: "pointer" }}>
            <Shield size={18} /> Security
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "transparent", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "500", fontSize: "0.95rem", textAlign: "left", cursor: "pointer" }}>
            <Bell size={18} /> Notifications
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "transparent", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "500", fontSize: "0.95rem", textAlign: "left", cursor: "pointer" }}>
            <Database size={18} /> Database Backups
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Platform Identity</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Platform Name</label>
                <input type="text" defaultValue="EventPulse" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }} />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Support Email</label>
                <input type="email" defaultValue="support@eventpulse.com" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Payment & Fees</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Platform Fee Percentage (%)</label>
                <input type="number" defaultValue="5.0" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none" }} />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Default Currency</label>
                <select style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", backgroundColor: "white" }}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
