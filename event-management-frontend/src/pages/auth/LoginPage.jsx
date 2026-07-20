import React, { useState } from "react";
import { Eye, EyeOff, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onLoginSuccess,
  onNavigateHome,
  isDarkMode = false,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
    }
  };

  const handleQuickAccess = (type) => {
    if (type === "customer") {
      setEmail("customer@eventpulse.com");
      setPassword("customer123");
    } else if (type === "vendor") {
      setEmail("vendor@eventpulse.com");
      setPassword("vendor123");
    } else if (type === "admin") {
      setEmail("admin@eventpulse.com");
      setPassword("admin123");
    }
  };

  const handleGoogleSignIn = () => {
    onLoginSuccess({
      email: "google.user@gmail.com",
      role: "customer",
      name: "Google User",
    });
  };

  // Adaptive Inline Theme Styles
  const pageContainerStyle = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-body-alt)",
    fontFamily: "var(--font-body)",
    color: "var(--text-main)",
    padding: "2rem 1rem",
    boxSizing: "border-box",
    position: "relative",
    transition: "var(--transition-fast)",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-main)",
    borderRadius: "var(--radius-md)",
    padding: "2.5rem 2rem",
    boxShadow: "var(--shadow-md)",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    backgroundColor: "var(--bg-body-alt)",
    border: "1px solid var(--border-input)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.9rem",
    color: "var(--text-main)",
    outline: "none",
    boxSizing: "border-box",
    transition: "var(--transition-fast)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-main)",
    marginBottom: "0.4rem",
  };

  const linkStyle = {
    color: "var(--primary)",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <div style={pageContainerStyle}>
      {/* Back to Home Navigation Button */}
      <button
        onClick={onNavigateHome}
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "var(--text-subtle)",
          fontSize: "0.9rem",
          fontWeight: "600",
          cursor: "pointer",
          padding: "0.5rem",
        }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div style={cardStyle}>
        {/* Branding Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ color: "var(--primary)" }}>
            <Calendar size={24} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.4rem",
              fontWeight: "700",
              color: "var(--text-main)",
            }}
          >
            EventPulse
          </span>
        </div>

        {/* Header Titles */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: "700",
              margin: "0 0 0.35rem 0",
              color: "var(--text-main)",
            }}
          >
            Welcome back
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-subtle)",
            }}
          >
            Sign in to your EventPulse account
          </p>
        </div>

        {/* Dynamic Error Messaging Alert */}
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
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1.25rem",
              lineHeight: "1.4",
            }}
          >
            {error}
          </div>
        )}

        {/* Main Login Form Elements */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Email Box Input */}
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

          {/* Password Box Input */}
          <div>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
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

          {/* Options: Remember Me & Forgot Password Link */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--text-subtle)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <span>Remember me</span>
            </label>
            <span onClick={onNavigateToForgotPassword} style={linkStyle}>
              Forgot password?
            </span>
          </div>

          {/* Form Action Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.7rem",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "0.5rem",
              transition: "var(--transition-fast)",
            }}
          >
            Sign In
          </button>

          {/* Horizontal Section Dividers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              color: "var(--text-subtle)",
              fontSize: "0.8rem",
              margin: "0.5rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border-main)",
              }}
            />
            <span style={{ padding: "0 0.75rem" }}>or continue with</span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border-main)",
              }}
            />
          </div>

          {/* Google OAuth Access Row */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              padding: "0.65rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-input)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              fontSize: "0.9rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              cursor: "pointer",
              transition: "var(--transition-fast)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.29-4.53z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Developer Sandbox Bypass Mode */}
        <div
          style={{
            marginTop: "2rem",
            padding: "0.75rem",
            backgroundColor: "var(--bg-body-alt)",
            border: "1px solid var(--border-main)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8rem",
            textAlign: "center",
            color: "var(--text-subtle)",
          }}
        >
          Quick access:{" "}
          <span onClick={() => handleQuickAccess("customer")} style={linkStyle}>
            Customer
          </span>{" "}
          •{" "}
          <span onClick={() => handleQuickAccess("vendor")} style={linkStyle}>
            Vendor
          </span>{" "}
          •{" "}
          <span onClick={() => handleQuickAccess("admin")} style={linkStyle}>
            Admin
          </span>
        </div>

        {/* Footer Redirect Link */}
        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: 0,
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--text-subtle)",
          }}
        >
          Don't have an account?{" "}
          <span onClick={onNavigateToRegister} style={linkStyle}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
