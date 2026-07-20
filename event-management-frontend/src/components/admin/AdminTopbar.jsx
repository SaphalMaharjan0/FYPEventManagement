import React from "react";
import { Search, Bell } from "lucide-react";

export default function AdminTopbar({ currentUser }) {
  return (
    <header style={{
      height: "70px",
      backgroundColor: "var(--color-white)",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      {/* Search Input */}
      <div style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--color-slate-50)",
        borderRadius: "0.5rem",
        padding: "0.5rem 1rem",
        width: "350px",
        border: "1px solid #e2e8f0"
      }}>
        <Search size={18} color="var(--color-slate-400)" />
        <input 
          type="text" 
          placeholder="Search..." 
          style={{
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            marginLeft: "0.5rem",
            width: "100%",
            fontSize: "0.9rem",
            color: "var(--color-slate-900)"
          }}
        />
      </div>

      {/* Notifications and Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          color: "var(--color-slate-600)"
        }}>
          <Bell size={20} />
          {/* Notification Dot */}
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            backgroundColor: "var(--color-red-500)",
            borderRadius: "50%",
            border: "2px solid var(--color-white)"
          }}></span>
        </button>
        
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "0.85rem",
          cursor: "pointer"
        }}>
          {currentUser?.name?.substring(0, 2).toUpperCase() || "AM"}
        </div>
      </div>
    </header>
  );
}
