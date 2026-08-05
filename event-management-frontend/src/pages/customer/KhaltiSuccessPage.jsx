import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, X, Loader } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";

export default function KhaltiSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetchWithAuth = useFetch();
  
  const [status, setStatus] = useState("verifying"); // verifying, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = searchParams.get("pidx");
      const amount = searchParams.get("amount");
      
      if (!pidx || !amount) {
        setStatus("failed");
        return;
      }

      try {
        const response = await fetchWithAuth(`/api/customer/bookings/khalti-callback?pidx=${pidx}&amount=${amount}`);
        if (response && response.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, fetchWithAuth]);

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center", backgroundColor: "var(--color-white)", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      {status === "verifying" && (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Loader size={48} color="#5c2d91" style={{ animation: "spin 1s linear infinite" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Verifying Payment...</h1>
          <p style={{ color: "var(--color-slate-500)" }}>Please wait while we confirm your Khalti transaction.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Check size={40} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Payment Successful!</h1>
          <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem" }}>Your booking has been confirmed via Khalti.</p>
          <button 
            onClick={() => navigate("/customer/bookings")}
            style={{ width: "100%", padding: "1rem", backgroundColor: "#5c2d91", color: "white", borderRadius: "0.5rem", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            View My Bookings
          </button>
        </>
      )}

      {status === "failed" && (
        <>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <X size={40} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-slate-900)", marginBottom: "1rem" }}>Payment Failed</h1>
          <p style={{ color: "var(--color-slate-500)", marginBottom: "2rem" }}>We could not verify your Khalti payment. If money was deducted, please contact support.</p>
          <button 
            onClick={() => navigate("/customer/events")}
            style={{ width: "100%", padding: "1rem", backgroundColor: "var(--color-slate-200)", color: "var(--color-slate-700)", borderRadius: "0.5rem", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            Return to Events
          </button>
        </>
      )}
    </div>
  );
}
