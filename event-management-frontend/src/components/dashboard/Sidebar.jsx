import React from "react";
import { 
  Home, 
  Compass, 
  Ticket, 
  History, 
  Heart, 
  Settings, 
  LogOut,
  User,
  ChevronRight
} from "lucide-react";

export default function Sidebar({ currentPage, onNavigate, currentUser, onLogout }) {
  const navItems = [
    { id: "customer-dashboard", label: "Dashboard", icon: Home },
    { id: "customer-events", label: "Browse Events", icon: Compass },
    { id: "customer-bookings", label: "My Bookings", icon: Ticket },
    { id: "customer-history", label: "Booking History", icon: History },
    { id: "customer-favorites", label: "Favorites", icon: Heart },
    { id: "customer-settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside style={{
      width: "260px",
      backgroundColor: "#0f172a", // Dark blue from the screenshot
      color: "white",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <div style={{
          backgroundColor: "#3b82f6",
          borderRadius: "0.25rem",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Compass size={16} color="white" />
        </div>
        <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>EventPulse</span>
      </div>

      <div style={{ padding: "0 1.5rem", fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
        Customer
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 1rem", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id || 
            (item.id === "customer-dashboard" && currentPage === "customer-profile");
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                backgroundColor: isActive ? "#3b82f6" : "transparent",
                color: isActive ? "white" : "#94a3b8",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#94a3b8";
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div style={{ padding: "1rem", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div 
          onClick={() => onNavigate("customer-profile")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.5rem"
          }}
        >
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
            fontSize: "0.8rem"
          }}>
            {currentUser?.name?.split(" ").map(n => n[0]).join("") || "U"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "white", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {currentUser?.name || "User"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {currentUser?.email || "user@example.com"}
            </div>
          </div>
          <ChevronRight size={16} color="#64748b" />
        </div>
        
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.5rem",
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.85rem"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "white"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
