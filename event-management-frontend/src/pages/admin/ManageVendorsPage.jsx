import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit2, Trash2, Filter, ShieldCheck, Clock, X, CheckCircle, XCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageVendorsPage() {
  const fetchWithAuth = useFetch();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ fullName: "", businessName: "", email: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // View Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/api/admin/vendors");
      setVendors(data || []);
    } catch (err) {
      console.error("Failed to load admin vendors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError(null);
    setInviteLoading(true);
    try {
      const newVendor = await fetchWithAuth("/api/admin/vendors/invite", {
        method: "POST",
        body: JSON.stringify(inviteData),
      });
      setVendors([newVendor, ...vendors]);
      setShowInviteModal(false);
      setInviteData({ fullName: "", businessName: "", email: "" });
      alert("Vendor invited successfully! An email with credentials has been sent.");
    } catch (err) {
      setInviteError(err.message || "Failed to invite vendor");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleEditClick = (vendor) => {
    setEditData({ ...vendor });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleViewClick = (vendor) => {
    setViewData(vendor);
    setShowViewModal(true);
  };

  const handleStatusChange = (vendor, newStatus) => {
    let confirmMsg = `Are you sure you want to ${newStatus.toLowerCase()} this vendor application?`;
    let actionColor = "var(--color-red-500)";
    if (newStatus === "Verified") {
      confirmMsg = "Are you sure you want to APPROVE this vendor application? They will gain full access to the platform.";
      actionColor = "var(--color-emerald-500)";
    }
    
    setConfirmModal({
      message: confirmMsg,
      actionText: "Confirm",
      actionColor: actionColor,
      action: async () => {
        const vendorIdNum = vendor.id.replace('VND-', '');
        const updatedVendor = await fetchWithAuth(`/api/admin/vendors/${parseInt(vendorIdNum)}`, {
          method: "PUT",
          body: JSON.stringify({ ...vendor, status: newStatus }),
        });
        setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
        if (viewData && viewData.id === vendor.id) {
           setViewData(updatedVendor);
        }
      }
    });
  };

  const executeConfirmAction = async () => {
    if (!confirmModal || !confirmModal.action) return;
    setConfirmLoading(true);
    try {
      await confirmModal.action();
      setConfirmModal(null);
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditLoading(true);
    try {
      const vendorIdNum = editData.id.replace('VND-', '');
      const updatedVendor = await fetchWithAuth(`/api/admin/vendors/${parseInt(vendorIdNum)}`, {
        method: "PUT",
        body: JSON.stringify(editData),
      });
      setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
      setShowEditModal(false);
      alert("Vendor updated successfully!");
    } catch (err) {
      setEditError(err.message || "Failed to update vendor");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (vendorId) => {
    setConfirmModal({
      message: "Are you sure you want to delete this vendor? This action cannot be undone and will delete all their data and services.",
      actionText: "Delete",
      actionColor: "var(--color-red-500)",
      action: async () => {
        const vendorIdNum = vendorId.replace('VND-', '');
        await fetchWithAuth(`/api/admin/vendors/${parseInt(vendorIdNum)}`, {
          method: "DELETE"
        });
        setVendors(vendors.filter(v => v.id !== vendorId));
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Verified": return { bg: "#ecfdf5", text: "#047857", icon: <ShieldCheck size={14} /> };
      case "Pending": return { bg: "#fffbeb", text: "#d97706", icon: <Clock size={14} /> };
      case "Rejected": return { bg: "#fef2f2", text: "#b91c1c", icon: null };
      default: return { bg: "#f1f5f9", text: "#475569", icon: null };
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.name && vendor.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (vendor.owner && vendor.owner.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (vendor.email && vendor.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || (vendor.status && vendor.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  }).sort((a, b) => a.dbId - b.dbId);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Vendor Management</h1>
        <button 
          onClick={() => setShowInviteModal(true)}
          style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Plus size={16} />
          Invite Vendor
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        
        {/* Search and Filter Bar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "1rem" }}>
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--color-slate-50)",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            border: "1px solid #e2e8f0"
          }}>
            <Search size={18} color="var(--color-slate-400)" />
            <input 
              type="text" 
              placeholder="Search vendors by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "0.75rem",
                width: "100%",
                fontSize: "0.9rem",
                color: "var(--color-slate-900)"
              }}
            />
          </div>
          
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 1rem", backgroundColor: showFilters ? "var(--color-slate-200)" : "var(--color-slate-50)",
                border: "1px solid #e2e8f0", borderRadius: "8px", color: "var(--color-slate-600)",
                cursor: "pointer", height: "100%"
              }}>
              <Filter size={18} />
            </button>

            {showFilters && (
              <div style={{
                position: "absolute", top: "110%", right: 0, 
                backgroundColor: "white", borderRadius: "8px", 
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0",
                padding: "1rem", zIndex: 10, minWidth: "200px"
              }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-slate-500)", marginBottom: "0.25rem" }}>Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vendors Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Vendor ID</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Company / Name</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Contact</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Active Events</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Joined</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>Loading vendors...</td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>No vendors found.</td>
                </tr>
              ) : (
                filteredVendors.map((vendor, idx) => {
                  const statusStyle = getStatusStyle(vendor.status);
                  return (
                  <tr key={vendor.id} style={{ borderBottom: idx !== filteredVendors.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-slate-500)", fontFamily: "monospace" }}>{vendor.id}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", overflow: "hidden", flexShrink: 0 }}>
                          {vendor.profilePicture ? (
                            <img src={vendor.profilePicture} alt={vendor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            vendor.name ? vendor.name.substring(0,2).toUpperCase() : "V"
                          )}
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "var(--color-slate-900)", fontSize: "0.95rem", display: "block" }}>{vendor.name}</span>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-slate-500)" }}>{vendor.owner}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{vendor.email}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ 
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        backgroundColor: statusStyle.bg, 
                        color: statusStyle.text, 
                        padding: "0.25rem 0.6rem", 
                        borderRadius: "1rem", 
                        fontSize: "0.75rem", 
                        fontWeight: "600" 
                      }}>
                        {statusStyle.icon}
                        {vendor.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{vendor.properties}</td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{vendor.joined}</td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button onClick={() => handleViewClick(vendor)} style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }} title="View Details"><Eye size={16} /></button>
                        <button onClick={() => handleEditClick(vendor)} style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }} title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(vendor.id)} style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "450px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", margin: 0 }}>Invite Vendor</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            {inviteError && (
              <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                {inviteError}
              </div>
            )}
            
            <form onSubmit={handleInvite}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Vendor Name (Owner)</label>
                <input 
                  type="text"
                  required
                  value={inviteData.fullName}
                  onChange={e => setInviteData({...inviteData, fullName: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Business / Company Name</label>
                <input 
                  type="text"
                  required
                  value={inviteData.businessName}
                  onChange={e => setInviteData({...inviteData, businessName: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                  placeholder="e.g. Doe Catering Services"
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Email Address</label>
                <input 
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                  placeholder="e.g. john@doecatering.com"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={inviteLoading}
                  style={{ padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: inviteLoading ? "not-allowed" : "pointer", opacity: inviteLoading ? 0.7 : 1 }}
                >
                  {inviteLoading ? "Sending Invite..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && editData && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "450px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", margin: 0 }}>Edit Vendor</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            {editError && (
              <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                {editError}
              </div>
            )}
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Business / Company Name</label>
                <input 
                  type="text"
                  required
                  value={editData.name}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Vendor Name (Owner)</label>
                <input 
                  type="text"
                  required
                  value={editData.owner}
                  onChange={e => setEditData({...editData, owner: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Email Address</label>
                <input 
                  type="email"
                  required
                  value={editData.email}
                  onChange={e => setEditData({...editData, email: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Status</label>
                <select 
                  value={editData.status}
                  onChange={e => setEditData({...editData, status: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem" }}
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  style={{ padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: editLoading ? "not-allowed" : "pointer", opacity: editLoading ? 0.7 : 1 }}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Vendor Modal */}
      {showViewModal && viewData && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "600px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", margin: 0 }}>Vendor Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-slate-500)", marginBottom: "0.5rem" }}>Business Info</h3>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Company Name:</strong> {viewData.name}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Owner:</strong> {viewData.owner}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Status:</strong> {viewData.status}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Joined:</strong> {viewData.joined}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Active Events:</strong> {viewData.properties}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-slate-500)", marginBottom: "0.5rem" }}>Contact Info</h3>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Login Email:</strong> {viewData.email}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Contact Email:</strong> {viewData.contactEmail || "N/A"}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Phone:</strong> {viewData.contactPhone || "N/A"}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}><strong>Address:</strong> {viewData.businessAddress || "N/A"}</p>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-slate-500)", marginBottom: "0.5rem" }}>Description</h3>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-slate-700)", lineHeight: "1.5" }}>
                {viewData.businessDesc || "No description provided."}
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-slate-500)", marginBottom: "0.75rem" }}>Business Documents</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                {viewData.citizenshipImage && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-slate-600)", display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Citizenship</span>
                    <div onClick={() => setSelectedImage(viewData.citizenshipImage)} style={{ display: "block" }}>
                      <img src={viewData.citizenshipImage} alt="Citizenship" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }} title="Click to enlarge" />
                    </div>
                  </div>
                )}
                {viewData.passportPhoto && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-slate-600)", display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Passport Photo</span>
                    <div onClick={() => setSelectedImage(viewData.passportPhoto)} style={{ display: "block" }}>
                      <img src={viewData.passportPhoto} alt="Passport Photo" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }} title="Click to enlarge" />
                    </div>
                  </div>
                )}
                {viewData.panVatImage && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-slate-600)", display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>PAN/VAT Card</span>
                    <div onClick={() => setSelectedImage(viewData.panVatImage)} style={{ display: "block" }}>
                      <img src={viewData.panVatImage} alt="PAN/VAT Card" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }} title="Click to enlarge" />
                    </div>
                  </div>
                )}
                {!viewData.citizenshipImage && !viewData.passportPhoto && !viewData.panVatImage && (
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-slate-500)", fontStyle: "italic" }}>No documents uploaded.</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                {viewData.status === "Pending" && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(viewData, "Verified")}
                      style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-emerald-50)", color: "var(--color-emerald-600)", border: "1px solid var(--color-emerald-200)", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <CheckCircle size={18} /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusChange(viewData, "Rejected")}
                      style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-red-50)", color: "var(--color-red-600)", border: "1px solid var(--color-red-200)", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-600)", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal Component */}
      <ConfirmModal 
        isOpen={!!confirmModal}
        title="Confirm Action"
        message={confirmModal?.message}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmModal(null)}
        confirmText={confirmModal?.actionText || "Confirm"}
        confirmColor={confirmModal?.actionColor || "#ef4444"} // red-500 default
        isLoading={confirmLoading}
      />

      {/* Full Image Modal */}
      {selectedImage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: "absolute", top: "-2rem", right: "-2rem", background: "transparent", border: "none", color: "white", cursor: "pointer" }}
            >
              <X size={32} />
            </button>
            <img src={selectedImage} alt="Full screen document" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px" }} />
          </div>
        </div>
      )}
    </div>
  );
}
