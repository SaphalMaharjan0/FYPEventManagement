import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function MockEsewaPage() {
  const [searchParams] = useSearchParams();
  const transactionUuid = searchParams.get("transaction_uuid");
  const amount = searchParams.get("amount");
  const successUrlStr = searchParams.get("success_url");
  const failureUrlStr = searchParams.get("failure_url");

  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      // Build eSewa format response JSON
      const responseObj = {
        transaction_uuid: transactionUuid,
        status: "COMPLETE",
        total_amount: amount,
        transaction_code: "TXN-" + Math.floor(Math.random() * 10000000)
      };

      // Base64 encode the response
      const base64Data = btoa(JSON.stringify(responseObj));
      
      // Redirect to the success url with the encoded data
      // e.g. successUrl is "http://localhost:5173/customer/esewa-success"
      window.location.href = `${successUrlStr}?data=${base64Data}`;
    }, 1500);
  };

  const handleCancel = () => {
    // Redirect to failure/cancel url
    window.location.href = failureUrlStr;
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f5f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        width: "480px",
        maxWidth: "95vw",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
      }}>
        {/* Top Banner (eSewa Green Theme) */}
        <div style={{
          backgroundColor: "#60bb46",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "white"
        }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.25rem 0" }}>eSewa ePay</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "0.85rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Local Testing Sandbox
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "2rem 1.5rem" }}>
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            border: "1px solid #e2e8f0",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>Merchant / Product Code</span>
              <span style={{ color: "#0f172a", fontSize: "0.85rem", fontWeight: "600" }}>EPAYTEST</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>Transaction Ref</span>
              <span style={{ color: "#0f172a", fontSize: "0.85rem", fontWeight: "600", fontFamily: "monospace" }}>{transactionUuid?.substring(0, 8)}...</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0" }}>
              <span style={{ color: "#0f172a", fontWeight: "700" }}>Total Amount</span>
              <span style={{ color: "#60bb46", fontWeight: "800", fontSize: "1.1rem" }}>Rs. {amount}</span>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#ecfdf5",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            fontWeight: "500",
            marginBottom: "2rem",
            lineHeight: "1.4"
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>eSewa Sandbox Simulator: Click <strong>Pay Now</strong> to simulate a successful payment locally.</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={handlePay}
              disabled={paying}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: paying ? "#8cd977" : "#60bb46",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: paying ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {paying ? "Processing Payment..." : "Pay Now"}
            </button>
            <button
              onClick={handleCancel}
              disabled={paying}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "transparent",
                color: "#ef4444",
                border: "1px solid #fee2e2",
                borderRadius: "0.5rem",
                fontWeight: "600",
                fontSize: "0.95rem",
                cursor: paying ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
