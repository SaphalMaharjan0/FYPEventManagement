import React, { useState, useEffect } from "react";
import { Bell, Shield, Globe, MapPin, X, User } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
import MapLocationPicker from "../../components/admin/MapLocationPicker";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const { currency, setCurrency, region, setRegion } = useSettings();

  const fetchWithAuth = useFetch();
  const { user, updateUser } = useAuth();
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState(user?.location || "");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleUpdateLocation = async (newAddress) => {
    try {
      const res = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({ location: newAddress })
      });
      alert("Location updated successfully!");
      setLocation(newAddress);
      
      // Update local storage user profile so other pages reflect the change
      if (user) {
        updateUser({ ...user, location: newAddress });
      }
      
      setIsLocationModalOpen(false);
    } catch (err) {
      alert("Failed to update location.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await fetchWithAuth("/api/users/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      alert("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("Failed to change password. Please check your current password.");
    }
  };

  return (
    <div style={{ color: "var(--text-main)", fontFamily: "var(--font-body)" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "var(--text-main)",
          marginBottom: "0.5rem",
          fontFamily: "var(--font-heading)",
        }}
      >
        Settings
      </h1>
      <p style={{ color: "var(--text-subtle)", marginBottom: "2rem" }}>
        Manage your account settings and preferences.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Profile Settings */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-md, 0.75rem)",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--border-main)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.15)",
                color: "#8b5cf6",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm, 0.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={20} />
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Profile
            </h2>
          </div>

          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem" }}>Base Location</label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  value={location || "Not set"} 
                  readOnly
                  style={{ width: "100%", maxWidth: "400px", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "0.95rem", outline: "none", backgroundColor: "var(--bg-body-alt)", color: "var(--text-subtle)", cursor: "not-allowed" }}
                />
                <button 
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", backgroundColor: "var(--primary, #3b82f6)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <MapPin size={16} /> Edit on Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Settings */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-md, 0.75rem)",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--border-main)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.15)",
                color: "#8b5cf6",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm, 0.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe size={20} />
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Preferences
            </h2>
          </div>

          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem" }}>Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                disabled
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-light)", backgroundColor: "var(--bg-secondary)", color: "var(--text-main)", fontSize: "0.95rem", cursor: "not-allowed", opacity: 0.7 }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="NPR">NPR (Rs)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem" }}>Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: "100%", maxWidth: "300px", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "0.95rem", outline: "none", backgroundColor: "var(--bg-card)", color: "var(--text-main)" }}
              >
                <option value="US">United States</option>
                <option value="EU">Europe</option>
                <option value="UK">United Kingdom</option>
                <option value="NP">Nepal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-md, 0.75rem)",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--border-main)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "var(--primary, #3b82f6)",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm, 0.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={20} />
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Notifications
            </h2>
          </div>

          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "var(--text-main)" }}>
                  Email Notifications
                </div>
                <div
                  style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}
                >
                  Receive updates about your bookings and events.
                </div>
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "var(--primary, #3b82f6)",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "var(--text-main)" }}>
                  SMS Notifications
                </div>
                <div
                  style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}
                >
                  Receive text messages for important updates.
                </div>
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "var(--primary, #3b82f6)",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "var(--text-main)" }}>
                  Marketing Emails
                </div>
                <div
                  style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}
                >
                  Receive emails about new features and recommendations.
                </div>
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "var(--primary, #3b82f6)",
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-md, 0.75rem)",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--border-main)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                color: "#22c55e",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm, 0.5rem)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={20} />
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Security
            </h2>
          </div>

          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                border: "1px solid var(--border-main)",
                borderRadius: "var(--radius-sm, 0.5rem)",
                color: "var(--text-main)",
                fontWeight: "500",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-body-alt)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Change Password
            </button>
            <button
              type="button"
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                border: "1px solid var(--border-main)",
                borderRadius: "var(--radius-sm, 0.5rem)",
                color: "var(--text-main)",
                fontWeight: "500",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-body-alt)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Change Password</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", zIndex: 2000 }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              <button 
                type="submit" 
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--primary, #3b82f6)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginTop: "0.5rem"
                }}
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
      
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
