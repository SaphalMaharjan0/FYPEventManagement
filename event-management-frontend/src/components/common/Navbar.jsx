import React, { useState, useEffect } from "react";
import { Menu, X, Calendar, Moon, Sun, Globe, DollarSign } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export default function Header({ onMobileDrawerOpen, onNavigate, currentUser, onLogout, isAuthPage, isDarkMode, toggleDarkMode, solidBg }) {
  const [scrolled, setScrolled] = useState(false);
  const { currency, setCurrency, region, setRegion } = useSettings();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header-wrapper ${scrolled || isAuthPage || solidBg ? "scrolled" : ""}`}>
      <div className="container header-container">


        {/* Main Header Bar */}
        <div className="header-main">
          {/* Logo */}
          <div className="logo" onClick={() => onNavigate("landing")}>
            <div className="logo-icon">
              <Calendar size={18} />
            </div>
            <span>EventPulse</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("events")}>Events</span>
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("discover")}>Discover</span>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            <div style={{ position: "relative", marginRight: "1rem" }}>
              <button 
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "var(--color-white)",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  outline: "none",
                  fontWeight: 500
                }}
              >
                <Globe size={16} />
                <span>{region} / {currency}</span>
              </button>

              {isPreferencesOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  backgroundColor: "var(--color-white)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "1rem",
                  zIndex: 50,
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem"
                }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-slate-500)", marginBottom: "0.25rem", textTransform: "uppercase" }}>Region</label>
                    <select 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--color-slate-200)",
                        backgroundColor: "var(--color-slate-50)",
                        color: "var(--color-slate-900)",
                        fontSize: "0.85rem",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="US">US (MM/DD/YY)</option>
                      <option value="EU">EU (DD/MM/YY)</option>
                      <option value="UK">UK (DD/MM/YY)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-slate-500)", marginBottom: "0.25rem", textTransform: "uppercase" }}>Currency</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--color-slate-200)",
                        backgroundColor: "var(--color-slate-50)",
                        color: "var(--color-slate-900)",
                        fontSize: "0.85rem",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NPR">NPR (Rs)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleDarkMode}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "var(--color-white)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginRight: "0.5rem"
              }}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                  <span style={{ color: "var(--color-white)", fontSize: "0.85rem", fontWeight: 700 }}>{currentUser.name}</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>{currentUser.role}</span>
                </div>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: currentUser.role === "admin" ? "var(--color-red-500)" : currentUser.role === "vendor" ? "#16a34a" : "var(--color-blue-600)",
                  color: "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.2)"
                }}>
                  {currentUser.name ? currentUser.name.split(" ").map(n => n[0]).join("") : "U"}
                </div>
                <button 
                  onClick={onLogout}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-red-500)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "var(--transition-fast)"
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button className="btn-login" onClick={() => onNavigate("login")}>Log In</button>
                <button className="btn-getstarted" onClick={() => onNavigate("register")}>Get Started</button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Menu */}
          <button className="menu-toggle" onClick={onMobileDrawerOpen} aria-label="Toggle Navigation">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
