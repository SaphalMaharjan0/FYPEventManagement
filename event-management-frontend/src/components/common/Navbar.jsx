import React, { useState, useEffect, useRef } from "react";
import { Menu, Calendar, Moon, Sun } from "lucide-react";

export default function Header({
  onMobileDrawerOpen,
  onNavigate,
  currentUser,
  onLogout,
  isAuthPage,
  isDarkMode,
  toggleDarkMode,
  activePage = "landing",
}) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Core background styling flag
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // 2. Smart sticky logic (Show on scroll up, hide on scroll down)
      if (currentScrollY <= 80) {
        // Keep header visible at the very top of the page
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> Hide header
        setVisible(false);
      } else {
        // Scrolling up -> Show header
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = currentUser?.name || currentUser?.fullName || "User";
  const displayRole = currentUser?.role || "member";

  const isTransparent = !scrolled && !isAuthPage;

  const headerBg = isTransparent
    ? "transparent"
    : isDarkMode
      ? "rgba(21, 28, 46, 0.9)"
      : "rgba(255, 255, 255, 0.9)";

  const textColor = isTransparent ? "#ffffff" : "var(--text-main)";

  const textSubtleColor = isTransparent
    ? "rgba(255, 255, 255, 0.75)"
    : "var(--text-subtle)";

  const borderColor = isTransparent
    ? "rgba(255, 255, 255, 0.15)"
    : "var(--border-main)";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        // Slide animation handles visibility cleanly
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        backdropFilter: isTransparent ? "none" : "blur(12px)",
        WebkitBackdropFilter: isTransparent ? "none" : "blur(12px)",
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: isTransparent ? "none" : "var(--shadow-sm)",
        transition:
          "transform 0.3s ease-in-out, background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <div className="container header-container">
        <div className="header-main">
          {/* Logo */}
          <div
            className="logo"
            onClick={() => onNavigate("landing")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-icon">
              <Calendar size={18} />
            </div>
            <span style={{ color: textColor, fontWeight: 700 }}>
              EventPulse
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <span
              className={`nav-link ${activePage === "events" ? "active" : ""}`}
              onClick={() => onNavigate("events")}
              style={{
                cursor: "pointer",
                color:
                  activePage === "events"
                    ? isTransparent
                      ? "#ffffff"
                      : "var(--primary)"
                    : textSubtleColor,
              }}
            >
              Events
            </span>
            <span
              className={`nav-link ${activePage === "discover" ? "active" : ""}`}
              onClick={() => onNavigate("discover")}
              style={{
                cursor: "pointer",
                color:
                  activePage === "discover"
                    ? isTransparent
                      ? "#ffffff"
                      : "var(--primary)"
                    : textSubtleColor,
              }}
            >
              Discover
            </span>
          </nav>

          {/* Desktop Actions */}
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              style={{
                background: isTransparent
                  ? "rgba(255, 255, 255, 0.12)"
                  : "var(--bg-counter-btn)",
                border: `1px solid ${borderColor}`,
                cursor: "pointer",
                color: textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                transition: "var(--transition-fast)",
              }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {currentUser ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {displayName}
                  </span>
                  <span
                    style={{
                      color: textSubtleColor,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {displayRole}
                  </span>
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor:
                      currentUser.role === "admin"
                        ? "var(--color-red-500)"
                        : currentUser.role === "vendor"
                          ? "#16a34a"
                          : "var(--primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    border: isTransparent
                      ? "2px solid rgba(255,255,255,0.2)"
                      : "2px solid var(--border-main)",
                  }}
                >
                  {displayName
                    ? displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </div>
                <button
                  className="btn-logout"
                  onClick={onLogout}
                  style={{
                    color: textColor,
                    background: "transparent",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  className="btn-login"
                  onClick={() => onNavigate("login")}
                  style={{
                    color: textColor,
                    background: "none",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Log In
                </button>
                <button
                  className="btn-getstarted"
                  onClick={() => onNavigate("register")}
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="menu-toggle"
            onClick={onMobileDrawerOpen}
            aria-label="Toggle Navigation"
            style={{
              background: "none",
              border: "none",
              color: textColor,
              cursor: "pointer",
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
