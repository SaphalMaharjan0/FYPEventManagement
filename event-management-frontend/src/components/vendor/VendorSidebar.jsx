import React from "react";
import { 
  Home, 
  Package, 
  Plus, 
  Inbox, 
  Calendar, 
  Settings, 
  LogOut,
  Hexagon,
  ChevronRight,
  Bell
} from "lucide-react";

export default function VendorSidebar({ currentPage, onNavigate, currentUser, onLogout, isOpen }) {
  const menuItems = [
    { id: "vendor-dashboard", label: "Dashboard", icon: Home },
    { id: "vendor-services", label: "Service Listings", icon: Package },
    { id: "vendor-add-service", label: "Add Service", icon: Plus },
    { id: "vendor-events", label: "Browse Events", icon: Calendar },
    { id: "vendor-requests", label: "Requests", icon: Inbox },
    { id: "vendor-availability", label: "Availability", icon: Calendar },
    { id: "vendor-notifications", label: "Notifications", icon: Bell },
    { id: "vendor-settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'mobile-open' : ''}`} style={{
      backgroundColor: "var(--bg-card)",
      color: "var(--text-subtle)",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--border-main)",
    }}>
      {/* Brand */}
      <div style={{
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        cursor: "pointer"
      }} onClick={() => onNavigate("landing")}>
        <div style={{ 
          backgroundColor: "var(--color-blue-500)", 
          padding: "0.5rem", 
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Hexagon size={20} color="var(--color-white)" fill="var(--color-white)" />
        </div>
        <span style={{ color: "var(--text-main)", fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.5px" }}>EventPulse</span>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0" }}>
        <div style={{ padding: "0 1.5rem", marginBottom: "1rem", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-subtle)", letterSpacing: "1px", textTransform: "uppercase" }}>
          VENDOR
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "calc(100% - 1.5rem)",
                  marginLeft: "0.75rem",
                  marginRight: "0.75rem",
                  padding: "0.85rem 1rem",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "var(--text-subtle)",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "0.95rem",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                    e.currentTarget.style.color = "var(--text-main)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-subtle)";
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div style={{ 
        padding: "1.5rem", 
        borderTop: "1px solid var(--border-main)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div 
          onClick={() => onNavigate("vendor-profile")}
          style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
        >
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "50%", 
            backgroundColor: "var(--color-blue-500)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}>
            {currentUser?.fullName ? currentUser.fullName.split(' ').map(n => n[0]).join('') : 'MC'}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ color: "var(--text-main)", fontWeight: "600", fontSize: "0.9rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {currentUser?.fullName || "Marcus Chen"}
            </div>
            <div style={{ color: "var(--text-subtle)", fontSize: "0.75rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {currentUser?.email || "alex@example.com"}
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-subtle)" />
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            background: "none", 
            border: "none", 
            color: "var(--text-subtle)", 
            cursor: "pointer",
            padding: "0.5rem 0",
            fontSize: "0.9rem",
            fontWeight: "500",
            width: "100%",
            textAlign: "left"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-main)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-subtle)"}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
