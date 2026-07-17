import React, { useState } from "react";
import { User, Store, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm({ onNavigateToLogin, onRegisterSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("customer"); // 'customer' or 'vendor'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all form fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        role
      });
      setSuccess("Account creation was successful! Redirecting to login...");
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Create your account</h3>
        <p className="auth-form-subtitle">Join 500,000+ event lovers on EventPulse</p>
      </div>

      {error && (
        <div style={{ color: "var(--color-red-500)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-red-50)", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: "var(--color-green-700)", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "var(--color-green-50)", border: "1px solid #86efac", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {success}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Name Fields Grid Row */}
        <div className="form-row-grid">
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Morgan"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

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

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-slate-500)",
                display: "flex",
                alignItems: "center"
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-slate-500)",
                display: "flex",
                alignItems: "center"
              }}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Role Selector Card Group */}
        <div className="form-selector-group">
          <label>I am a</label>
          <div className="form-selectors">
            <button
              type="button"
              className={`selector-btn ${role === "customer" ? "active" : ""}`}
              onClick={() => setRole("customer")}
            >
              <User size={16} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              className={`selector-btn ${role === "vendor" ? "active" : ""}`}
              onClick={() => setRole("vendor")}
            >
              <Store size={16} />
              <span>Vendor</span>
            </button>
          </div>
        </div>

        {/* Agreements text */}
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.5, margin: "0.25rem 0" }}>
          I agree to the <span className="form-link">Terms of Service</span> and <span className="form-link">Privacy Policy</span>
        </p>

        {/* Action Button */}
        <button type="submit" className="btn-auth-submit">
          Create Account
        </button>
      </form>

      {/* Form Footer */}
      <p className="auth-footer-text">
        Already have an account?{" "}
        <span className="form-link" onClick={onNavigateToLogin}>
          Sign in
        </span>
      </p>
    </>
  );
}
