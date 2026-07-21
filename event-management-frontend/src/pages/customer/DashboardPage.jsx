import React from "react";
import EventCard from "../../components/event/EventCard";
import {
  Ticket,
  Calendar,
  Heart,
  DollarSign,
  CheckCircle,
  Star,
} from "lucide-react";

export default function DashboardPage({
  currentUser,
  events = [],
  onBookClick,
  onNavigate,
  isDarkMode = false,
}) {
  const upcomingEvents = events.slice(0, 3);
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
          value="12"
          subtitle="+2 this month"
          iconBg="rgba(59, 130, 246, 0.12)"
          iconColor="var(--primary, #3b82f6)"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Events"
          value="3"
          subtitle="Next: Aug 15"
          iconBg="rgba(34, 197, 94, 0.12)"
          iconColor="#22c55e"
        />
        <StatCard
          icon={Heart}
          title="Favorites"
          value="8"
          subtitle="2 selling fast"
          iconBg="rgba(245, 158, 11, 0.12)"
          iconColor="#f59e0b"
        />
        <StatCard
          icon={DollarSign}
          title="Amount Spent"
          value="$847"
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {upcomingEvents.map((event, idx) => (
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
                  src={event.image}
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div
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
                  Booked TechConf 2025 · 2 tickets
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-subtle)",
                    marginTop: "0.2rem",
                    margin: "0.2rem 0 0 0",
                  }}
                >
                  2 hours ago
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "0.5rem",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Heart size={16} />
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
                  Added Global Music Festival to favorites
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-subtle)",
                    marginTop: "0.2rem",
                    margin: "0.2rem 0 0 0",
                  }}
                >
                  Yesterday
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "0.5rem",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Star size={16} />
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
                  Reviewed Startup Founders Summit
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-subtle)",
                    marginTop: "0.2rem",
                    margin: "0.2rem 0 0 0",
                  }}
                >
                  3 days ago
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "0.5rem",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "var(--primary, #3b82f6)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Ticket size={16} />
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
                  Booking confirmed for Food & Wine Expo
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-subtle)",
                    marginTop: "0.2rem",
                    margin: "0.2rem 0 0 0",
                  }}
                >
                  1 week ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              onBook={() => onBookClick(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
