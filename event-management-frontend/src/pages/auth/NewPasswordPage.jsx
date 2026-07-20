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

  if (!token) {
    return (
      <div className="auth-form-header">
        <h3 className="auth-form-title">Invalid Link</h3>
        <p className="auth-form-subtitle">The password reset link is invalid or missing the token.</p>
        <div className="auth-footer-text" style={{ marginTop: "2rem" }}>
          <span className="form-link" onClick={onNavigateToLogin} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-form-header">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--color-primary-600)" }}>
          <CheckCircle size={48} />
        </div>
        <h3 className="auth-form-title">Password Reset</h3>
        <p className="auth-form-subtitle">Your password has been successfully reset.</p>
        <button className="btn-auth-submit" onClick={onNavigateToLogin} style={{ marginTop: "2rem" }}>
          Continue to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Set New Password</h3>
        <p className="auth-form-subtitle">Please enter your new password below.</p>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-500)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-red-50)", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group" style={{ position: "relative" }}>
          <label htmlFor="password">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "2.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "2.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" className="btn-auth-submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

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
