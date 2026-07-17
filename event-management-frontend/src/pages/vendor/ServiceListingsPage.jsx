import React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ServiceListingsPage({ onNavigate }) {
  const services = [
    {
      id: 1,
      title: "Professional Photography Package",
      category: "Photography",
      price: "$800",
      unit: "event",
      requests: 12,
      status: "Active",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=200"
    },
    {
      id: 2,
      title: "Live DJ & Sound System",
      category: "Entertainment",
      price: "$1,200",
      unit: "event",
      requests: 8,
      status: "Active",
      image: "" // Intentional empty image like screenshot
    },
    {
      id: 3,
      title: "Event Catering — 3 Course Menu",
      category: "Catering",
      price: "$45",
      unit: "person",
      requests: 3,
      status: "Pending",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400&h=200"
    }
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a" }}>Service Listings</h1>
        <button 
          onClick={() => onNavigate("vendor-add-service")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            padding: "0.6rem 1.25rem", 
            backgroundColor: "#3b82f6", 
            color: "white", 
            border: "none", 
            borderRadius: "0.5rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {services.map(service => (
          <div key={service.id} style={{ 
            backgroundColor: "white", 
            borderRadius: "0.75rem", 
            border: "1px solid #e2e8f0", 
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Image Section */}
            <div style={{ height: "180px", backgroundColor: "#f8fafc", position: "relative" }}>
              {service.image ? (
                <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : null}
              
              <span style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                backgroundColor: service.status === "Active" ? "#10b981" : "#f59e0b",
                color: "white"
              }}>
                {service.status}
              </span>
            </div>

            {/* Content Section */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.25rem" }}>{service.title}</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>{service.category}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flex: 1 }}>
                <div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#3b82f6" }}>{service.price}</span>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>/{service.unit}</span>
                </div>
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  {service.requests} requests
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button style={{ 
                  flex: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.5rem", 
                  padding: "0.5rem", 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "0.5rem",
                  color: "#0f172a",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}>
                  <Edit2 size={16} /> Edit
                </button>
                <button style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  padding: "0.5rem", 
                  backgroundColor: "white", 
                  border: "1px solid #fca5a5", 
                  borderRadius: "0.5rem",
                  color: "#ef4444",
                  cursor: "pointer"
                }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
