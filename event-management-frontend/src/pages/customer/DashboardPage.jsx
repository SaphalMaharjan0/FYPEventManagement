import React from "react";
import EventCard from "../../components/event/EventCard";
import { Ticket, Calendar, Heart, DollarSign, CheckCircle, Star } from "lucide-react";

export default function DashboardPage({ currentUser, events, onBookClick, onNavigate }) {
  const upcomingEvents = events.slice(0, 3);
  const recommendedEvents = events.filter(e => !e.featured).slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, subtitle, iconBg, iconColor }) => (
    <div style={{
      backgroundColor: "var(--color-white)",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      display: "flex",
      alignItems: "flex-start",
      gap: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{
        backgroundColor: iconBg,
        color: iconColor,
        padding: "0.75rem",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: "0.85rem", color: "var(--color-slate-500)", fontWeight: "600", marginBottom: "0.25rem" }}>{title}</div>
        <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-slate-400)" }}>{subtitle}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Good morning, {currentUser?.name?.split(" ")[0] || "User"} 👋</h1>
        <p style={{ color: "var(--color-slate-500)", marginTop: "0.25rem" }}>Here's what's happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <StatCard icon={Ticket} title="Total Bookings" value="12" subtitle="+2 this month" iconBg="var(--color-blue-50)" iconColor="var(--color-blue-500)" />
        <StatCard icon={Calendar} title="Upcoming Events" value="3" subtitle="Next: Aug 15" iconBg="var(--color-green-50)" iconColor="#22c55e" />
        <StatCard icon={Heart} title="Favorites" value="8" subtitle="2 selling fast" iconBg="var(--color-amber-50)" iconColor="var(--color-amber-500)" />
        <StatCard icon={DollarSign} title="Amount Spent" value="$847" subtitle="Lifetime total" iconBg="#faf5ff" iconColor="#a855f7" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        {/* Upcoming Events List */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Upcoming Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {upcomingEvents.map((event, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem" }}>
                <img src={event.image} alt={event.title} style={{ width: "60px", height: "60px", borderRadius: "0.5rem", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: "600", color: "var(--color-slate-900)", fontSize: "0.95rem" }}>{event.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-slate-500)", marginTop: "0.25rem" }}>{event.date} · {event.venue.split(",")[0]}</p>
                </div>
                <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>
                  Confirmed
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ padding: "0.5rem", backgroundColor: "var(--color-green-50)", color: "#22c55e", borderRadius: "50%" }}>
                <CheckCircle size={16} />
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "500" }}>Booked TechConf 2025 · 2 tickets</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", marginTop: "0.25rem" }}>2 hours ago</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ padding: "0.5rem", backgroundColor: "var(--color-red-50)", color: "var(--color-red-500)", borderRadius: "50%" }}>
                <Heart size={16} />
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "500" }}>Added Global Music Festival to favorites</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", marginTop: "0.25rem" }}>Yesterday</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ padding: "0.5rem", backgroundColor: "var(--color-amber-50)", color: "var(--color-amber-500)", borderRadius: "50%" }}>
                <Star size={16} />
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "500" }}>Reviewed Startup Founders Summit</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", marginTop: "0.25rem" }}>3 days ago</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ padding: "0.5rem", backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-500)", borderRadius: "50%" }}>
                <Ticket size={16} />
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "500" }}>Booking confirmed for Food & Wine Expo</p>
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-500)", marginTop: "0.25rem" }}>1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Events */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Recommended Events</h2>
          <button 
            onClick={() => onNavigate("events")}
            style={{ background: "none", border: "none", color: "var(--color-blue-600)", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer" }}
          >
            View all
          </button>
        </div>
        <div className="cards-grid">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} onBook={() => onBookClick(event)} />
          ))}
        </div>
      </div>
    </div>
  );
}
