import React from "react";
import { User, Camera, Mail, Phone, MapPin, Edit3, Briefcase, CreditCard } from "lucide-react";

export default function ProfilePage({ currentUser }) {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>My Profile & Business</h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your personal details, public profile, and business info.</p>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
        {/* Cover Photo Area */}
        <div style={{ height: "150px", backgroundColor: "#1e293b", position: "relative" }}>
          <button style={{ position: "absolute", bottom: "1rem", right: "1rem", padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "white", border: "none", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: "500" }}>
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
            backgroundColor: "#3b82f6", 
            marginTop: "-60px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "white",
            position: "relative"
          }}>
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'MC'}
            <button style={{ position: "absolute", bottom: "0", right: "0", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
              <Camera size={14} />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>{currentUser?.name || "Marcus Chen"}</h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "1rem" }}>Professional Event Photographer & Videographer</p>
              
              <div style={{ display: "flex", gap: "1.5rem", color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={16} /> San Francisco, CA</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={16} /> {currentUser?.email || "alex@example.com"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Phone size={16} /> (555) 123-4567</div>
              </div>
            </div>
            
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer" }}>
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#0f172a", marginBottom: "1rem" }}>About Me</h3>
            <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "0.95rem" }}>
              With over 10 years of experience in capturing life's most precious moments, I specialize in weddings, corporate events, and large-scale festivals. My approach blends documentary-style candid photography with beautifully orchestrated portraits. I believe that every event has a unique story, and my goal is to document yours authentically and creatively.
            </p>
          </div>

          {/* Business Information */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Briefcase size={20} color="#3b82f6" /> Business Information
              </h3>
              <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer", fontSize: "0.85rem" }}>
                Save Changes
              </button>
            </div>
            
            <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Business Name</label>
                <input 
                  type="text" 
                  defaultValue="Marcus Photography Services"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@marcusphotography.com"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Business Address</label>
                <textarea 
                  rows="2"
                  defaultValue="123 Creative Studio Ave, Suite 400, San Francisco, CA 94107"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a", resize: "vertical" }}
                />
              </div>
            </form>
          </div>

          {/* Payment Details */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={20} color="#10b981" /> Payment Details
              </h3>
              <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer", fontSize: "0.85rem" }}>
                Save Changes
              </button>
            </div>
            
            <form style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Payout Method</label>
                <select style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a", cursor: "pointer" }}>
                  <option value="bank">Direct Deposit (Bank Transfer)</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe Connect</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Account Name</label>
                <input 
                  type="text" 
                  defaultValue="Marcus Chen"
                  style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "#0f172a" }}
                />
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
