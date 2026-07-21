import React, { useState } from "react";
import { ArrowLeft, Calendar, KeyRound, CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm({
  onNavigateToLogin,
  onResetSuccess,
  isDarkMode = false,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitted(true);
      if (onResetSuccess) {
        onResetSuccess(email);
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Adaptive Inline Styles
  const pageContainerStyle = {
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-body-alt)",
    fontFamily: "var(--font-body)",
    color: "var(--text-main)",
    padding: "3rem 1.25rem",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const cardStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "540px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-main)",
    borderRadius: "var(--radius-md)",
    padding: "3.75rem 2.75rem 3rem 2.75rem",
    boxShadow: "var(--shadow-md)",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem",
    backgroundColor: "var(--bg-body-alt)",
    border: "1px solid var(--border-input)",
    borderRadius: "var(--radius-sm)",
    fontSize: "1rem",
    color: "var(--text-main)",
    outline: "none",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--text-main)",
    marginBottom: "0.5rem",
  };

  const linkStyle = {
    color: "var(--primary)",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "none",
    padding: 0,
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        {/* Back to Login Button (Inside Top-Left of Card) */}
        <button
          type="button"
          onClick={onNavigateToLogin}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "none",
            color: "var(--text-subtle)",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
            padding: "0.35rem 0.5rem",
            borderRadius: "var(--radius-sm)",
            transition: "var(--transition-fast)",
          }}
        >
          <ArrowLeft size={18} />
          Back to login
        </button>

        {/* Branding Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.65rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ color: "var(--primary)" }}>
            <Calendar size={32} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: "700",
              color: "var(--text-main)",
            }}
          >
            EventPulse
          </span>
        </div>

        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.85rem",
              fontWeight: "700",
              margin: "0 0 0.4rem 0",
              color: "var(--text-main)",
            }}
          >
            Reset password
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              color: "var(--text-subtle)",
            }}
          >
            We'll send a password reset link to your email
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            style={{
              color: isDarkMode ? "#f87171" : "#b91c1c",
              fontSize: "0.95rem",
              fontWeight: "600",
              backgroundColor: isDarkMode
                ? "rgba(239, 68, 68, 0.15)"
                : "#fef2f2",
              border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.3)" : "#fee2e2"}`,
              padding: "0.9rem 1rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1.5rem",
              lineHeight: "1.4",
            }}
          >
            {error}
          </div>
        )}

        {/* Confirmation Screen on Success */}
        {isSubmitted ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                display: "inline-flex",
                padding: "1rem",
                borderRadius: "50%",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                marginBottom: "1.25rem",
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h4
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                margin: "0 0 0.5rem 0",
                color: "var(--text-main)",
              }}
            >
              Check your inbox
            </h4>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-subtle)",
                lineHeight: "1.5",
                marginBottom: "2rem",
              }}
            >
              We sent a reset link to <strong>{email}</strong>. Please check
              your spam folder if it doesn't appear shortly.
            </p>
            <button
              type="button"
              onClick={onNavigateToLogin}
              style={{
                width: "100%",
                padding: "0.9rem",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "1.05rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          /* Main Reset Password Form */
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.9rem",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "1.05rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "0.5rem",
                transition: "var(--transition-fast)",
              }}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            {/* Information Banner */}
            <div
              style={{
                marginTop: "0.5rem",
                padding: "1rem",
                backgroundColor: "var(--bg-body-alt)",
                border: "1px solid var(--border-main)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                lineHeight: "1.5",
                color: "var(--text-subtle)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  color: "var(--text-main)",
                  marginBottom: "0.25rem",
                }}
              >
                What happens next?
              </strong>
              Check your email for a secure reset link. The link expires in 30
              minutes.
            </div>
          </form>
        )}

        {/* Footer Redirect Link */}
        <p
          style={{
            marginTop: "2rem",
            marginBottom: 0,
            textAlign: "center",
            fontSize: "0.95rem",
            color: "var(--text-subtle)",
          }}
        >
          Remembered your password?{" "}
          <button type="button" onClick={onNavigateToLogin} style={linkStyle}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
