import React from "react";
import { Package, Inbox, DollarSign } from "lucide-react";

export default function VendorDashboard({ currentUser }) {
  const StatCard = ({ icon: Icon, title, value, subtitle, iconColor, iconBg }) => (
    <div style={{ backgroundColor: "var(--color-white)", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start", gap: "1.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
      <div style={{ backgroundColor: iconBg, color: iconColor, padding: "0.75rem", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.9rem", fontWeight: "500", marginBottom: "0.25rem" }}>{title}</p>
        <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem", lineHeight: "1" }}>{value}</h3>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>Vendor Dashboard</h1>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>Manage your services and track performance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <StatCard 
          icon={Package} 
          title="Total Services" 
          value="3" 
          subtitle="1 pending review" 
          iconColor="var(--color-blue-500)" 
          iconBg="var(--color-blue-50)" 
        />
        <StatCard 
          icon={Inbox} 
          title="Pending Requests" 
          value="5" 
          subtitle="2 urgent" 
          iconColor="var(--color-amber-500)" 
          iconBg="var(--color-amber-50)" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Revenue" 
          value="$8,420" 
          subtitle="+18% vs last month" 
          iconColor="var(--color-purple-500)" 
          iconBg="#f5f3ff" 
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Revenue Chart Section */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1.5rem" }}>Revenue This Month</h2>
          
          {/* Mock Line Chart with CSS/SVG */}
          <div style={{ height: "300px", width: "100%", position: "relative" }}>
            {/* Y-axis labels */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: "30px", width: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "var(--color-slate-400)", fontSize: "0.75rem" }}>
              <span>$120k</span>
              <span>$90k</span>
              <span>$60k</span>
              <span>$30k</span>
              <span>$0k</span>
            </div>
            
            {/* Grid lines */}
            <div style={{ position: "absolute", left: "40px", right: 0, top: 0, bottom: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: "100%", borderTop: "1px dashed #f1f5f9", height: 0 }}></div>
              ))}
            </div>

            {/* SVG Line and Area */}
            <svg style={{ position: "absolute", left: "40px", right: 0, top: 0, bottom: "30px", width: "calc(100% - 40px)", height: "calc(100% - 30px)", overflow: "visible" }} preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-blue-500)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-blue-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 50 Q 25 45, 50 30 T 100 40 L 100 100 L 0 100 Z" 
                fill="url(#revenueGradient)"
              />
              <path 
                d="M 0 50 Q 25 45, 50 30 T 100 40" 
                fill="none" 
                stroke="var(--color-blue-500)" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* X-axis labels */}
            <div style={{ position: "absolute", left: "40px", right: 0, bottom: 0, height: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "var(--color-slate-400)", fontSize: "0.75rem", padding: "0 10px" }}>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Recent Requests</h2>
            <button style={{ background: "none", border: "none", color: "var(--color-blue-500)", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>View all</button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { client: "TechConf Organizers", service: "Photography Package · Aug 15", status: "Pending", statusColor: "#d97706", statusBg: "#fef3c7" },
              { client: "SoundWave Events", service: "Live DJ & Sound · Sep 3", status: "Active", statusColor: "#16a34a", statusBg: "#dcfce7" },
              { client: "Culinary Foundation", service: "Catering Service · Aug 28", status: "Active", statusColor: "#16a34a", statusBg: "#dcfce7" }
            ].map((req, i) => (
              <div key={i} style={{ padding: "1rem", backgroundColor: "var(--color-slate-50)", borderRadius: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ fontWeight: "600", color: "var(--color-slate-900)", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{req.client}</h4>
                  <p style={{ color: "var(--color-slate-500)", fontSize: "0.8rem" }}>{req.service}</p>
                </div>
                <span style={{ 
                  padding: "0.25rem 0.75rem", 
                  borderRadius: "1rem", 
                  backgroundColor: req.statusBg, 
                  color: req.statusColor, 
                  fontSize: "0.75rem", 
                  fontWeight: "600" 
                }}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
