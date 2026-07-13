import React, { useState, useEffect } from "react";
import { Menu, X, Calendar } from "lucide-react";

export default function Header({ onMobileDrawerOpen, onNavigate, currentUser, onLogout, isAuthPage }) {
  const [scrolled, setScrolled] = useState(false);

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
    <header className={`header-wrapper ${scrolled || isAuthPage ? "scrolled" : ""}`}>
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
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("events")}>Discover</span>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 700 }}>{currentUser.name}</span>
                  <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>{currentUser.role}</span>
                </div>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: currentUser.role === "admin" ? "#ef4444" : currentUser.role === "vendor" ? "#16a34a" : "#2563eb",
                  color: "white",
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
                    color: "#ef4444",
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
