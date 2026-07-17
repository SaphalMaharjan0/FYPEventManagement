import React, { useState } from "react";
import { Bell, Shield, CreditCard, Mail } from "lucide-react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Settings</h1>
      <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem" }}>Manage your account settings and preferences.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Notifications Settings */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-500)", padding: "0.5rem", borderRadius: "0.5rem" }}>
              <Bell size={20} />
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Notifications</h2>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "500", color: "var(--color-slate-900)" }}>Email Notifications</div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>Receive updates about your bookings and events.</div>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "500", color: "var(--color-slate-900)" }}>SMS Notifications</div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>Receive text messages for important updates.</div>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
              </label>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "500", color: "var(--color-slate-900)" }}>Marketing Emails</div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-slate-500)" }}>Receive emails about new features and recommendations.</div>
              </div>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={marketingEmails} onChange={(e) => setMarketingEmails(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ backgroundColor: "var(--color-green-50)", color: "#22c55e", padding: "0.5rem", borderRadius: "0.5rem" }}>
              <Shield size={20} />
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Security</h2>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: "var(--color-slate-900)", fontWeight: "500", fontSize: "0.9rem", cursor: "pointer" }}>
              Change Password
            </button>
            <button style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: "var(--color-slate-900)", fontWeight: "500", fontSize: "0.9rem", cursor: "pointer" }}>
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
