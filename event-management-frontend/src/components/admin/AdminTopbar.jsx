import React, { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function AdminTopbar({ currentUser, onNavigate, onMenuClick }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchWithAuth = useFetch();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await fetchWithAuth("/api/notifications/unread-count");
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    fetchUnread();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchWithAuth]);

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
      {/* Hamburger Menu (Mobile Only) */}
      <button 
        className="mobile-only"
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-slate-900)',
          marginRight: '1rem',
          cursor: 'pointer'
        }}
      >
        <Menu size={24} />
      </button>

      {/* Search Input */}
      <div style={{ flex: 1, maxWidth: "350px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--color-slate-50)",
          borderRadius: "0.5rem",
          padding: "0.5rem 1rem",
          width: "100%",
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
      </div>

      {/* Notifications and Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button 
          onClick={() => onNavigate && onNavigate("admin-notifications")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
            color: "var(--color-slate-600)"
          }}
        >
          <Bell size={20} />
          {/* Notification Dot */}
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              minWidth: "16px",
              height: "16px",
              padding: "0 4px",
              backgroundColor: "var(--color-red-500)",
              color: "white",
              fontSize: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              border: "2px solid var(--color-white)"
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
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
