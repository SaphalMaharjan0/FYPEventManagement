import React from "react";
import { Save, Bell, Shield, Globe, MapPin, X, User } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { useFetch } from "../../hooks/useFetch";
import MapLocationPicker from "../../components/admin/MapLocationPicker";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { currency, setCurrency, region, setRegion } = useSettings();
  const fetchWithAuth = useFetch();
  
  const [profile, setProfile] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [businessAddress, setBusinessAddress] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchWithAuth("/api/vendor/profile");
        if (data) {
          setProfile(data);
          setBusinessAddress(data.businessAddress || "");
        }
      } catch (err) {
        console.error("Failed to load vendor profile:", err);
      }
    };
    loadProfile();
  }, [fetchWithAuth]);

  const handleUpdateLocation = async (newAddress) => {
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, businessAddress: newAddress };
      const res = await fetchWithAuth("/api/vendor/profile", {
        method: "PUT",
        body: JSON.stringify(updatedProfile)
      });
      alert("Business address updated successfully!");
      if (res) {
        setProfile(res);
        setBusinessAddress(res.businessAddress || "");
      }
      setIsLocationModalOpen(false);
    } catch (err) {
      alert("Failed to update business address.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>Settings</h1>
          <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>Manage your account preferences and security.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={20} color="var(--color-purple-500)" /> Profile
        </h2>

        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Business Address</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <input 
                type="text" 
                value={businessAddress || "Not set"} 
                readOnly
                style={{ width: "100%", maxWidth: "400px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", backgroundColor: "#f8fafc", color: "var(--color-slate-500)", cursor: "not-allowed" }}
              />
              <button 
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", backgroundColor: "var(--color-blue-500)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <MapPin size={16} /> Edit on Map
              </button>
            </div>
          </div>
        </form>

        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Globe size={20} color="var(--color-purple-500)" /> Preferences
        </h2>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: "100%", maxWidth: "300px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", backgroundColor: "white", color: "var(--color-slate-900)" }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NPR">NPR (रु)</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Region</label>
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              style={{ width: "100%", maxWidth: "300px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", backgroundColor: "white", color: "var(--color-slate-900)" }}
            >
              <option value="US">United States</option>
              <option value="EU">Europe</option>
              <option value="UK">United Kingdom</option>
              <option value="NP">Nepal</option>
            </select>
          </div>
        </form>

        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bell size={20} color="var(--color-blue-500)" /> Notifications
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
              <label style={{ fontSize: "0.95rem", color: "var(--color-slate-900)", cursor: "pointer" }}>{text}</label>
            </div>
          ))}
        </form>

        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginTop: "3rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={20} color="var(--color-green-500)" /> Security
        </h2>
        
        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>
          <div>
            <button style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-900)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <MapLocationPicker 
          onClose={() => setIsLocationModalOpen(false)}
          onConfirm={handleUpdateLocation}
        />
      )}
    </div>
  );
}
