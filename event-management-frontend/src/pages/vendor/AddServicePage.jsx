import React from "react";
import { Package } from "lucide-react";

export default function AddServicePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#0f172a", marginBottom: "2rem" }}>Add New Service</h1>

      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={(e) => e.preventDefault()}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Service Title</label>
            <input 
              type="text" 
              placeholder="e.g. Professional Event Photography" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "#0f172a"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Category</label>
            <input 
              type="text" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "#0f172a"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Price</label>
            <input 
              type="text" 
              placeholder="e.g. $800/event or $45/person" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "#0f172a"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#0f172a", marginBottom: "0.5rem" }}>Description</label>
            <textarea 
              placeholder="Describe your service in detail..." 
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "#0f172a",
                resize: "vertical"
              }}
            ></textarea>
          </div>

          {/* Image Upload Dropzone */}
          <div style={{ 
            border: "2px dashed #cbd5e1", 
            borderRadius: "0.5rem", 
            padding: "3rem", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#64748b",
            cursor: "pointer",
            backgroundColor: "#f8fafc"
          }}>
            <Package size={32} color="#94a3b8" style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: "0.95rem" }}>Drop service images here or <span style={{ color: "#3b82f6" }}>browse</span></p>
          </div>

          <button 
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            Publish Service
          </button>
        </form>
      </div>
    </div>
  );
}
