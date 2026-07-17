import React, { useState } from "react";
import { User, Camera, Mail, Phone, MapPin, Edit3, Briefcase, CreditCard } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function ProfilePage({ currentUser, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fetchWithAuth = useFetch();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.fullName?.split(" ")[0] || "Marcus",
    lastName: currentUser?.fullName?.split(" ")[1] || "Chen",
    phone: currentUser?.phone || "(555) 123-4567",
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone
        })
      });

      if (onUpdateUser) onUpdateUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>My Profile & Business</h1>
        <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem" }}>Manage your personal details, public profile, and business info.</p>
      </div>

      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
        {/* Cover Photo Area */}
        <div style={{ height: "150px", backgroundColor: "var(--color-slate-800)", position: "relative" }}>
          <button style={{ position: "absolute", bottom: "1rem", right: "1rem", padding: "0.5rem 1rem", backgroundColor: "var(--color-white-alpha-20)", backdropFilter: "blur(4px)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}>
            <Camera size={16} /> Edit Cover
          </button>
        </div>

        {/* Profile Info */}
        <div style={{ padding: "0 2rem 2rem 2rem", position: "relative" }}>
          <div style={{ 
            width: "120px", 
            height: "120px", 
            borderRadius: "50%", 
            border: "4px solid white", 
            backgroundColor: "var(--color-blue-500)", 
            marginTop: "-60px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "var(--color-white)",
            position: "relative"
          }}>
            {formData.firstName[0]}{formData.lastName[0]}
            <button style={{ position: "absolute", bottom: "0", right: "0", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--color-white)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-slate-500)" }}>
              <Camera size={14} />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              {!isEditing ? (
                <>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "0.25rem" }}>{formData.firstName} {formData.lastName}</h2>
                  <p style={{ color: "var(--color-slate-500)", fontSize: "0.95rem", marginBottom: "1rem" }}>Professional Event Photographer & Videographer</p>
                  
                  <div style={{ display: "flex", gap: "1.5rem", color: "var(--color-slate-500)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={16} /> San Francisco, CA</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={16} /> {currentUser?.email || "alex@example.com"}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={16} /> {formData.phone}</div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={e => setFormData({...formData, firstName: e.target.value})} 
                      style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} 
                    />
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={e => setFormData({...formData, lastName: e.target.value})} 
                      style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }} 
                    />
                  </div>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0", maxWidth: "200px" }} 
                  />
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-100)", color: "var(--color-slate-900)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => setIsEditing(false)} style={{ padding: "0.6rem 1.25rem", backgroundColor: "var(--color-white)", color: "var(--color-slate-500)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSaveProfile} disabled={isSaving} style={{ padding: "0.6rem 1.25rem", backgroundColor: isSaving ? "#86efac" : "#22c55e", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", fontWeight: "600", cursor: isSaving ? "not-allowed" : "pointer" }}>{isSaving ? "Saving..." : "Save"}</button>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "1rem" }}>About Me</h3>
            <p style={{ color: "var(--color-slate-500)", lineHeight: "1.6", fontSize: "0.95rem" }}>
              With over 10 years of experience in capturing life's most precious moments, I specialize in weddings, corporate events, and large-scale festivals. My approach blends documentary-style candid photography with beautifully orchestrated portraits. I believe that every event has a unique story, and my goal is to document yours authentically and creatively.
            </p>
          </div>

          {/* Business Information */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Briefcase size={20} color="var(--color-blue-500)" /> Business Information
              </h3>
              <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer", fontSize: "0.85rem" }}>
                Save Changes
              </button>
            </div>
            
            <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Business Name</label>
                <input 
                  type="text" 
                  defaultValue="Marcus Photography Services"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@marcusphotography.com"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Business Address</label>
                <textarea 
                  rows="2"
                  defaultValue="123 Creative Studio Ave, Suite 400, San Francisco, CA 94107"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)", resize: "vertical" }}
                />
              </div>
            </form>
          </div>

          {/* Payment Details */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-slate-900)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={20} color="var(--color-green-500)" /> Payment Details
              </h3>
              <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer", fontSize: "0.85rem" }}>
                Save Changes
              </button>
            </div>
            
            <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Payout Method</label>
                <select style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)", cursor: "pointer" }}>
                  <option value="bank">Direct Deposit (Bank Transfer)</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe Connect</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Account Name</label>
                <input 
                  type="text" 
                  defaultValue="Marcus Chen"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
                />
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
