import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";

export default function EsewaFailurePage({ onNavigate }) {
  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", backgroundColor: "var(--color-white)", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
        <XCircle size={40} />
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Payment Failed</h1>
      <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem", fontSize: "1.1rem" }}>
        Your payment could not be processed. This may happen if you cancelled the transaction or if there was an issue with eSewa.
      </p>
      
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button 
          onClick={() => onNavigate("events")}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-slate-200)", color: "var(--color-slate-700)", borderRadius: "0.5rem", border: "none", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={18} />
          Return to Events
        </button>
      </div>
    </div>
  );
}
