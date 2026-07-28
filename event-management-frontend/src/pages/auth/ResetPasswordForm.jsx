import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordForm({ onNavigateToLogin, onResetSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        onResetSuccess(email);
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    color: "var(--text-main)",
    outline: "none",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--text-main)",
    marginBottom: "0.35rem",
  };

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "#0f172a" }}>
          Reset password
        </h3>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>
          We'll send a reset link to your email
        </p>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-500)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-red-50)", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Email Field */}
        <div>
          <label htmlFor="email" style={labelStyle}>Email address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "1rem",
            transition: "var(--transition-fast)",
          }}
        >
          Send Reset Link
        </button>
      </form>

      {/* What Happens Next Info Box */}
      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
        <div style={{ fontWeight: "600", color: "#0f172a", marginBottom: "0.25rem" }}>What happens next?</div>
        Check your email for a secure reset link. The link expires in 30 minutes.
      </div>

      {/* Back to Login Anchor */}
      <button
        type="button"
        onClick={onNavigateToLogin}
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "none",
          border: "none",
          color: "var(--text-subtle)",
          fontSize: "0.875rem",
          fontWeight: "600",
          cursor: "pointer",
          padding: "0",
          marginTop: "2rem",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to login</span>
      </button>
    </>
  );
}
