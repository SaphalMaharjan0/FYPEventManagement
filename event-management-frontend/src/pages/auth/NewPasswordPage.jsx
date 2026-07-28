import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function NewPasswordPage({ onNavigateToLogin }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Failed to reset password. The token may be invalid or expired.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
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

  const buttonStyle = {
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
  };

  const backButtonStyle = {
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
  };

  if (!token) {
    return (
      <div style={{ textAlign: "left", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Invalid Link</h3>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>The password reset link is invalid or missing the token.</p>
        <button type="button" onClick={onNavigateToLogin} style={backButtonStyle}>
          <ArrowLeft size={16} />
          <span>Back to login</span>
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--color-primary-600)" }}>
          <CheckCircle size={48} />
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Password Reset</h3>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>Your password has been successfully reset.</p>
        <button onClick={onNavigateToLogin} style={buttonStyle}>
          Continue to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Set New Password</h3>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#64748b" }}>Please enter your new password below.</p>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-500)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-red-50)", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <label htmlFor="password" style={labelStyle}>New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ ...inputStyle, paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "35px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-subtle)",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <label htmlFor="confirmPassword" style={labelStyle}>Confirm New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            style={{ ...inputStyle, paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "35px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-subtle)",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" style={{ ...buttonStyle, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <button type="button" onClick={onNavigateToLogin} style={backButtonStyle}>
        <ArrowLeft size={16} />
        <span>Back to login</span>
      </button>
    </>
  );
}
