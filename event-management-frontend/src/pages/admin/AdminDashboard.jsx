import React, { useState, useEffect } from "react";
import { Users, Calendar, Ticket, DollarSign, Download, CheckCircle, ShieldAlert } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function AdminDashboard({ currentUser }) {
  const fetchWithAuth = useFetch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchWithAuth("/api/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [fetchWithAuth]);

  // Chart Data (fallback to dummy if stats not ready or missing)
  const revenueData = stats?.monthlyRevenue || [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 55000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 72000 },
    { name: 'May', value: 88000 },
    { name: 'Jun', value: 92000 },
    { name: 'Jul', value: 115000 },
    { name: 'Aug', value: 105000 }
  ];

  const categoryData = stats?.eventsByCategory || [
    { name: 'Technology', value: 32, color: '#3b82f6' },
    { name: 'Music', value: 28, color: '#10b981' },
    { name: 'Business', value: 18, color: '#f59e0b' },
    { name: 'Arts', value: 12, color: '#8b5cf6' },
    { name: 'Sports', value: 10, color: '#ef4444' }
  ];

  const userGrowthData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1800 },
    { name: 'Mar', value: 2400 },
    { name: 'Apr', value: 3200 },
    { name: 'May', value: 4100 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 6200 },
    { name: 'Aug', value: 7284 }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, iconColor, iconBg }) => (
    <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start", gap: "1.25rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div style={{ backgroundColor: iconBg, color: iconColor, padding: "0.75rem", borderRadius: "8px", marginTop: "0.25rem" }}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.25rem" }}>{title}</p>
        <h3 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{value}</h3>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--color-slate-500)", fontSize: "0.9rem", marginTop: "0.25rem" }}>Platform overview — June 29, 2025</p>
        </div>
        <button style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Top Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {loading ? (
           <p style={{ color: "var(--color-slate-500)", padding: "1.5rem" }}>Loading stats...</p>
        ) : (
          <>
            <StatCard icon={Users} title="Total Users" value={stats?.totalUsers?.toLocaleString() || "0"} subtitle="+12% this month" iconColor="#3b82f6" iconBg="#eff6ff" />
            <StatCard icon={Calendar} title="Total Events" value={stats?.totalEvents?.toLocaleString() || "0"} subtitle="142 new this week" iconColor="#10b981" iconBg="#ecfdf5" />
            <StatCard icon={Ticket} title="Bookings" value={stats?.totalBookings?.toLocaleString() || "0"} subtitle="+8.4% vs last month" iconColor="#f59e0b" iconBg="#fffbeb" />
            <StatCard icon={DollarSign} title="Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`} subtitle="YTD 2025" iconColor="#8b5cf6" iconBg="#f5f3ff" />
          </>
        )}
      </div>

      {/* Middle Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        
        {/* Revenue Line Chart */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Revenue Overview</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Events by Category</h2>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ height: "200px", width: "100%", marginBottom: "1rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {categoryData.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.color }}></div>
                    <span style={{ color: "var(--color-slate-600)" }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: "600", color: "var(--color-slate-900)" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* User Growth Line Chart */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>User Growth</h2>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Users']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Recent Activity</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#ecfdf5", color: "#10b981", padding: "0.5rem", borderRadius: "50%", marginTop: "0.25rem" }}>
                <CheckCircle size={16} />
              </div>
              <div>
                <p style={{ color: "var(--color-slate-900)", fontSize: "0.95rem", fontWeight: "500", marginBottom: "0.2rem" }}>New vendor Marcus Chen verified</p>
                <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>5 min ago</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#eff6ff", color: "#3b82f6", padding: "0.5rem", borderRadius: "50%", marginTop: "0.25rem" }}>
                <Calendar size={16} />
              </div>
              <div>
                <p style={{ color: "var(--color-slate-900)", fontSize: "0.95rem", fontWeight: "500", marginBottom: "0.2rem" }}>Event TechConf 2025 published</p>
                <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>22 min ago</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#fffbeb", color: "#f59e0b", padding: "0.5rem", borderRadius: "50%", marginTop: "0.25rem" }}>
                <ShieldAlert size={16} />
              </div>
              <div>
                <p style={{ color: "var(--color-slate-900)", fontSize: "0.95rem", fontWeight: "500", marginBottom: "0.2rem" }}>Booking dispute resolved for BK-0092</p>
                <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>1 hour ago</p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "#eff6ff", color: "#3b82f6", padding: "0.5rem", borderRadius: "50%", marginTop: "0.25rem" }}>
                <Ticket size={16} />
              </div>
              <div>
                <p style={{ color: "var(--color-slate-900)", fontSize: "0.95rem", fontWeight: "500", marginBottom: "0.2rem" }}>150+ tickets sold in last hour</p>
                <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
