import React, { useState, useEffect } from "react";
import { Package, Inbox, DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function VendorDashboard({ currentUser }) {
  const fetchWithAuth = useFetch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchWithAuth("/api/vendor/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to load vendor dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [fetchWithAuth]);

  const formatCurrency = (val) => {
    if (val == null) return "Rs 0";
    return `Rs ${Number(val).toLocaleString()}`;
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
      case "confirmed":
        return { bg: "#dcfce7", text: "#16a34a" };
      case "pending":
        return { bg: "#fef3c7", text: "#d97706" };
      case "completed":
        return { bg: "#e0f2fe", text: "#0284c7" };
      case "rejected":
        return { bg: "#fee2e2", text: "#dc2626" };
      default:
        return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, iconColor, iconBg }) => (
    <div style={{
      backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem",
      border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start",
      gap: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        backgroundColor: iconBg, color: iconColor, padding: "0.75rem",
        borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.25rem" }}>{title}</p>
        <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem", lineHeight: "1" }}>
          {loading ? "..." : value}
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>
          Vendor Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
          Welcome back, {currentUser?.fullName || currentUser?.name || "Vendor"}! Here's your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <StatCard
          icon={Package}
          title="Total Services"
          value={stats?.totalServices ?? 0}
          subtitle="Active service listings"
          iconColor="#3b82f6"
          iconBg="#eff6ff"
        />
        <StatCard
          icon={Inbox}
          title="Pending Requests"
          value={stats?.pendingRequests ?? 0}
          subtitle="Awaiting your response"
          iconColor="#d97706"
          iconBg="#fffbeb"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Requests"
          value={stats?.activeRequests ?? 0}
          subtitle="Currently in progress"
          iconColor="#8b5cf6"
          iconBg="#f5f3ff"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          subtitle="From completed requests"
          iconColor="#16a34a"
          iconBg="#f0fdf4"
        />
      </div>

      {/* Recent Requests */}
      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a" }}>
            Recent Service Requests
          </h2>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Last 5 requests
          </span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>Loading requests...</p>
        ) : !stats?.recentRequests || stats.recentRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            <CheckCircle size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "0.95rem" }}>No service requests yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              When customers request your services, they'll appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stats.recentRequests.map((req) => {
              const style = getStatusStyle(req.status);
              return (
                <div key={req.id} style={{
                  padding: "1rem 1.25rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
                      {req.client}
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
                      {req.service} {req.eventDate ? `· ${req.eventDate}` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {req.amount != null && (
                      <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0f172a" }}>
                        {formatCurrency(req.amount)}
                      </span>
                    )}
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      backgroundColor: style.bg,
                      color: style.text,
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      whiteSpace: "nowrap"
                    }}>
                      {req.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
