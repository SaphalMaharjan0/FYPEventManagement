import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onLoginSuccess
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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

    // Determine role based on email
    let role = "customer";
    let userName = email.split("@")[0];
    
    if (email.toLowerCase().includes("admin")) {
      role = "admin";
      userName = "Admin User";
    } else if (email.toLowerCase().includes("vendor")) {
      role = "vendor";
      userName = "Vendor Organizer";
    } else {
      userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    }

    onLoginSuccess({
      email,
      role,
      name: userName
    });
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
    // Simulated Google OAuth login
    onLoginSuccess({
      email: "google.user@gmail.com",
      role: "customer",
      name: "Google User"
    });
  };

  return (
    <>
      <div className="auth-form-header">
        <h3 className="auth-form-title">Welcome back</h3>
        <p className="auth-form-subtitle">Sign in to your EventPulse account</p>
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 700, backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email Address */}
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

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
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
                color: "#64748b",
                display: "flex",
                alignItems: "center"
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="form-options-row">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <span className="form-link" onClick={onNavigateToForgotPassword}>
            Forgot password?
          </span>
        </div>

        {/* Action Button */}
        <button type="submit" className="btn-auth-submit">
          Sign In
        </button>

        {/* Auth Divider */}
        <div className="auth-divider">or continue with</div>

        {/* Google OAuth Button */}
        <button type="button" className="btn-auth-google" onClick={handleGoogleSignIn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-5.29-4.53z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

      {/* Developer Quick Access */}
      <div className="quick-access-box">
        Quick access:{" "}
        <span className="form-link" onClick={() => handleQuickAccess("customer")}>
          Customer
        </span>{" "}
        •{" "}
        <span className="form-link" onClick={() => handleQuickAccess("vendor")}>
          Vendor
        </span>{" "}
        •{" "}
        <span className="form-link" onClick={() => handleQuickAccess("admin")}>
          Admin
        </span>
      </div>

      {/* Form Footer */}
      <p className="auth-footer-text">
        Don't have an account?{" "}
        <span className="form-link" onClick={onNavigateToRegister}>
          Create one
        </span>
      </p>
    </>
  );
}
