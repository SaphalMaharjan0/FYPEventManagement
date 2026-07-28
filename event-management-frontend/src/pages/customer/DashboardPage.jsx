import React, { useState, useEffect } from "react";
import EventCard from "../../components/event/EventCard";
import { Ticket, Calendar, DollarSign, CheckCircle, Heart } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../utils/formatting";
import { useSettings } from "../../contexts/SettingsContext";

export default function DashboardPage({
  currentUser,
  events = [],
  onBookClick,
  onNavigate,
  isDarkMode = false,
}) {
  const fetchWithAuth = useFetch();
  const { currency } = useSettings();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth('/api/customer/dashboard-stats');
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [fetchWithAuth]);

  // Fallback recommended events (filtered from global events)
  const recommendedEvents = events.filter((e) => !e.featured).slice(0, 3);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    iconBg,
    iconColor,
  }) => (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "var(--radius-md, 0.75rem)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
        border: "1px solid var(--border-main)",
        transition: "var(--transition-fast)",
      }}
    >
      <div
        style={{
          backgroundColor: iconBg,
          color: iconColor,
          padding: "0.75rem",
          borderRadius: "var(--radius-sm, 0.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--text-subtle)",
            fontWeight: "600",
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "1.65rem",
            fontWeight: "bold",
            color: "var(--text-main)",
            marginBottom: "0.25rem",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ color: "var(--text-main)", fontFamily: "var(--font-body)" }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "var(--text-main)",
            margin: 0,
            fontFamily: "var(--font-heading)",
          }}
        >
          Good morning, {currentUser?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p
          style={{
            color: "var(--text-subtle)",
            marginTop: "0.25rem",
            margin: "0.25rem 0 0 0",
          }}
        >
          Here's what's happening with your events.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-subtle)" }}>
          Loading dashboard...
        </div>
      ) : error ? (
        <div style={{ color: "red", padding: "2rem 0" }}>{error}</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <StatCard
              icon={Ticket}
              title="Total Bookings"
              value={stats.totalBookings || 0}
              subtitle="All time"
              iconBg="rgba(59, 130, 246, 0.12)"
              iconColor="var(--primary, #3b82f6)"
            />
            <StatCard
              icon={Calendar}
              title="Upcoming Events"
              value={stats.upcomingEventsCount || 0}
              subtitle="Booked events"
              iconBg="rgba(34, 197, 94, 0.12)"
              iconColor="#22c55e"
            />
            <StatCard
              icon={Heart}
              title="Favorites"
              value={stats.favoritesCount || 0}
              subtitle="Saved events"
              iconBg="rgba(239, 68, 68, 0.12)"
              iconColor="#ef4444"
            />
            <StatCard
              icon={DollarSign}
              title="Amount Spent"
              value={formatPrice(stats.amountSpent || 0, currency)}
              subtitle="Lifetime total"
              iconBg="rgba(168, 85, 247, 0.12)"
              iconColor="#a855f7"
            />
          </div>

          {/* Main Content Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {/* Upcoming Events List */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "var(--radius-md, 0.75rem)",
                padding: "1.5rem",
                border: "1px solid var(--border-main)",
                boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "var(--text-main)",
                  marginBottom: "1.25rem",
                  marginTop: 0,
                }}
              >
                Upcoming Events
              </h2>
              {stats.upcomingEvents && stats.upcomingEvents.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {stats.upcomingEvents.map((event, idx) => (
                    <div
                      key={event.id || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.85rem",
                        backgroundColor: "var(--bg-body-alt)",
                        borderRadius: "var(--radius-sm, 0.5rem)",
                        border: "1px solid var(--border-main)",
                      }}
                    >
                      <img
                        src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                        alt={event.title}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "0.5rem",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontWeight: "600",
                            color: "var(--text-main)",
                            fontSize: "0.95rem",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {event.title}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-subtle)",
                            marginTop: "0.25rem",
                            margin: "0.25rem 0 0 0",
                          }}
                        >
                          {event.date} · {event.venue?.split(",")[0]}
                        </p>
                      </div>
                      <div
                        style={{
                          backgroundColor: isDarkMode
                            ? "rgba(34, 197, 94, 0.2)"
                            : "#dcfce7",
                          color: isDarkMode ? "#4ade80" : "#166534",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        Confirmed
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text-subtle)", fontSize: "0.9rem" }}>
                  No upcoming events. Find something to do!
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "var(--radius-md, 0.75rem)",
                padding: "1.5rem",
                border: "1px solid var(--border-main)",
                boxShadow: "var(--shadow-md, 0 1px 3px rgba(0,0,0,0.05))",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "var(--text-main)",
                  marginBottom: "1.25rem",
                  marginTop: 0,
                }}
              >
                Recent Activity
              </h2>
              
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {stats.recentActivity.map((activity, idx) => (
                    <div
                      key={activity.id || idx}
                      style={{
                        display: "flex",
                        gap: "0.85rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "rgba(34, 197, 94, 0.15)",
                          color: "#22c55e",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-main)",
                            fontWeight: "500",
                            margin: 0,
                          }}
                        >
                          {activity.description}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-subtle)",
                            marginTop: "0.2rem",
                            margin: "0.2rem 0 0 0",
                          }}
                        >
                          {activity.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text-subtle)", fontSize: "0.9rem" }}>
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Recommended Events Section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text-main)",
              margin: 0,
            }}
          >
            Recommended Events
          </h2>
          <button
            onClick={() => onNavigate("events")}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary, #3b82f6)",
              fontWeight: "600",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            View all
          </button>
        </div>
        <div className="cards-grid">
          {recommendedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookClick={() => onBookClick(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
