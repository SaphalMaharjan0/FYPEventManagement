import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { useSettings } from "../../contexts/SettingsContext";
import { formatPrice } from "../../utils/formatting";
import { useNavigate } from "react-router-dom";

export default function ServiceListingsPage() {
  const fetchWithAuth = useFetch();
  const { currency } = useSettings();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [editForm, setEditForm] = useState({
    serviceName: "",
    category: "",
    price: "",
    description: "",
    isActive: true
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await fetchWithAuth("/api/vendor/services");
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetchWithAuth(`/api/vendor/services/${id}`, { method: "DELETE" });
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert("Error deleting service: " + err.message);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setEditForm({
      serviceName: service.serviceName,
      category: service.category,
      price: service.price,
      description: service.description || "",
      isActive: service.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updated = await fetchWithAuth(`/api/vendor/services/${editingService.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
        headers: {
          "Content-Type": "application/json"
        }
      });
      setServices(services.map(s => s.id === updated.id ? updated : s));
      setIsEditModalOpen(false);
    } catch (err) {
      alert("Error updating service: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading services...</div>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Service Listings</h1>
        <button 
          onClick={() => navigate("/vendor/add-service")}
          style={{ 
            display: "flex", alignItems: "center", gap: "0.5rem", 
            padding: "0.6rem 1.25rem", backgroundColor: "var(--color-blue-500)", 
            color: "var(--color-white)", border: "none", borderRadius: "0.5rem",
            fontWeight: "500", cursor: "pointer"
          }}
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "0.5rem", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {services.length === 0 && !loading && !error && (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1.25rem", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>No services found</h3>
          <p style={{ color: "var(--color-slate-500)" }}>Click "Add Service" to create your first listing.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {services.map(service => (
          <div key={service.id} style={{ 
            backgroundColor: "var(--color-white)", borderRadius: "0.75rem", 
            border: "1px solid #e2e8f0", overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column"
          }}>
            <div style={{ height: "180px", backgroundColor: "var(--color-slate-100)", position: "relative", overflow: "hidden" }}>
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.serviceName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-slate-400)", backgroundColor: "var(--color-slate-200)" }}>
                  No Image
                </div>
              )}
              <span style={{
                position: "absolute", top: "1rem", right: "1rem",
                padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600",
                backgroundColor: service.isActive ? "var(--color-green-500)" : "var(--color-slate-500)",
                color: "var(--color-white)"
              }}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{service.serviceName}</h3>
              <p style={{ color: "var(--color-slate-500)", fontSize: "0.85rem", marginBottom: "1rem" }}>{service.category}</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flex: 1 }}>
                <div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--color-blue-500)" }}>{formatPrice(service.price, currency)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  onClick={() => handleEditClick(service)}
                  style={{ 
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", 
                    padding: "0.5rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", 
                    borderRadius: "0.5rem", color: "var(--color-slate-900)", fontWeight: "500", cursor: "pointer", fontSize: "0.9rem"
                  }}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  style={{ 
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", 
                    backgroundColor: "var(--color-white)", border: "1px solid #fca5a5", borderRadius: "0.5rem",
                    color: "var(--color-red-500)", cursor: "pointer"
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "var(--color-white)", borderRadius: "1rem", width: "100%", maxWidth: "500px",
            maxHeight: "90vh", overflowY: "auto", padding: "2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Edit Service</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-500)" }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Service Name</label>
                <input 
                  type="text" required
                  value={editForm.serviceName}
                  onChange={e => setEditForm({...editForm, serviceName: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Category</label>
                <input 
                  type="text" required
                  value={editForm.category}
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Price (USD)</label>
                <input 
                  type="number" step="0.01" required min="0"
                  value={editForm.price}
                  onChange={e => setEditForm({...editForm, price: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)", marginBottom: "0.5rem" }}>Description</label>
                <textarea 
                  rows="3"
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none", resize: "vertical" }}
                ></textarea>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input 
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={e => setEditForm({...editForm, isActive: e.target.checked})}
                    style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--color-slate-700)" }}>Service is Active</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editLoading}
                  style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: editLoading ? "not-allowed" : "pointer", opacity: editLoading ? 0.7 : 1 }}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
