import React, { useState } from "react";
import {
  User,
  Store,
  Eye,
  EyeOff,
  Calendar,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm({
  onNavigateToLogin,
  onRegisterSuccess,
  onNavigateHome,
  isDarkMode = false,
}) {
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
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
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

    setLoading(true);

    try {
      const registeredUser = await register({
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        role,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      if (onRegisterSuccess) {
        onRegisterSuccess(registeredUser);
      }
      setTimeout(() => {
        onNavigateToLogin();
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Adaptive Compact Inline Styles
  const pageContainerStyle = {
    width: "100%",
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    fontFamily: "var(--font-body)",
    color: "var(--text-main)",
    padding: "0",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const cardStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "0",
    padding: "0",
    boxShadow: "none",
    boxSizing: "border-box",
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

  const linkStyle = {
    color: "var(--primary)",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    background: "none",
    border: "none",
    padding: 0,
  };

  const roleButtonStyle = (isActive) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.6rem",
    borderRadius: "var(--radius-sm)",
    border: isActive
      ? "2px solid var(--primary)"
      : "1px solid var(--border-input)",
    backgroundColor: isActive
      ? "rgba(var(--primary-rgb, 59, 130, 246), 0.1)"
      : "var(--bg-body-alt)",
    color: isActive ? "var(--primary)" : "var(--text-subtle)",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "var(--transition-fast)",
  });

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        {/* Back Navigation Button */}
        <button
          type="button"
          onClick={onNavigateHome || onNavigateToLogin}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "none",
            border: "none",
            color: "var(--text-subtle)",
            fontSize: "0.8rem",
            fontWeight: "600",
            cursor: "pointer",
            padding: "0",
            marginBottom: "2rem",
            borderRadius: "var(--radius-sm)",
            transition: "var(--transition-fast)",
          }}
        >
          <ArrowLeft size={16} />
          {onNavigateHome ? "Back to Home" : "Back to Login"}
        </button>

        {/* Header Title */}
        <div style={{ textAlign: "left", marginBottom: "2rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: "800",
              margin: "0 0 0.5rem 0",
              color: "#0f172a",
            }}
          >
            Create your account
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#64748b",
            }}
          >
            Join 500,000+ event lovers on EventPulse
          </p>
        </div>

        {/* Error Messaging Alert */}
        {error && (
          <div
            style={{
              color: isDarkMode ? "#f87171" : "#b91c1c",
              fontSize: "0.85rem",
              fontWeight: "600",
              backgroundColor: isDarkMode
                ? "rgba(239, 68, 68, 0.15)"
                : "#fef2f2",
              border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.3)" : "#fee2e2"}`,
              padding: "0.65rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1rem",
              lineHeight: "1.35",
            }}
          >
            {error}
          </div>
        )}

        {/* Success Messaging Alert */}
        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: isDarkMode ? "#34d399" : "#047857",
              fontSize: "0.85rem",
              fontWeight: "600",
              backgroundColor: isDarkMode
                ? "rgba(16, 185, 129, 0.15)"
                : "#ecfdf5",
              border: `1px solid ${isDarkMode ? "rgba(16, 185, 129, 0.3)" : "#a7f3d0"}`,
              padding: "0.65rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1rem",
              lineHeight: "1.35",
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Main Registration Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
        >
          {/* First Name & Last Name Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div>
              <label htmlFor="firstName" style={labelStyle}>
                First name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="lastName" style={labelStyle}>
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Morgan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "40px" }}
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
                  color: "var(--text-subtle)",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm password
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "40px" }}
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
                  color: "var(--text-subtle)",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label style={labelStyle}>I am a</label>
            <div
              style={{ display: "flex", gap: "0.6rem", marginTop: "0.2rem" }}
            >
              <button
                type="button"
                style={roleButtonStyle(role === "customer")}
                onClick={() => setRole("customer")}
              >
                <User size={16} />
                <span>Customer</span>
              </button>
              <button
                type="button"
                style={roleButtonStyle(role === "vendor")}
                onClick={() => setRole("vendor")}
              >
                <Store size={16} />
                <span>Vendor</span>
              </button>
            </div>
          </div>

          {/* Terms Agreement Text */}
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-subtle)",
              lineHeight: 1.4,
              margin: "0.15rem 0 0 0",
            }}
          >
            By creating an account, you agree to our{" "}
            <span style={linkStyle}>Terms of Service</span> and{" "}
            <span style={linkStyle}>Privacy Policy</span>.
          </p>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "1rem",
              transition: "var(--transition-fast)",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Redirect Link */}
        <p
          style={{
            marginTop: "1rem",
            marginBottom: 0,
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--text-subtle)",
          }}
        >
          Already have an account?{" "}
          <button type="button" onClick={onNavigateToLogin} style={linkStyle}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
