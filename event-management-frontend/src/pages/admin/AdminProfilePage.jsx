import React, { useState } from "react";
import { User, Mail, Phone, Shield, Camera, Edit2, Check, X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function AdminProfilePage({ currentUser }) {
  const fetchWithAuth = useFetch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fullName = currentUser?.fullName || currentUser?.name || "Admin";
  const nameParts = fullName.split(" ");

  const [formData, setFormData] = useState({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    profilePicture: currentUser?.profilePicture || "",
  });

  const initials = [formData.firstName[0], formData.lastName[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "AD";

  const handleSaveClick = () => {
    setPassword("");
    setShowPasswordModal(true);
  };

  const handleConfirmSave = async (e) => {
    if (e) e.preventDefault();
    if (!password) {
      alert("Password is required to save changes.");
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          profilePicture: formData.profilePicture,
          password: password,
        }),
      });
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setIsEditing(false);
      setShowPasswordModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Failed to update profile. Please verify your password.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  };

  const readStyle = {
    padding: "0.75rem",
    backgroundColor: "#f8fafc",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: "1px solid #f1f5f9",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.4rem",
    display: "block",
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>
            My Profile
          </h1>
          <p style={{ color: "#64748b" }}>Manage your administrator account details.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem", backgroundColor: "#3b82f6", color: "white",
              border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
            }}
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.25rem", backgroundColor: "white", color: "#64748b",
                border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
              }}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.25rem", backgroundColor: isSaving ? "#86efac" : "#22c55e", color: "white",
                border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem",
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              <Check size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Avatar card */}
        <div style={{
          backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
          padding: "2rem", display: "flex", alignItems: "center", gap: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ position: "relative" }}>
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }} />
            ) : (
              <div style={{
                width: "96px", height: "96px", borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.2rem", fontWeight: "bold", letterSpacing: "1px",
              }}>
                {initials}
              </div>
            )}
            {isEditing && (
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: "white", border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#64748b", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 10, overflow: "hidden"
              }}>
                <input type="file" accept="image/*" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} onChange={handleImageUpload} />
                <Camera size={14} />
              </div>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>
              {formData.firstName} {formData.lastName}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={14} color="#3b82f6" />
              <span style={{ color: "#3b82f6", fontSize: "0.85rem", fontWeight: "600", textTransform: "capitalize" }}>
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div style={{
          backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
          padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1.5rem" }}>
            Personal Information
          </h3>
          <div className="dashboard-grid-equal">

            <div>
              <label style={labelStyle}>First Name</label>
              {isEditing ? (
                <input type="text" style={inputStyle} value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              ) : (
                <div style={readStyle}><User size={15} color="#94a3b8" />{formData.firstName}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              {isEditing ? (
                <input type="text" style={inputStyle} value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              ) : (
                <div style={readStyle}><User size={15} color="#94a3b8" />{formData.lastName || "—"}</div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={readStyle}><Mail size={15} color="#94a3b8" />{formData.email}</div>
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              {isEditing ? (
                <input type="tel" style={inputStyle} value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +977-98XXXXXXXX" />
              ) : (
                <div style={readStyle}><Phone size={15} color="#94a3b8" />{formData.phone || "Not provided"}</div>
              )}
            </div>

          </div>
        </div>

        {/* Security card */}
        <div style={{
          backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
          padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>
            Security
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            Manage your password and account security settings.
          </p>
          <button style={{
            padding: "0.6rem 1.25rem", backgroundColor: "#f8fafc", color: "#374151",
            border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
          }}>
            Change Password
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "12px",
            padding: "2rem", width: "400px", maxWidth: "90%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>
              Confirm Password
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Please enter your current password to verify your identity and save profile updates.
            </p>
            <form onSubmit={handleConfirmSave}>
              <input 
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                style={{
                  width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1",
                  borderRadius: "8px", fontSize: "0.9rem", color: "#0f172a",
                  outline: "none", boxSizing: "border-box", marginBottom: "1.5rem"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: "0.5rem 1rem", backgroundColor: "white",
                    color: "#64748b", border: "1px solid #e2e8f0",
                    borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: "0.5rem 1.25rem", backgroundColor: "#3b82f6",
                    color: "white", border: "none",
                    borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem",
                    cursor: isSaving ? "not-allowed" : "pointer"
                  }}
                >
                  {isSaving ? "Saving..." : "Verify & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
