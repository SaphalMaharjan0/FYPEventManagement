import React, { useState, useEffect } from "react";
import { DollarSign, Ticket, TrendingUp, Target, Download } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
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

  // Chart Data (fallback to empty arrays if stats not ready or missing)
  const monthlyRevenue = stats?.monthlyRevenue || [];
  const userGrowth = stats?.userGrowthData || [];
  const bookingsByMonth = stats?.bookingsByDate || [];
  const topEvents = stats?.topEvents || [];

  const exportToCSV = () => {
    if (!stats) return;
    
    let csvContent = "";
    
    csvContent += "--- REPORT SUMMARY ---\n";
    csvContent += `Total Revenue,${stats.totalRevenue}\n`;
    csvContent += `Total Bookings,${stats.totalBookings}\n`;
    csvContent += `Total Events,${stats.totalEvents}\n`;
    csvContent += `Total Users,${stats.totalUsers}\n\n`;
    
    csvContent += "--- MONTHLY REVENUE ---\n";
    csvContent += "Month,Revenue\n";
    monthlyRevenue.forEach(item => {
      csvContent += `${item.name},${item.value}\n`;
    });
    
    csvContent += "\n--- TOP EVENTS (REVENUE) ---\n";
    csvContent += "Event Name,Revenue,Percentage\n";
    topEvents.forEach(item => {
      csvContent += `"${item.name}",${item.revenue},${item.percentage}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `eventpulse_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("EventPulse Official Analytics Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 30);
    
    // Summary Metrics
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Performance Summary", 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `$${stats.totalRevenue?.toLocaleString() || "0"}`],
        ['Total Bookings', stats.totalBookings?.toLocaleString() || "0"],
        ['Total Events', stats.totalEvents?.toLocaleString() || "0"],
        ['Total Users', stats.totalUsers?.toLocaleString() || "0"]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 11, cellPadding: 5 }
    });
    
    // Monthly Revenue
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Monthly Revenue Trend", 14, doc.lastAutoTable.finalY + 15);
    
    const revenueBody = monthlyRevenue.map(item => [item.name, `$${item.value?.toLocaleString() || "0"}`]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Month', 'Revenue']],
      body: revenueBody,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 11, cellPadding: 5 }
    });
    
    // Top Events
    let nextY = doc.lastAutoTable.finalY;
    if (nextY > 200) {
      doc.addPage();
      nextY = 15;
    } else {
      nextY += 15;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Top Performing Events", 14, nextY);
    
    autoTable(doc, {
      startY: nextY + 5,
      head: [['Event Name', 'Revenue', 'Percentage']],
      body: topEvents.map(item => [item.name, `$${item.revenue?.toLocaleString() || "0"}`, `${item.percentage?.toFixed(2) || "0.00"}%`]),
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 11, cellPadding: 5 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${pageCount} - EventPulse Confidential`, 
        doc.internal.pageSize.width / 2, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
    }

    doc.save(`eventpulse_official_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, iconColor, iconBg }) => (
    <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
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
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Reports & Analytics</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={exportToCSV}
            style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", 
            padding: "0.6rem 1.25rem", backgroundColor: "white", color: "var(--color-slate-700)", 
            border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            <Download size={16} />
            Export CSV
          </button>
          <button 
            onClick={exportToPDF}
            style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", 
            padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
            border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
            cursor: "pointer"
          }}>
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {loading ? (
           <p style={{ color: "var(--color-slate-500)", padding: "1.5rem" }}>Loading stats...</p>
        ) : (
          <>
            <StatCard icon={DollarSign} title="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`} subtitle="+23% YoY" iconColor="#10b981" iconBg="#ecfdf5" />
            <StatCard icon={Ticket} title="Total Bookings" value={stats?.totalBookings?.toLocaleString() || "0"} subtitle="This year" iconColor="#3b82f6" iconBg="#eff6ff" />
            <StatCard icon={TrendingUp} title="Avg. Ticket Price" value="$142" subtitle="+$18 vs last year" iconColor="#f59e0b" iconBg="#fffbeb" />
            <StatCard icon={Target} title="User Retention" value="74%" subtitle="+6% vs last quarter" iconColor="#8b5cf6" iconBg="#f5f3ff" />
          </>
        )}
      </div>

      {/* Middle Row */}
      <div className="dashboard-grid-equal">
        
        {/* Monthly Revenue Trend */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Monthly Revenue Trend</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Trajectory */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>User Growth Trajectory</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Users']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="dashboard-grid-equal">
        
        {/* Bookings by Month */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Bookings by Month</h2>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByMonth} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Bookings']}
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Events */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Top Performing Events</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {topEvents.map((event) => (
              <div key={event.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ 
                      width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#f1f5f9", 
                      color: "var(--color-slate-500)", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: "bold" 
                    }}>
                      {event.id}
                    </span>
                    <span style={{ color: "var(--color-slate-900)", fontSize: "0.9rem", fontWeight: "500", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {event.name}
                    </span>
                  </div>
                  <span style={{ color: "var(--color-slate-900)", fontWeight: "bold", fontSize: "0.9rem" }}>
                    ${event.revenue.toLocaleString()}
                  </span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${event.percentage}%`, backgroundColor: "#3b82f6", borderRadius: "3px" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
