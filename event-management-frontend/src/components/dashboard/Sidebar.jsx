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
  X,
} from "lucide-react";

export default function Sidebar({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  isOpen,
  onClose,
  isDarkMode = false,
}) {
  const navItems = [
    { id: "customer-dashboard", label: "Dashboard", icon: Home },
    { id: "customer-events", label: "Browse Events", icon: Compass },
    { id: "customer-bookings", label: "My Bookings", icon: Ticket },
    { id: "customer-history", label: "Booking History", icon: History },
    { id: "customer-favorites", label: "Favorites", icon: Heart },
    { id: "customer-settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    if (onNavigate) onNavigate(id);
    if (onClose) onClose();
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    if (onClose) onClose();
  };

  return (
    <aside
      className={`sidebar-aside ${isOpen ? "mobile-open" : ""} ${isDarkMode ? "dark-theme" : "light-theme"}`}
    >
      <style>{`
        /* Dynamic Theme Variables for Sidebar */
        .sidebar-aside.light-theme {
          --sb-bg: var(--bg-card, #ffffff);
          --sb-border: var(--border-main, #e2e8f0);
          --sb-text: var(--text-main, #0f172a);
          --sb-text-subtle: var(--text-subtle, #64748b);
          --sb-hover-bg: var(--hover-bg, rgba(0, 0, 0, 0.05));
          --sb-hover-text: #0f172a;
          --sb-nav-color: #475569;
        }

        .sidebar-aside.dark-theme {
          --sb-bg: var(--bg-card, #111827);
          --sb-border: var(--border-main, rgba(255, 255, 255, 0.05));
          --sb-text: var(--text-main, #ffffff);
          --sb-text-subtle: var(--text-subtle, #94a3b8);
          --sb-hover-bg: var(--hover-bg, rgba(255, 255, 255, 0.08));
          --sb-hover-text: #ffffff;
          --sb-nav-color: #cbd5e1;
        }

        .sidebar-aside {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          height: 100vh;
          background-color: var(--sb-bg);
          color: var(--sb-text-subtle);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out, background-color 0.2s ease;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          user-select: none;
        }

        .sidebar-aside.mobile-open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .sidebar-aside {
            position: sticky;
            top: 0;
            left: auto;
            bottom: auto;
            width: 260px;
            height: 100vh;
            transform: none !important;
            box-shadow: none;
            flex-shrink: 0;
            z-index: 10;
            border-right: 1px solid var(--sb-border);
          }

          .sidebar-close-btn {
            display: none !important;
          }
        }

        .sidebar-header {
          height: 70px;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--sb-border);
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .sidebar-brand-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar-brand-logo {
          background-color: #3b82f6;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .sidebar-brand-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--sb-text);
        }

        .sidebar-close-btn {
          background: none;
          border: none;
          color: var(--sb-text-subtle);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .sidebar-close-btn:hover {
          color: var(--sb-hover-text);
          background-color: var(--sb-hover-bg);
        }

        .sidebar-section-label {
          padding: 1.25rem 1rem 0.5rem;
        }

        .sidebar-section-text {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          margin-left: 0.5rem;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 0 1rem;
        }

        .sidebar-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background-color: transparent;
          color: var(--sb-nav-color);
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 500;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .sidebar-nav-btn:hover {
          color: var(--sb-hover-text);
          background-color: var(--sb-hover-bg);
        }

        .sidebar-nav-btn.active {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--sb-border);
          margin-top: auto;
        }

        .sidebar-user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease;
        }

        .sidebar-user-card:hover {
          background-color: var(--sb-hover-bg);
        }

        .sidebar-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #3b82f6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          flex: 1;
          overflow: hidden;
        }

        .sidebar-user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--sb-text);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .sidebar-user-email {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .sidebar-chevron {
          color: #64748b;
          flex-shrink: 0;
        }

        .sidebar-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: transparent;
          border: none;
          color: var(--sb-text-subtle);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .sidebar-logout-btn:hover {
          color: var(--sb-hover-text);
          background-color: var(--sb-hover-bg);
        }
      `}</style>

      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand-logo">
            <Compass size={20} />
          </div>
          <span className="sidebar-brand-title">EventPulse</span>
        </div>

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-section-label">
        <span className="sidebar-section-text">Customer</span>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
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
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-nav-btn ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Profile & Sign out */}
      <div className="sidebar-footer">
        <div
          onClick={() => handleNavClick("customer-profile")}
          className="sidebar-user-card"
        >
          <div className="sidebar-user-avatar">
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
                : "GU"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {currentUser?.fullName || currentUser?.name || "Google User"}
            </div>
            <div className="sidebar-user-email">
              {currentUser?.email || "google.user@gmail.com"}
            </div>
          </div>
          <ChevronRight size={16} className="sidebar-chevron" />
        </div>

        <button
          type="button"
          onClick={handleLogoutClick}
          className="sidebar-logout-btn"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
