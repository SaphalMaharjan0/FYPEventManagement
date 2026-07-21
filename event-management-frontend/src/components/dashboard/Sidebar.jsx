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
        backgroundColor: "var(--bg-card)",
        borderRight: "1px solid var(--border-main)",
        color: "var(--text-main)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        transition: "var(--transition-fast)",
      }}
    >
      {/* Brand Logo Header */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--primary)",
            borderRadius: "var(--radius-sm, 0.375rem)",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Compass size={18} color="#ffffff" />
        </div>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            fontFamily: "var(--font-heading)",
            color: "var(--text-main)",
          }}
        >
          EventPulse
        </span>
      </div>

      <div
        style={{
          padding: "0 1.5rem",
          fontSize: "0.75rem",
          color: "var(--text-subtle)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "0.75rem",
          fontWeight: "600",
        }}
      >
        Customer
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 0.85rem",
          gap: "0.25rem",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            currentPage === item.id ||
            (item.id === "customer-dashboard" &&
              currentPage === "customer-profile");
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate && onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm, 0.5rem)",
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-subtle)",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
                fontWeight: isActive ? "600" : "500",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-main)";
                  e.currentTarget.style.backgroundColor = "var(--bg-body-alt)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-subtle)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid var(--border-main)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          onClick={() => onNavigate && onNavigate("customer-profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm, 0.5rem)",
            transition: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-body-alt)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.8rem",
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
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-main)",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {currentUser?.fullName || currentUser?.name || "User"}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-subtle)",
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
            color="var(--text-subtle)"
            style={{ flexShrink: 0 }}
          />
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.5rem",
            background: "none",
            border: "none",
            color: "var(--text-subtle)",
            cursor: "pointer",
            fontSize: "0.85rem",
            borderRadius: "var(--radius-sm, 0.375rem)",
            transition: "var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-subtle)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
