import React from "react";
import { Store, DollarSign, Calendar, Star, Ticket, TrendingUp } from "lucide-react";

export default function VendorDashboard({ currentUser }) {
  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div style={{ backgroundColor: bgColor, color: color, padding: "1rem", borderRadius: "0.5rem" }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
        <h3 style={{ fontSize: "1.85rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>{value}</h3>
        <p style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: "500" }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>Vendor Hub</h1>
          <p style={{ color: "#64748b" }}>Good to see you, {currentUser?.name}. Here are your event stats.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", border: "none", borderRadius: "0.5rem", color: "white", fontWeight: "600", cursor: "pointer" }}>
          <Store size={16} />
          Create New Event
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <StatCard icon={DollarSign} title="Total Earnings" value="$12,450" subtitle="+15% this month" color="#10b981" bgColor="#ecfdf5" />
        <StatCard icon={Ticket} title="Tickets Sold" value="842" subtitle="Across 5 active events" color="#3b82f6" bgColor="#eff6ff" />
        <StatCard icon={Calendar} title="Active Events" value="5" subtitle="2 ending soon" color="#8b5cf6" bgColor="#f5f3ff" />
        <StatCard icon={Star} title="Average Rating" value="4.8/5" subtitle="Based on 120 reviews" color="#f59e0b" bgColor="#fffbeb" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Active Events Table */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>Your Active Events</h2>
            <button style={{ background: "none", border: "none", color: "#3b82f6", fontWeight: "600", cursor: "pointer" }}>View All</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "0.85rem", textAlign: "left" }}>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Event Name</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Date</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Tickets Sold</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Revenue</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Summer Music Fest", date: "Aug 15, 2025", sold: "450 / 500", rev: "$4,500", status: "Selling Fast", color: "#f59e0b", bg: "#fef3c7" },
                { name: "Tech Startup Mixer", date: "Sep 02, 2025", sold: "120 / 150", rev: "$2,400", status: "On Track", color: "#10b981", bg: "#d1fae5" },
                { name: "Food & Wine Expo", date: "Oct 10, 2025", sold: "20 / 200", rev: "$400", status: "Just Launched", color: "#3b82f6", bg: "#dbeafe" }
              ].map((item, i) => (
                <tr key={i} style={{ borderBottom: i !== 2 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "1rem 0", fontWeight: "600", color: "#0f172a", fontSize: "0.9rem" }}>{item.name}</td>
                  <td style={{ padding: "1rem 0", color: "#64748b", fontSize: "0.85rem" }}>{item.date}</td>
                  <td style={{ padding: "1rem 0", color: "#64748b", fontSize: "0.9rem" }}>{item.sold}</td>
                  <td style={{ padding: "1rem 0", fontWeight: "600", color: "#0f172a", fontSize: "0.9rem" }}>{item.rev}</td>
                  <td style={{ padding: "1rem 0" }}>
                    <span style={{ backgroundColor: item.bg, color: item.color, padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600" }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions & Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.5rem" }}>Quick Insights</h2>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div style={{ padding: "0.5rem", backgroundColor: "#eff6ff", color: "#3b82f6", borderRadius: "50%" }}><TrendingUp size={16} /></div>
              <div>
                <h4 style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.9rem" }}>Sales are up!</h4>
                <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>You've sold 20% more tickets this week compared to last week.</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: "#0f172a", color: "white", borderRadius: "0.75rem", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Need Help?</h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>Check out our vendor guides to learn how to maximize your ticket sales.</p>
            <button style={{ width: "100%", padding: "0.75rem", backgroundColor: "white", color: "#0f172a", border: "none", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
              View Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
