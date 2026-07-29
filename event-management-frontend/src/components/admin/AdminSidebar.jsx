import { 
  Home, 
  Users, 
  Calendar, 
  Store, 
  Ticket, 
  BarChart2, 
  Settings, 
  LogOut,
  Layers
} from "lucide-react";

export default function AdminSidebar({ currentPage, onNavigate, currentUser, onLogout }) {
  const navItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: Home },
    ...(currentUser?.isSuperAdmin ? [
      { id: "admin-users", label: "Users", icon: Users }
    ] : []),
    { id: "admin-events", label: "Events", icon: Calendar },
    ...(currentUser?.isSuperAdmin ? [
      { id: "admin-vendors", label: "Vendors", icon: Store }
    ] : []),
    { id: "admin-bookings", label: "Bookings", icon: Ticket },
    { id: "admin-reports", label: "Reports & Analytics", icon: BarChart2 },
    { id: "admin-settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside style={{
      width: "260px",
      backgroundColor: "#111827", // dark slate
      color: "#94a3b8",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 40,
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
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
        <span style={{ color: "white", fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.5px" }}>EventPulse</span>
      </div>

      <div style={{ padding: "1.5rem 1rem 0.5rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginLeft: "0.5rem" }}>
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
                    backgroundColor: isActive ? "#3b82f6" : "transparent",
                    color: isActive ? "white" : "#cbd5e1",
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
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#cbd5e1";
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
      <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          onClick={() => onNavigate("admin-profile")}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", marginBottom: "0.5rem", cursor: "pointer", borderRadius: "0.5rem", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; }}
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
            <div style={{ color: "white", fontSize: "0.9rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.fullName || currentUser?.name || "Admin"}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
            color: "#94a3b8",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.2s ease"
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
