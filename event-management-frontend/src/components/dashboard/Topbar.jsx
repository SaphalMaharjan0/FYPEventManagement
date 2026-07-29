import React from "react";
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";

export default function Topbar({
  currentUser,
  onNavigate,
  isDarkMode = false,
  toggleDarkMode,
  onMenuClick,
}) {
  const handleThemeToggle = (e) => {
    e.stopPropagation();
    console.log("Theme button clicked! Current isDarkMode:", isDarkMode);
    if (typeof toggleDarkMode === "function") {
      toggleDarkMode();
    } else {
      console.error("toggleDarkMode prop was not passed into Topbar!");
    }
  };

  return (
    <header
      style={{
        height: "70px",
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "var(--transition-fast)",
      }}
    >
      {/* Hamburger Menu (Mobile Only) */}
      <button 
        className="mobile-only"
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-main)',
          marginRight: '1rem',
          cursor: 'pointer'
        }}
      >
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--bg-body-alt)",
            border: "1px solid var(--border-main)",
            borderRadius: "var(--radius-sm, 0.5rem)",
            padding: "0.5rem 0.85rem",
            gap: "0.5rem",
          }}
        >
          <Search
            size={18}
            color="var(--text-subtle)"
            style={{ flexShrink: 0, pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              width: "100%",
              fontSize: "0.9rem",
              color: "var(--text-main)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={handleThemeToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-subtle)",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm, 0.375rem)",
            transition: "var(--transition-fast)",
            position: "relative",
            zIndex: 110,
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun size={20} color="#f59e0b" style={{ pointerEvents: "none" }} />
          ) : (
            <Moon size={20} style={{ pointerEvents: "none" }} />
          )}
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("customer-notifications")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-subtle)",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm, 0.375rem)",
          }}
          title="Notifications"
        >
          <Bell
            size={20}
            color="var(--text-subtle)"
            style={{ pointerEvents: "none" }}
          />
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              border: "1.5px solid var(--bg-card)",
              pointerEvents: "none",
            }}
          />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate && onNavigate("customer-profile")}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "var(--primary, #3b82f6)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {currentUser?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
