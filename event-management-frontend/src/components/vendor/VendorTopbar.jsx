import React, { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function VendorTopbar({ currentUser, onNavigate, isDarkMode, toggleDarkMode }) {
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
      <div style={{ position: "relative", width: "300px" }}>
        <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-slate-400)" }}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search..." 
          style={{
            width: "100%",
            padding: "0.6rem 1rem 0.6rem 2.75rem",
            backgroundColor: "var(--color-slate-100)",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "0.95rem",
            outline: "none",
            color: "var(--color-slate-900)"
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <button 
          onClick={toggleDarkMode}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--color-slate-500)" }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={() => onNavigate && onNavigate("vendor-notifications")}
          style={{ background: "none", border: "none", color: "var(--color-slate-500)", cursor: "pointer", position: "relative" }}
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
              border: "2px solid white"
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        <div 
          onClick={() => onNavigate && onNavigate("vendor-profile")}
          style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "50%", 
            backgroundColor: "var(--color-blue-500)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.9rem",
            color: "var(--color-white)",
            cursor: "pointer"
          }}
        >
          {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'MC'}
        </div>
      </div>
    </header>
  );
}
