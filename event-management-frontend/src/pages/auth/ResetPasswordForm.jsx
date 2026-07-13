import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ResetPasswordForm({ onNavigateToLogin, onResetSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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

    onResetSuccess(email);
  };

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Reset password</h3>
        <p className="auth-form-subtitle">We'll send a reset link to your email</p>
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
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
