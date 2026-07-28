import React, { useState, useEffect } from "react";
import { Check, X, Eye, Filter } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice } from "../../utils/formatting";
import { useSettings } from "../../contexts/SettingsContext";

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchWithAuth = useFetch();
  const { currency } = useSettings();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/api/vendor/requests");
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedRequest = await fetchWithAuth(`/api/vendor/requests/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      
      setRequests(requests.map(req => 
        req.rawId === id ? updatedRequest : req
      ));
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredRequests = activeTab === "all" ? requests : requests.filter(r => r.status.toLowerCase() === activeTab);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>Service Requests</h1>
          <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>Manage and respond to client booking requests.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: "var(--color-slate-900)", fontWeight: "500", cursor: "pointer" }}>
          <Filter size={18} /> Filter
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", padding: "0 1.5rem" }}>
          {["All", "Pending", "Active", "Completed", "Rejected"].map(tab => {
            const isActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  padding: "1rem 1.5rem",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                  color: isActive ? "var(--color-blue-500)" : "var(--color-slate-500)",
                  fontWeight: isActive ? "600" : "500",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  marginBottom: "-1px"
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Request ID</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Client</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Service</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Event Date</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Amount</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>
                    Loading requests...
                  </td>
                </tr>
              ) : filteredRequests.map((req, idx) => (
                <tr key={req.id} style={{ borderBottom: idx !== filteredRequests.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-blue-500)", fontWeight: "500" }}>{req.id}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "500" }}>{req.client}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-500)" }}>{req.service}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-500)" }}>{req.date}</td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)", fontWeight: "600" }}>
                    {formatPrice(req.amount, currency)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "1rem", 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      backgroundColor: req.status === "Pending" ? "#fef3c7" : req.status === "Active" ? "#dcfce7" : req.status === "Completed" ? "#e0e7ff" : "#fee2e2",
                      color: req.status === "Pending" ? "#d97706" : req.status === "Active" ? "#16a34a" : req.status === "Completed" ? "#4338ca" : "#dc2626",
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                      {req.status === "Pending" && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(req.rawId, "Active")}
                            style={{ padding: "0.4rem", backgroundColor: "#dcfce7", color: "#16a34a", border: "none", borderRadius: "0.25rem", cursor: "pointer" }} 
                            title="Accept Request"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(req.rawId, "Rejected")}
                            style={{ padding: "0.4rem", backgroundColor: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "0.25rem", cursor: "pointer" }} 
                            title="Reject Request"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {req.status === "Active" && (
                         <button 
                           onClick={() => handleStatusChange(req.rawId, "Completed")}
                           style={{ padding: "0.4rem", backgroundColor: "#e0e7ff", color: "#4338ca", border: "none", borderRadius: "0.25rem", cursor: "pointer" }} 
                           title="Mark Completed"
                         >
                           <Check size={16} />
                         </button>
                      )}
                      <button style={{ padding: "0.4rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-500)", border: "none", borderRadius: "0.25rem", cursor: "pointer" }} title="View Details">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: "3rem 1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>
                    No requests found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
