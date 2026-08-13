import React, { useState, useEffect } from "react";
import { Package, Image as ImageIcon } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

export default function AddServicePage() {
  const fetchWithAuth = useFetch();
  const navigate = useNavigate();
  const { currency } = useSettings();
  
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    price: "",
    region: "",
    description: "",
    imageUrl: "" // Will hold the Base64 string
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const vendorData = await fetchWithAuth("/api/vendor/profile");
        setIsVerified(vendorData?.isVerified || false);
      } catch (err) {
        setIsVerified(false);
      }
    };
    checkVerification();
  }, [fetchWithAuth]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
        setError("");
      };
      reader.onerror = () => {
        setError("Failed to read the file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Ensure price is a number
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (isNaN(payload.price)) {
        throw new Error("Price must be a valid number");
      }

      await fetchWithAuth("/api/vendor/services", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      // Navigate back on success
      navigate("/vendor/services");
    } catch (err) {
      setError(err.message || "Failed to publish service");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerified === null) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Checking verification status...</div>;
  }

  if (isVerified === false) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem", textAlign: "center", backgroundColor: "var(--color-white)", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Action Required</h2>
        <p style={{ color: "var(--color-slate-600)", marginBottom: "1.5rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 2rem" }}>
          You must be approved by an administrator before you can add services. Please complete your profile and upload the necessary business documents for verification.
        </p>
        <button 
          onClick={() => navigate("/vendor/profile")}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "2rem" }}>Add New Service</h1>

      <div style={{ backgroundColor: "var(--color-white)", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {error && (
          <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSubmit}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Service Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Professional Event Photography" 
              value={formData.serviceName}
              onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Category</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Photography, Catering..."
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Region / City (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. New York, Kathmandu (Defaults to your business address)"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Price ({currency})</label>
            <input 
              type="number" 
              step="0.01"
              required
              placeholder="e.g. 800" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Description</label>
            <textarea 
              placeholder="Describe your service in detail..." 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: "100%", padding: "0.75rem 1rem", backgroundColor: "var(--color-slate-50)", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.95rem", outline: "none", color: "var(--color-slate-900)", resize: "vertical" }}
            ></textarea>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Service Image</label>
            <label style={{ 
              border: "2px dashed #cbd5e1", 
              borderRadius: "0.5rem", 
              padding: "2rem", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--color-slate-500)",
              cursor: "pointer",
              backgroundColor: "var(--color-slate-50)",
              position: "relative",
              overflow: "hidden"
            }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                  <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "rgba(255,255,255,0.8)", padding: "1rem", borderRadius: "0.5rem" }}>
                    <ImageIcon size={32} color="var(--color-blue-500)" style={{ marginBottom: "0.5rem" }} />
                    <p style={{ fontWeight: 600, color: "var(--color-slate-900)" }}>Change Image</p>
                  </div>
                </>
              ) : (
                <>
                  <Package size={32} color="var(--color-slate-400)" style={{ marginBottom: "1rem" }} />
                  <p style={{ fontSize: "0.95rem" }}>Click to select a service image (Max 2MB)</p>
                </>
              )}
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "var(--color-blue-500)",
              color: "var(--color-white)",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              marginTop: "1rem",
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? "Publishing..." : "Publish Service"}
          </button>
        </form>
      </div>
    </div>
  );
}
