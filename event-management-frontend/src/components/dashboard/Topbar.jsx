import React from "react";
import { Search, Bell } from "lucide-react";

export default function Topbar({ currentUser }) {
  return (
    <header style={{
      height: "70px",
      backgroundColor: "white",
      borderBottom: "1px solid #e2e8f0",
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
          backgroundColor: "#f1f5f9",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          gap: "0.5rem"
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              width: "100%",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
          <Bell size={20} color="#64748b" />
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            backgroundColor: "#ef4444",
            borderRadius: "50%"
          }}></span>
        </button>

        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "white",
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
