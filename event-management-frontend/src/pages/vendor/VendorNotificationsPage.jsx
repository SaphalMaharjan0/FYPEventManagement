import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, AlertTriangle, CheckCircle, Info, Inbox } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

const typeConfig = {
  SERVICE_REJECTED: { icon: AlertTriangle, color: "#dc2626", bg: "#fef2f2", label: "Service Rejected" },
  SERVICE_ACCEPTED: { icon: CheckCircle, color: "#16a34a", bg: "#f0fdf4", label: "Service Accepted" },
  NEW_REQUEST: { icon: Inbox, color: "#2563eb", bg: "#eff6ff", label: "New Request" },
  GENERAL: { icon: Info, color: "#6366f1", bg: "#eef2ff", label: "General" },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchWithAuth = useFetch();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/api/notifications");
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await fetchWithAuth(`/api/notifications/${id}/read`, { method: "PUT" });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetchWithAuth("/api/notifications/read-all", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>
            Notifications
          </h1>
          <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white", border: "none", borderRadius: "0.5rem",
              fontWeight: "600", fontSize: "0.85rem", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,130,246,0.3)"; }}
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Notifications List */}
      <div style={{
        backgroundColor: "var(--color-white)",
        borderRadius: "0.75rem",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-slate-400)" }}>
            <Bell size={40} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-slate-400)" }}>
            <Bell size={40} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p style={{ fontSize: "1rem", fontWeight: "500" }}>No notifications yet</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>You'll see notifications here when you receive new service requests or updates.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => {
            const cfg = typeConfig[notif.type] || typeConfig.GENERAL;
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "1rem",
                  padding: "1.25rem 1.5rem",
                  backgroundColor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.03)",
                  borderBottom: idx < notifications.length - 1 ? "1px solid #f1f5f9" : "none",
                  cursor: notif.isRead ? "default" : "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={e => { if (!notif.isRead) e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.06)"; }}
                onMouseLeave={e => { if (!notif.isRead) e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.03)"; }}
              >
                {/* Icon */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  backgroundColor: cfg.bg, color: cfg.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span style={{
                      fontSize: "0.9rem", fontWeight: notif.isRead ? "500" : "700",
                      color: "var(--color-slate-900)"
                    }}>
                      {notif.title}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-slate-400)", whiteSpace: "nowrap", marginLeft: "1rem" }}>
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.85rem",
                    color: notif.isRead ? "var(--color-slate-400)" : "var(--color-slate-600)",
                    margin: 0, lineHeight: "1.4"
                  }}>
                    {notif.message}
                  </p>
                  <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{
                      fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase",
                      padding: "0.15rem 0.5rem", borderRadius: "1rem",
                      backgroundColor: cfg.bg, color: cfg.color,
                      letterSpacing: "0.5px"
                    }}>
                      {cfg.label}
                    </span>
                    {!notif.isRead && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6" }}></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
