import React from "react";
import {
  Home,
  Compass,
  Ticket,
  History,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) {
  const navItems = [
    { id: "customer-dashboard", label: "Dashboard", icon: Home },
    { id: "customer-events", label: "Browse Events", icon: Compass },
    { id: "customer-bookings", label: "My Bookings", icon: Ticket },
    { id: "customer-history", label: "Booking History", icon: History },
    { id: "customer-favorites", label: "Favorites", icon: Heart },
    { id: "customer-settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      style={{
        width: "260px",
        backgroundColor: "#111827", // dark slate
        color: "#94a3b8",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        transition: "var(--transition-fast)",
      }}
    >
      {/* Brand Logo Header */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}
        >
          <Compass size={20} />
        </div>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            letterSpacing: "-0.5px",
            color: "white",
          }}
        >
          EventPulse
        </span>
      </div>

      <div
        style={{
          padding: "1.5rem 1rem 0.5rem",
        }}
      >
        <span style={{ 
          fontSize: "0.7rem", 
          fontWeight: "600", 
          textTransform: "uppercase", 
          letterSpacing: "1px", 
          color: "#64748b", 
          marginLeft: "0.5rem" 
        }}>
          Customer
        </span>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "0 1rem",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === "customer-dashboard" &&
                currentPage === "customer-profile");
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: isActive ? "#3b82f6" : "transparent",
                    color: isActive ? "white" : "#cbd5e1",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "600" : "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#cbd5e1";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          onClick={() => onNavigate && onNavigate("customer-profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
            padding: "0.75rem",
            marginBottom: "0.5rem",
            borderRadius: "0.5rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.9rem",
              flexShrink: 0,
            }}
          >
            {currentUser?.fullName
              ? currentUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : currentUser?.name
                ? currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "white",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {currentUser?.fullName || currentUser?.name || "User"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {currentUser?.email || "user@example.com"}
            </div>
          </div>
          <ChevronRight
            size={16}
            color="#64748b"
            style={{ flexShrink: 0 }}
          />
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            borderRadius: "0.5rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
