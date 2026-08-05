import React from "react";
import { useSearchParams } from "react-router-dom";

export default function MockKhaltiPage() {
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const amount = searchParams.get("amount");
  
  const handleSuccess = () => {
    // In a real scenario, Khalti redirects back to the merchant's success URL.
    window.location.href = `/customer/khalti-success?pidx=${pidx}&amount=${amount}`;
  };

  const handleFailure = () => {
    window.location.href = `/customer/events`; // Back to events or a failure page
  };

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center", border: "1px solid #e2e8f0", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg" alt="Khalti Mock" style={{ height: "60px", marginBottom: "2rem" }} />
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Khalti Sandbox Payment</h1>
      <p style={{ marginBottom: "2rem", color: "var(--color-slate-600)" }}>
        You are about to make a mock payment of Rs. {amount}. <br />
        This is for testing purposes only. No real money will be deducted.
      </p>
      
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button 
          onClick={handleSuccess}
          style={{ padding: "0.75rem 2rem", backgroundColor: "#5c2d91", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "bold" }}
        >
          Pay Rs. {amount}
        </button>
        <button 
          onClick={handleFailure}
          style={{ padding: "0.75rem 2rem", backgroundColor: "var(--color-slate-200)", color: "var(--color-slate-700)", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "bold" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
