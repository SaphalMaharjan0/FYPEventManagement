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

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Reset password</h3>
        <p className="auth-form-subtitle">We'll send a reset link to your email</p>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-500)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-red-50)", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button type="submit" className="btn-auth-submit">
          Send Reset Link
        </button>
      </form>

      {/* What Happens Next Info Box */}
      <div className="info-banner">
        <span className="info-banner-title">What happens next?</span>
        Check your email for a secure reset link. The link expires in 30 minutes.
      </div>

      {/* Back to Login Anchor */}
      <div className="auth-footer-text" style={{ marginTop: "2rem" }}>
        <span 
          className="form-link" 
          onClick={onNavigateToLogin}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to login</span>
        </span>
      </div>
    </>
  );
}
