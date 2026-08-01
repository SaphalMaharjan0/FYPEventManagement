import React from "react";
import { Search, Bell, Moon, Sun, Menu, Compass } from "lucide-react";

export default function Topbar({
  currentUser,
  onNavigate,
  isDarkMode = false,
  toggleDarkMode,
  onMenuClick,
}) {
  const handleThemeToggle = (e) => {
    e.stopPropagation();
    if (typeof toggleDarkMode === "function") {
      toggleDarkMode();
    }
  };

  return (
    <header
      className={`topbar-header ${isDarkMode ? "dark-theme" : "light-theme"}`}
    >
      <style>{`
        /* Dynamic Theme Variables */
        .topbar-header.light-theme {
          --topbar-bg: var(--bg-card, #ffffff);
          --topbar-border: var(--border-main, #e2e8f0);
          --topbar-text: var(--text-main, #0f172a);
          --topbar-subtle: var(--text-subtle, #64748b);
          --topbar-hover-bg: var(--hover-bg, rgba(0, 0, 0, 0.06));
          --topbar-hover-text: #0f172a;
          --search-bg: var(--bg-body-alt, #f8fafc);
        }

        .topbar-header.dark-theme {
          --topbar-bg: var(--bg-card, #111827);
          --topbar-border: var(--border-main, rgba(255, 255, 255, 0.05));
          --topbar-text: var(--text-main, #ffffff);
          --topbar-subtle: var(--text-subtle, #94a3b8);
          --topbar-hover-bg: var(--hover-bg, rgba(255, 255, 255, 0.08));
          --topbar-hover-text: #ffffff;
          --search-bg: var(--bg-body-alt, rgba(255, 255, 255, 0.05));
        }

        .topbar-header {
          height: 70px;
          width: 100%;
          background-color: var(--topbar-bg);
          border-bottom: 1px solid var(--topbar-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-sizing: border-box;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        /* Mobile Brand Logo */
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-right: 1rem;
        }

        .topbar-brand-logo {
          background-color: #3b82f6;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .topbar-brand-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--topbar-text);
          white-space: nowrap;
        }

        /* Search Input */
        .topbar-search-wrapper {
          flex: 1;
          max-width: 400px;
        }

        .topbar-search-box {
          display: flex;
          align-items: center;
          background-color: var(--search-bg);
          border: 1px solid var(--topbar-border);
          border-radius: 0.5rem;
          padding: 0.5rem 0.85rem;
          gap: 0.5rem;
        }

        .topbar-search-input {
          border: none;
          background-color: transparent;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          color: var(--topbar-text);
        }

        /* Right Actions */
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Hover Effects for Light & Dark Mode */
        .topbar-action-btn,
        .topbar-mobile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--topbar-subtle);
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease, color 0.2s ease;
          position: relative;
        }

        .topbar-action-btn:hover,
        .topbar-mobile-menu-btn:hover {
          background-color: var(--topbar-hover-bg);
          color: var(--topbar-hover-text);
        }

        .topbar-badge-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 1.5px solid var(--topbar-bg);
          pointer-events: none;
        }

        .topbar-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #3b82f6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .topbar-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }

        /* Desktop Adjustments */
        @media (min-width: 768px) {
          .topbar-header {
            padding: 0 2rem;
          }

          .topbar-actions {
            gap: 1.25rem;
          }

          .topbar-brand,
          .topbar-mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Brand Logo Header (Mobile) */}
      <div className="topbar-brand">
        <div className="topbar-brand-logo">
          <Compass size={20} />
        </div>
        <span className="topbar-brand-title">EventPulse</span>
      </div>

      {/* Search Input */}
      <div className="topbar-search-wrapper">
        <div className="topbar-search-box">
          <Search
            size={18}
            color="var(--topbar-subtle)"
            style={{ flexShrink: 0, pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="topbar-search-input"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="topbar-actions">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={handleThemeToggle}
          className="topbar-action-btn"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun size={20} color="#f59e0b" style={{ pointerEvents: "none" }} />
          ) : (
            <Moon size={20} style={{ pointerEvents: "none" }} />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("customer-notifications")}
          className="topbar-action-btn"
          title="Notifications"
        >
          <Bell size={20} style={{ pointerEvents: "none" }} />
          <span className="topbar-badge-dot" />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate && onNavigate("customer-profile")}
          className="topbar-avatar"
        >
          {currentUser?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "GU"}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          type="button"
          className="topbar-mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
