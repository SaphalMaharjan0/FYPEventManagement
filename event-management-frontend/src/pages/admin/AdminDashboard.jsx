import React from "react";
import { Users, Calendar, DollarSign, Activity, Settings, AlertCircle } from "lucide-react";

export default function AdminDashboard({ currentUser }) {
  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div style={{ backgroundColor: bgColor, color: color, padding: "1rem", borderRadius: "0.5rem" }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
        <h3 style={{ fontSize: "1.85rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{value}</h3>
        <p style={{ color: "var(--color-green-500)", fontSize: "0.75rem", fontWeight: "500" }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Admin Overview</h1>
          <p style={{ color: "var(--color-slate-500)" }}>Welcome back, {currentUser?.name}. Here's what's happening today.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: "var(--color-slate-900)", fontWeight: "500", cursor: "pointer" }}>
          <Settings size={16} />
          System Settings
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <StatCard icon={Users} title="Total Users" value="12,450" subtitle="+150 this week" color="var(--color-blue-500)" bgColor="var(--color-blue-50)" />
        <StatCard icon={Calendar} title="Active Events" value="342" subtitle="+12 new today" color="var(--color-purple-500)" bgColor="#f5f3ff" />
        <StatCard icon={DollarSign} title="Total Revenue" value="$45,231" subtitle="+12% from last month" color="var(--color-green-500)" bgColor="#ecfdf5" />
        <StatCard icon={Activity} title="Site Traffic" value="84,201" subtitle="+5% this week" color="var(--color-amber-500)" bgColor="var(--color-amber-50)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Activity Table */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Recent Platform Activity</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", color: "var(--color-slate-500)", fontSize: "0.85rem", textAlign: "left" }}>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>User</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Action</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Time</th>
                <th style={{ paddingBottom: "1rem", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: "Sarah Jenkins", action: "Created Event: 'Tech Expo 2025'", time: "10 mins ago", status: "Approved", color: "var(--color-green-500)", bg: "#d1fae5" },
                { user: "Michael Chen", action: "Requested Vendor Payout", time: "1 hour ago", status: "Pending", color: "var(--color-amber-500)", bg: "#fef3c7" },
                { user: "Emma Watson", action: "Reported an issue", time: "2 hours ago", status: "Open", color: "var(--color-red-500)", bg: "#fee2e2" },
                { user: "David Smith", action: "Upgraded to Premium Vendor", time: "5 hours ago", status: "Completed", color: "var(--color-blue-500)", bg: "#dbeafe" }
              ].map((item, i) => (
                <tr key={i} style={{ borderBottom: i !== 3 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "1rem 0", fontWeight: "500", color: "var(--color-slate-900)", fontSize: "0.9rem" }}>{item.user}</td>
                  <td style={{ padding: "1rem 0", color: "var(--color-slate-500)", fontSize: "0.9rem" }}>{item.action}</td>
                  <td style={{ padding: "1rem 0", color: "var(--color-slate-500)", fontSize: "0.85rem" }}>{item.time}</td>
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

        {/* System Alerts */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>System Alerts</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", backgroundColor: "var(--color-amber-50)", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #fef3c7" }}>
              <AlertCircle color="var(--color-amber-500)" size={20} />
              <div>
                <h4 style={{ fontWeight: "600", color: "#92400e", fontSize: "0.9rem" }}>High Traffic Warning</h4>
                <p style={{ color: "var(--color-amber-700)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Server load is at 85%. Consider scaling resources.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", backgroundColor: "var(--color-slate-50)", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
              <Users color="var(--color-slate-500)" size={20} />
              <div>
                <h4 style={{ fontWeight: "600", color: "var(--color-slate-700)", fontSize: "0.9rem" }}>12 Pending Vendor Approvals</h4>
                <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Review new vendor applications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
