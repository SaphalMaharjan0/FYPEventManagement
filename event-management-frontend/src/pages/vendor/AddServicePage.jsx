import React from "react";
import { Package } from "lucide-react";

export default function AddServicePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "2rem" }}>Add New Service</h1>

      <div style={{ backgroundColor: "var(--color-white)", padding: "2rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={(e) => e.preventDefault()}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Service Title</label>
            <input 
              type="text" 
              placeholder="e.g. Professional Event Photography" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-slate-50)",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "var(--color-slate-900)"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Category</label>
            <input 
              type="text" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-slate-50)",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "var(--color-slate-900)"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Price</label>
            <input 
              type="text" 
              placeholder="e.g. $800/event or $45/person" 
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-slate-50)",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "var(--color-slate-900)"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "var(--color-slate-900)", marginBottom: "0.5rem" }}>Description</label>
            <textarea 
              placeholder="Describe your service in detail..." 
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-slate-50)",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "var(--color-slate-900)",
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
            color: "var(--color-slate-500)",
            cursor: "pointer",
            backgroundColor: "var(--color-slate-50)"
          }}>
            <Package size={32} color="var(--color-slate-400)" style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: "0.95rem" }}>Drop service images here or <span style={{ color: "var(--color-blue-500)" }}>browse</span></p>
          </div>

          <button 
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "var(--color-blue-500)",
              color: "var(--color-white)",
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
