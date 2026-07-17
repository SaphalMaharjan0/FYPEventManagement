import React, { useState } from "react";
import { Bell, Check, Clock, Ticket, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Your booking for 'Neon Nights Music Festival' has been confirmed. You have 2 General Admission tickets.",
      time: "2 hours ago",
      isRead: false,
      icon: Ticket,
      color: "#3b82f6" // blue
    },
    {
      id: 2,
      type: "alert",
      title: "Event Update",
      message: "The venue for 'Tech Innovators Summit 2026' has been changed to the Grand Convention Center.",
      time: "1 day ago",
      isRead: false,
      icon: AlertCircle,
      color: "#f59e0b" // amber
    },
    {
      id: 3,
      type: "system",
      title: "Welcome to EventPulse",
      message: "Thanks for joining! Complete your profile to get personalized event recommendations.",
      time: "3 days ago",
      isRead: true,
      icon: Bell,
      color: "#10b981" // green
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>Notifications</h1>
          <p style={{ color: "#64748b" }}>You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              padding: "0.5rem 1rem", 
              backgroundColor: "white", 
              color: "#3b82f6", 
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
          <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "white", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
            <Bell size={48} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#0f172a", marginBottom: "0.5rem", fontWeight: "600" }}>All caught up!</h3>
            <p style={{ color: "#64748b" }}>You don't have any new notifications right now.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: notification.isRead ? "white" : "#f0f9ff",
                  borderRadius: "1rem",
                  border: `1px solid ${notification.isRead ? "#e2e8f0" : "#bae6fd"}`,
                  cursor: notification.isRead ? "default" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%", 
                  backgroundColor: `${notification.color}15`, 
                  color: notification.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#0f172a" }}>
                      {notification.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#94a3b8", fontSize: "0.8rem" }}>
                      <Clock size={14} />
                      {notification.time}
                    </div>
                  </div>
                  <p style={{ color: "#475569", lineHeight: "1.5", fontSize: "0.95rem" }}>
                    {notification.message}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3b82f6", alignSelf: "center" }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
