import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, EyeOff, Edit2, Trash2, Filter, X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageUsersPage() {
  const fetchWithAuth = useFetch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "customer", status: "Active" });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust as needed

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchWithAuth("/api/admin/users");
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load admin users", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [fetchWithAuth]);

  const getRoleStyle = (role) => {
    switch (role) {
      case "Vendor": return { bg: "#fef3c7", text: "#b45309" }; // amber
      case "Admin": return { bg: "#eff6ff", text: "#1d4ed8" }; // blue
      default: return { bg: "#f1f5f9", text: "#475569" }; // slate (Customer)
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return { bg: "#ecfdf5", text: "#047857" }; // green
      case "Inactive": return { bg: "#fef2f2", text: "#b91c1c" }; // red
      case "Pending": return { bg: "#fffbeb", text: "#d97706" }; // yellow
      default: return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updated = await fetchWithAuth(`/api/admin/users/${editingUser.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (updated) {
        setUsers(users.map(u => u.dbId === updated.dbId ? updated : u));
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = (userId, dbId) => {
    setConfirmModal({
      message: `Are you sure you want to delete user ${userId}?`,
      actionText: "Delete",
      actionColor: "var(--color-red-500)",
      action: async () => {
        const response = await fetchWithAuth(`/api/admin/users/${dbId}`, {
          method: "DELETE"
        });
        if (response !== null) {
          setUsers(users.filter(u => u.dbId !== dbId));
        } else {
          throw new Error("Failed to delete user.");
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const created = await fetchWithAuth(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (created) {
        setUsers([...users, created]);
        setIsAddModalOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "customer", status: "Active" });
      }
    } catch (err) {
      console.error("Failed to create user", err);
      alert("Failed to create user.");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "All" || (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());
    const matchesStatus = statusFilter === "All" || (user.status && user.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => a.dbId - b.dbId);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>User Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} style={{ 
          display: "flex", alignItems: "center", gap: "0.5rem", 
          padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white", 
          border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
          cursor: "pointer", transition: "background-color 0.2s"
        }}>
          <Plus size={16} />
          Add User
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
              placeholder="Search users by name or email..." 
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
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-slate-500)", marginBottom: "0.25rem" }}>Role</label>
                  <select 
                    value={roleFilter} 
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                  >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="administrator">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-slate-500)", marginBottom: "0.25rem" }}>Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead style={{ backgroundColor: "var(--color-slate-50)", borderBottom: "1px solid #e2e8f0" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>User ID</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Name</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Email</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Role</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Registered</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>Loading users...</td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-slate-500)" }}>No users found.</td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr key={user.id} style={{ borderBottom: idx !== paginatedUsers.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-slate-500)", fontFamily: "monospace" }}>{user.id}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", overflow: "hidden" }}>
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            user.name ? user.name.substring(0,2).toUpperCase() : "U"
                          )}
                        </div>
                        <span style={{ fontWeight: "500", color: "var(--color-slate-900)", fontSize: "0.95rem" }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{user.email}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
                        <span style={{ 
                          backgroundColor: getRoleStyle(user.role).bg, 
                          color: getRoleStyle(user.role).text, 
                          padding: "0.25rem 0.6rem", 
                          borderRadius: "1rem", 
                          fontSize: "0.75rem", 
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}>
                          {user.role}
                        </span>
                        {user.isSuperAdmin && (
                          <span style={{
                            backgroundColor: "#f5f3ff",
                            color: "#7c3aed",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            fontWeight: "700"
                          }}>
                            Super Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ 
                        backgroundColor: getStatusStyle(user.status).bg, 
                        color: getStatusStyle(user.status).text, 
                        padding: "0.25rem 0.6rem", 
                        borderRadius: "1rem", 
                        fontSize: "0.75rem", 
                        fontWeight: "600" 
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", color: "var(--color-slate-600)" }}>{user.joinedDate || user.registered}</td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                        <button style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Eye size={16} /></button>
                        <button onClick={() => handleEditClick(user)} style={{ background: "none", border: "none", color: "var(--color-blue-500)", cursor: "pointer" }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteUser(user.id, user.dbId)} style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--color-slate-500)", fontSize: "0.9rem" }}>
            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users</span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "0.4rem 0.75rem", border: "1px solid #e2e8f0", backgroundColor: "white", borderRadius: "6px", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>&larr;</button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ 
                    padding: "0.4rem 0.75rem", 
                    border: page === currentPage ? "none" : "1px solid transparent", 
                    backgroundColor: page === currentPage ? "#3b82f6" : "transparent", 
                    color: page === currentPage ? "white" : "var(--color-slate-600)", 
                    borderRadius: "6px", 
                    fontWeight: page === currentPage ? "500" : "normal",
                    cursor: "pointer" 
                  }}>
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: "0.4rem 0.75rem", border: "1px solid #e2e8f0", backgroundColor: "white", borderRadius: "6px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>&rarr;</button>
            </div>
          </div>
        )}

      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Edit User</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Name</label>
                <input 
                  type="text" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Email</label>
                <input 
                  type="email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Role</label>
                <select 
                  value={editingUser.role} 
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              {editingUser.role === "administrator" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                  <input 
                    type="checkbox" 
                    id="edit-is-super-admin"
                    checked={editingUser.isSuperAdmin || false} 
                    onChange={(e) => setEditingUser({...editingUser, isSuperAdmin: e.target.checked})}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label htmlFor="edit-is-super-admin" style={{ fontSize: "0.9rem", fontWeight: "500", cursor: "pointer", color: "var(--color-slate-900)" }}>Is Super Admin</label>
                </div>
              )}

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Status</label>
                <select 
                  value={editingUser.status} 
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>New Password (Leave blank to keep current)</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={editingUser.password || ""} 
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    style={{ width: "100%", padding: "0.75rem", paddingRight: "3rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", 
                      background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer", display: "flex" 
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "white", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: "#3b82f6", color: "white", fontWeight: "600", cursor: "pointer" }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Add New User</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Name</label>
                <input 
                  type="text" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Email</label>
                <input 
                  type="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Role</label>
                <select 
                  value={newUser.role} 
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              {newUser.role === "administrator" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                  <input 
                    type="checkbox" 
                    id="add-is-super-admin"
                    checked={newUser.isSuperAdmin || false} 
                    onChange={(e) => setNewUser({...newUser, isSuperAdmin: e.target.checked})}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label htmlFor="add-is-super-admin" style={{ fontSize: "0.9rem", fontWeight: "500", cursor: "pointer", color: "var(--color-slate-900)" }}>Is Super Admin</label>
                </div>
              )}

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                    style={{ width: "100%", padding: "0.75rem", paddingRight: "3rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                    placeholder="Enter password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", 
                      background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer", display: "flex" 
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: "0.75rem 1.5rem", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "white", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.75rem 1.5rem", border: "none", borderRadius: "6px", backgroundColor: "#3b82f6", color: "white", fontWeight: "600", cursor: "pointer" }}>
                  Create User
                </button>
              </div>
            </form>
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

    </div>
  );
}
