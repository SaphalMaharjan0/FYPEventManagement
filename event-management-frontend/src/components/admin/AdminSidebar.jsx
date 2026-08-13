import { 
  Home, 
  Users, 
  Calendar, 
  Store, 
  Ticket, 
  BarChart2, 
  Settings, 
  LogOut,
  Layers,
  Bell,
  Briefcase
} from "lucide-react";

export default function AdminSidebar({ currentPage, onNavigate, currentUser, onLogout, isOpen }) {
  const navItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: Home },
    ...(currentUser?.isSuperAdmin || currentUser?.superAdmin ? [
      { id: "admin-users", label: "Users", icon: Users }
    ] : []),
    { id: "admin-events", label: "Events", icon: Calendar },
    ...(currentUser?.isSuperAdmin || currentUser?.superAdmin ? [
      { id: "admin-vendors", label: "Vendors", icon: Store }
    ] : []),
    { id: "admin-bookings", label: "Bookings", icon: Ticket },
    { id: "admin-requests", label: "Service Requests", icon: Briefcase },
    { id: "admin-reports", label: "Reports & Analytics", icon: BarChart2 },
    { id: "admin-notifications", label: "Notifications", icon: Bell },
    { id: "admin-settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'mobile-open' : ''}`} style={{
      backgroundColor: "var(--bg-card)",
      color: "var(--text-subtle)",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--border-main)",
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderBottom: "1px solid var(--border-main)"
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          backgroundColor: "#3b82f6",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          <Layers size={20} />
        </div>
        <span style={{ color: "var(--text-main)", fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.5px" }}>EventPulse</span>
      </div>

      <div style={{ padding: "1.5rem 1rem 0.5rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-subtle)", marginLeft: "0.5rem" }}>
          Administration
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0 1rem" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id || (currentPage === 'admin-dashboard' && item.id === 'admin-dashboard');
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "white" : "var(--text-subtle)",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "600" : "500",
                    transition: "all 0.2s ease",
                    textAlign: "left"
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
                  <item.icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div style={{ padding: "1rem", borderTop: "1px solid var(--border-main)" }}>
        <div
          onClick={() => onNavigate("admin-profile")}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", marginBottom: "0.5rem", cursor: "pointer", borderRadius: "0.5rem", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-bg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}>
            {currentUser?.name?.substring(0, 2).toUpperCase() || "AM"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ color: "var(--text-main)", fontSize: "0.9rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.fullName || currentUser?.name || "Admin"}
            </div>
            <div style={{ color: "var(--text-subtle)", fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.email || "alex@example.com"}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            backgroundColor: "transparent",
            color: "var(--text-subtle)",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-main)";
            e.currentTarget.style.backgroundColor = "var(--hover-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-subtle)";
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
