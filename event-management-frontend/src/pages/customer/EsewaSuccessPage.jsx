import React, { useEffect, useState } from "react";
import { Check, XCircle } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function EsewaSuccessPage({ onNavigate }) {
  const fetchWithAuth = useFetch();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get("data");

    if (!data) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetchWithAuth(`/api/customer/bookings/esewa-callback?data=${data}`);
        if (response.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [fetchWithAuth]);

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", backgroundColor: "var(--color-white)", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "center" }}>
      {status === "verifying" && (
        <>
          <div className="spinner" style={{ margin: "0 auto 1.5rem", width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid var(--color-blue-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-slate-900)" }}>Verifying Payment...</h1>
          <p style={{ color: "var(--color-slate-500)", marginTop: "1rem" }}>Please wait while we verify your transaction with eSewa.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Check size={40} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Booking Confirmed!</h1>
          <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem", fontSize: "1.1rem" }}>
            Your payment was successful and your tickets have been reserved.
          </p>
          <button 
            onClick={() => onNavigate("customer-bookings")}
            style={{ width: "100%", padding: "1rem", backgroundColor: "var(--color-blue-500)", color: "var(--color-white)", borderRadius: "0.5rem", border: "none", fontWeight: "600", fontSize: "1rem", cursor: "pointer" }}
          >
            View My Bookings
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <XCircle size={40} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Payment Verification Failed</h1>
          <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem" }}>
            We could not verify your payment. If money was deducted, please contact support.
          </p>
          <button 
            onClick={() => onNavigate("events")}
            style={{ padding: "0.75rem 1.5rem", backgroundColor: "var(--color-slate-200)", color: "var(--color-slate-700)", borderRadius: "0.5rem", border: "none", fontWeight: "600", cursor: "pointer" }}
          >
            Return to Dashboard
          </button>
        </>
      )}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
