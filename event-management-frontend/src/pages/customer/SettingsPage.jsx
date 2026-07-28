import React, { useState } from "react";
import { Bell, Shield, Globe } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const { currency, setCurrency, region, setRegion } = useSettings();

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
                style={{ width: "100%", maxWidth: "300px", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "0.95rem", outline: "none", backgroundColor: "var(--bg-card)", color: "var(--text-main)" }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="NPR">NPR (रु)</option>
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
    </div>
  );
}
