import React from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";

export default function Topbar({ currentUser, onNavigate, isDarkMode, toggleDarkMode }) {
  return (
    <header style={{
      height: "70px",
      backgroundColor: "var(--color-white)",
      borderBottom: "1px solid var(--color-slate-200)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 40
    }}>
      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--color-slate-100)",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          gap: "0.5rem"
        }}>
          <Search size={18} color="var(--color-slate-400)" />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              width: "100%",
              fontSize: "0.9rem",
              color: "var(--color-slate-900)"
            }}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button 
          onClick={toggleDarkMode}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--color-slate-500)" }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={() => onNavigate && onNavigate("customer-notifications")}
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
        >
          <Bell size={20} color="var(--color-slate-500)" />
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            backgroundColor: "var(--color-red-500)",
            borderRadius: "50%"
          }}></span>
        </button>

        <div 
          onClick={() => onNavigate && onNavigate("customer-profile")}
          style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "var(--color-blue-600)",
          color: "var(--color-white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "0.85rem",
          cursor: "pointer"
        }}>
          {currentUser?.name?.split(" ").map(n => n[0]).join("") || "U"}
        </div>
      </div>
    </header>
  );
}
