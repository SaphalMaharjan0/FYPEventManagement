import React from "react";
import { Calendar, ArrowUp } from "lucide-react";

export default function Footer({ isDarkMode = false }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Theme variable setups
  const footerStyle = {
    backgroundColor: "var(--bg-card)",
    color: "var(--text-main)",
    borderTop: "1px solid var(--border-main)",
    paddingTop: "4rem",
    paddingBottom: "2.5rem",
    fontFamily: "var(--font-body)",
    transition: "var(--transition-fast)",
  };

  const titleStyle = {
    fontFamily: "var(--font-heading)",
    fontSize: "1rem",
    fontWeight: "700",
    color: "var(--text-main)",
    marginBottom: "1.25rem",
  };

  const textSubtleStyle = {
    color: "var(--text-subtle)",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  };

  const linkStyle = {
    color: "var(--text-subtle)",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "var(--transition-fast)",
  };

  const socialCircleStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-body-alt)",
    border: "1px solid var(--border-input)",
    color: "var(--text-main)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition-fast)",
  };

  return (
    <footer style={footerStyle} className="footer-section">
      <div className="container">
        {/* Footer Top Links Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Logo & Description */}
          <div
            className="footer-info"
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              className="footer-logo"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <div className="logo-icon">
                <Calendar size={18} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "var(--text-main)",
                }}
              >
                EventPulse
              </span>
            </div>
            <p className="footer-description" style={textSubtleStyle}>
              The modern platform for event discovery, ticketing, and
              management.
            </p>
            <div
              className="footer-socials"
              style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}
            >
              <div
                className="social-circle"
                aria-label="Twitter"
                style={socialCircleStyle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </div>
              <div
                className="social-circle"
                aria-label="Facebook"
                style={socialCircleStyle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <div
                className="social-circle"
                aria-label="Linkedin"
                style={socialCircleStyle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-column">
            <h4 className="footer-title" style={titleStyle}>
              Platform
            </h4>
            <ul
              className="footer-links"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <li className="footer-link">
                <a href="#featured" style={linkStyle}>
                  Browse Events
                </a>
              </li>
              <li className="footer-link">
                <a href="#host" style={linkStyle}>
                  Create Event
                </a>
              </li>
              <li className="footer-link">
                <a href="#pricing" style={linkStyle}>
                  Pricing
                </a>
              </li>
              <li className="footer-link">
                <a href="#enterprise" style={linkStyle}>
                  Enterprise
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h4 className="footer-title" style={titleStyle}>
              Company
            </h4>
            <ul
              className="footer-links"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <li className="footer-link">
                <a href="#about" style={linkStyle}>
                  About
                </a>
              </li>
              <li className="footer-link">
                <a href="#blog" style={linkStyle}>
                  Blog
                </a>
              </li>
              <li className="footer-link">
                <a href="#careers" style={linkStyle}>
                  Careers
                </a>
              </li>
              <li className="footer-link">
                <a href="#press" style={linkStyle}>
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-title" style={titleStyle}>
              Support
            </h4>
            <ul
              className="footer-links"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <li className="footer-link">
                <a href="#help" style={linkStyle}>
                  Help Center
                </a>
              </li>
              <li className="footer-link">
                <a href="#contact" style={linkStyle}>
                  Contact Us
                </a>
              </li>
              <li className="footer-link">
                <a href="#privacy" style={linkStyle}>
                  Privacy Policy
                </a>
              </li>
              <li className="footer-link">
                <a href="#terms" style={linkStyle}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright & back to top */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-main)",
          }}
        >
          <p style={{ ...textSubtleStyle, margin: 0 }}>
            © 2026 EventPulse. All rights reserved.
          </p>
          <div
            className="back-to-top"
            onClick={scrollToTop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--text-main)",
              transition: "var(--transition-fast)",
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={14} color="var(--primary)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
