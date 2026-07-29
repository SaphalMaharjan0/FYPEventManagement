import React, { useState, useEffect } from "react";
import { User, Camera, Mail, Phone, MapPin, Edit3, Briefcase, CreditCard, Check, X } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import MapPickerModal from "../../components/common/MapPickerModal";

export default function ProfilePage({ currentUser, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const fetchWithAuth = useFetch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    businessDesc: "",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
    latitude: null,
    longitude: null,
    payoutMethod: "bank",
    payoutAccount: "",
    loginEmail: "",
  });

  useEffect(() => {
    const fullName = currentUser?.fullName || currentUser?.name || "";
    const parts = fullName.split(" ");
    setFormData((prev) => ({
      ...prev,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
      phone: currentUser?.phone || "",
    }));

    const loadVendorProfile = async () => {
      try {
        const vendorData = await fetchWithAuth("/api/vendor/profile");
        if (vendorData) {
          setFormData((prev) => ({
            ...prev,
            businessName: vendorData.businessName || "",
            businessDesc: vendorData.businessDesc || "",
            contactEmail: vendorData.contactEmail || "",
            contactPhone: vendorData.contactPhone || "",
            businessAddress: vendorData.businessAddress || "",
            latitude: vendorData.latitude || null,
            longitude: vendorData.longitude || null,
            payoutMethod: vendorData.payoutMethod || "bank",
            payoutAccount: vendorData.payoutAccount || "",
            loginEmail: vendorData.loginEmail || currentUser?.email || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load vendor profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVendorProfile();
  }, [currentUser, fetchWithAuth]);

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSaveClick = () => {
    setPassword("");
    setShowPasswordModal(true);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!password) {
      alert("Password is required to save changes.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update User profile (name & phone) with password validation
      const updatedUser = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          password: password,
        }),
      });

      // 2. Update Vendor profile
      await fetchWithAuth("/api/vendor/profile", {
        method: "PUT",
        body: JSON.stringify({
          businessName: formData.businessName,
          businessDesc: formData.businessDesc,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          businessAddress: formData.businessAddress,
          latitude: formData.latitude,
          longitude: formData.longitude,
          payoutMethod: formData.payoutMethod,
          payoutAccount: formData.payoutAccount,
          loginEmail: formData.loginEmail,
        }),
      });

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (onUpdateUser) onUpdateUser(updatedUser);
      }
      setIsEditing(false);
      setShowPasswordModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update profile. Please verify your password.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = [formData.firstName[0], formData.lastName ? formData.lastName[0] : ""]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "??";

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    outline: "none",
    color: "#0f172a",
    boxSizing: "border-box",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem" }}>
        <p style={{ color: "#64748b" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>
            My Profile &amp; Business
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Manage your personal details, public profile, and business info.
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.6rem 1.25rem", backgroundColor: "#f1f5f9", color: "#0f172a",
              border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "500", cursor: "pointer",
            }}
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.25rem", backgroundColor: "white", color: "#64748b",
                border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer",
              }}
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                backgroundColor: isSaving ? "#86efac" : "#22c55e",
                color: "white", border: "none", borderRadius: "0.5rem",
                fontWeight: "600", cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              <Check size={16} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "1.5rem" }}>
        {/* Cover */}
        <div style={{ height: "140px", background: "linear-gradient(135deg, #1e3a5f, #3b82f6)", position: "relative" }}>
          <button style={{
            position: "absolute", bottom: "1rem", right: "1rem",
            padding: "0.4rem 0.9rem", backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)", color: "white", border: "none",
            borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
            cursor: "pointer", fontSize: "0.8rem", fontWeight: "500",
          }}>
            <Camera size={14} /> Edit Cover
          </button>
        </div>

        {/* Avatar + name */}
        <div style={{ padding: "0 2rem 2rem 2rem", position: "relative" }}>
          <div style={{
            width: "110px", height: "110px", borderRadius: "50%",
            border: "4px solid white", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            marginTop: "-55px", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.2rem", fontWeight: "bold", color: "white", position: "relative",
          }}>
            {initials}
            {isEditing && (
              <button style={{
                position: "absolute", bottom: 0, right: 0,
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: "white", border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#64748b",
              }}>
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* Personal info view/edit */}
          {!isEditing ? (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.25rem" }}>
                {formData.firstName} {formData.lastName}
              </h2>
              <div style={{ display: "flex", gap: "1.5rem", color: "#64748b", fontSize: "0.85rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Mail size={15} /> {formData.loginEmail || currentUser?.email || "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Phone size={15} /> {formData.phone || "Not provided"}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "480px" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "0.3rem" }}>First Name</label>
                  <input type="text" style={inputStyle} value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "0.3rem" }}>Last Name</label>
                  <input type="text" style={inputStyle} value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "0.3rem" }}>Phone</label>
                  <input type="tel" style={inputStyle} value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +977-98XXXXXXXX" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "0.3rem" }}>Login Email</label>
                  <input type="email" style={inputStyle} value={formData.loginEmail}
                    onChange={(e) => setFormData({ ...formData, loginEmail: e.target.value })}
                    placeholder="Login email" />
                </div>
              </div>
            </div>
          )}

          {/* Business Information */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Briefcase size={18} color="#3b82f6" /> Business Information
            </h3>
            <div className="dashboard-grid-equal">
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Business Name</label>
                {isEditing ? (
                  <input type="text" style={inputStyle} value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.businessName || "—"}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Contact Email</label>
                {isEditing ? (
                  <input type="email" style={inputStyle} value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.contactEmail || "—"}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Contact Phone</label>
                {isEditing ? (
                  <input type="tel" style={inputStyle} value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.contactPhone || "—"}
                  </div>
                )}
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Business Address</label>
                {isEditing ? (
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <textarea rows="2" style={{ ...inputStyle, flex: 1, resize: "vertical" }} value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })} />
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.75rem 1.25rem", backgroundColor: "#0f172a",
                        color: "white", border: "none", borderRadius: "0.5rem",
                        fontWeight: "600", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <MapPin size={16} /> Map
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.businessAddress || "—"}
                  </div>
                )}
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Business Description</label>
                {isEditing ? (
                  <textarea rows="3" style={{ ...inputStyle, resize: "vertical" }} value={formData.businessDesc}
                    onChange={(e) => setFormData({ ...formData, businessDesc: e.target.value })} />
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a", lineHeight: "1.6" }}>
                    {formData.businessDesc || "No description yet."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <CreditCard size={18} color="#22c55e" /> Payment Details
            </h3>
            <div className="dashboard-grid-equal">
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Payout Method</label>
                {isEditing ? (
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={formData.payoutMethod}
                    onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}>
                    <option value="bank">Direct Deposit (Bank Transfer)</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe Connect</option>
                    <option value="esewa">eSewa</option>
                  </select>
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.payoutMethod === "bank" ? "Direct Deposit (Bank Transfer)"
                      : formData.payoutMethod === "paypal" ? "PayPal"
                      : formData.payoutMethod === "esewa" ? "eSewa"
                      : formData.payoutMethod || "—"}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "0.4rem" }}>Account / Number</label>
                {isEditing ? (
                  <input type="text" style={inputStyle} value={formData.payoutAccount}
                    onChange={(e) => setFormData({ ...formData, payoutAccount: e.target.value })}
                    placeholder="Bank account / email / number" />
                ) : (
                  <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", fontSize: "0.95rem", color: "#0f172a" }}>
                    {formData.payoutAccount || "—"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "0.75rem",
            padding: "2rem", width: "400px", maxWidth: "90%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>
              Confirm Password
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Please enter your current password to verify your identity and save profile updates.
            </p>
            <form onSubmit={handleSaveProfile}>
              <input 
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                style={{
                  width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem", fontSize: "0.9rem", color: "#0f172a",
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
                    borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer"
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
                    borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.85rem",
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

      <MapPickerModal 
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        initialLocation={formData.businessAddress}
        onSelectLocation={(loc, coords) => setFormData({ ...formData, businessAddress: loc, latitude: coords?.lat, longitude: coords?.lng })}
      />
    </div>
  );
}
