import React from "react";
import { Calendar, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer-section">
      <div className="container">
        {/* Footer Top Links Grid */}
        <div className="footer-grid">
          {/* Logo & Description */}
          <div className="footer-info">
            <div className="footer-logo">
              <div className="logo-icon">
                <Calendar size={18} />
              </div>
              <span>EventPulse</span>
            </div>
            <p className="footer-description">
              The modern platform for event discovery, ticketing, and management.
            </p>
            <div className="footer-socials">
              <div className="social-circle" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </div>
              <div className="social-circle" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="social-circle" aria-label="Linkedin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </div>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-column">
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li className="footer-link"><a href="#featured">Browse Events</a></li>
              <li className="footer-link"><a href="#host">Create Event</a></li>
              <li className="footer-link"><a href="#pricing">Pricing</a></li>
              <li className="footer-link"><a href="#enterprise">Enterprise</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li className="footer-link"><a href="#about">About</a></li>
              <li className="footer-link"><a href="#blog">Blog</a></li>
              <li className="footer-link"><a href="#careers">Careers</a></li>
              <li className="footer-link"><a href="#press">Press</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li className="footer-link"><a href="#help">Help Center</a></li>
              <li className="footer-link"><a href="#contact">Contact Us</a></li>
              <li className="footer-link"><a href="#privacy">Privacy Policy</a></li>
              <li className="footer-link"><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright & back to top */}
        <div className="footer-bottom">
          <p>© 2025 EventPulse. All rights reserved.</p>
          <div className="back-to-top" onClick={scrollToTop}>
            <span>Back to top</span>
            <ArrowUp size={14} />
          </div>
        </div>
      </div>
    </footer>
  );
}
