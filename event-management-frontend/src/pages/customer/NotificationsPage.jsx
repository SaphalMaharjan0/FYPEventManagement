import React, { useState, useEffect } from "react";
import { Bell, Check, Clock, Ticket, AlertCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const fetchWithAuth = useFetch();

  const fetchNotifications = async () => {
    try {
      const data = await fetchWithAuth("/api/notifications");
      if (data) setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(intervalId);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetchWithAuth(`/api/notifications/${id}/read`, { method: "PUT" });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchWithAuth("/api/notifications/read-all", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Notifications</h1>
          <p style={{ color: "var(--color-slate-500)" }}>You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              padding: "0.5rem 1rem", 
              backgroundColor: "var(--color-white)", 
              color: "var(--color-blue-500)", 
              border: "1px solid #bfdbfe", 
              borderRadius: "0.5rem", 
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "var(--color-white)", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
            <Bell size={48} color="var(--color-slate-300)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-slate-900)", marginBottom: "0.5rem", fontWeight: "600" }}>All caught up!</h3>
            <p style={{ color: "var(--color-slate-500)" }}>You don't have any new notifications right now.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            let Icon = Bell;
            let color = "var(--color-slate-500)";
            if (notification.type === "booking") {
              Icon = Ticket;
              color = "var(--color-blue-500)";
            } else if (notification.type === "alert") {
              Icon = AlertCircle;
              color = "var(--color-amber-500)";
            } else if (notification.type === "system") {
              Icon = Bell;
              color = "var(--color-green-500)";
            }

            const timeAgo = (dateStr) => {
              if (!dateStr) return "";
              const date = new Date(dateStr);
              const now = new Date();
              const diffMs = now - date;
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              if (diffMins < 60) return `${diffMins} mins ago`;
              if (diffHours < 24) return `${diffHours} hours ago`;
              return `${diffDays} days ago`;
            };

            return (
              <div 
                key={notification.id}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: notification.isRead ? "var(--color-white)" : "#f0f9ff",
                  borderRadius: "1rem",
                  border: `1px solid ${notification.isRead ? "var(--color-slate-200)" : "#bae6fd"}`,
                  cursor: notification.isRead ? "default" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  backgroundColor: `${color}15`, 
                  color: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-slate-900)" }}>
                      {notification.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-slate-400)", fontSize: "0.8rem" }}>
                      <Clock size={14} />
                      {timeAgo(notification.createdAt)}
                    </div>
                  </div>
                  <p style={{ color: "var(--color-slate-600)", lineHeight: "1.5", fontSize: "0.95rem" }}>
                    {notification.message}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-blue-500)", alignSelf: "center" }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
