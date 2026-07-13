import React, { useState } from "react";
import { User, Store } from "lucide-react";

export default function RegisterForm({ onNavigateToLogin, onRegisterSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer"); // 'customer' or 'vendor'
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

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

    // Success register
    onRegisterSuccess({
      firstName,
      lastName,
      email,
      role
    });
  };

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Create your account</h3>
        <p className="auth-form-subtitle">Join 500,000+ event lovers on EventPulse</p>
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
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
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
