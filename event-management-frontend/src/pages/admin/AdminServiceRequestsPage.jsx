import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { formatPrice, formatDate } from "../../utils/formatting";
import { CheckCircle, XCircle, Search } from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function AdminServiceRequestsPage({ currentUser }) {
  const fetchWithAuth = useFetch();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRequests();
  }, [fetchWithAuth]);

  const loadRequests = async () => {
    try {
      const data = await fetchWithAuth("/api/admin/vendor-applications");
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load vendor applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (request, action) => {
    setConfirmModal({
      title: action === 'accept' ? 'Accept Application' : 'Decline Application',
      message: `Are you sure you want to ${action} the application from ${request.client} for ${request.service}?`,
      confirmText: action === 'accept' ? 'Accept' : 'Decline',
      confirmColor: action === 'accept' ? '#2563eb' : '#dc2626',
      onConfirm: () => handleConfirmAction(request.rawId, action)
    });
  };

  const handleConfirmAction = async (requestId, action) => {
    setConfirmLoading(true);
    try {
      const updatedRequest = await fetchWithAuth(`/api/admin/vendor-applications/${requestId}/${action}`, {
        method: "POST"
      });
      if (updatedRequest) {
        setRequests(requests.filter(req => req.rawId !== requestId));
        setConfirmModal(null);
      }
    } catch (err) {
      alert(`Failed to ${action} application: ` + (err.message || "Unknown error"));
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading service requests...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-main)" }}>Vendor Applications</h1>
          <p style={{ color: "var(--text-subtle)", marginTop: "0.5rem" }}>Review and manage service applications from vendors.</p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-main)", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-main)", display: "flex", gap: "1rem" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
            <input
              type="text"
              placeholder="Search by vendor, service, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "8px", border: "1px solid var(--border-main)",
                backgroundColor: "var(--bg-main)", color: "var(--text-main)"
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-main)", borderBottom: "1px solid var(--border-main)", textAlign: "left" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--text-subtle)" }}>Vendor</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--text-subtle)" }}>Service</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--text-subtle)" }}>Event</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--text-subtle)" }}>Price</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--text-subtle)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
                  <tr key={req.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ fontWeight: "500", color: "var(--text-main)" }}>{req.client}</div>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-subtle)" }}>{req.service}</td>
                    <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-subtle)" }}>
                      <div>{req.eventTitle}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{formatDate(req.date)}</div>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", fontWeight: "500" }}>${formatPrice(req.amount)}</td>
                    <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleActionClick(req, 'accept')}
                          style={{
                            padding: "0.5rem 1rem", backgroundColor: "#ecfdf5", color: "#059669",
                            border: "1px solid #a7f3d0", borderRadius: "6px", fontWeight: "500",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem"
                          }}
                        >
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button
                          onClick={() => handleActionClick(req, 'reject')}
                          style={{
                            padding: "0.5rem 1rem", backgroundColor: "#fef2f2", color: "#dc2626",
                            border: "1px solid #fecaca", borderRadius: "6px", fontWeight: "500",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem"
                          }}
                        >
                          <XCircle size={16} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)" }}>
                    No pending vendor applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmModal && (
        <ConfirmModal
          isOpen={true}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText="Cancel"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
          isLoading={confirmLoading}
          confirmColor={confirmModal.confirmColor}
        />
      )}
    </div>
  );
}
