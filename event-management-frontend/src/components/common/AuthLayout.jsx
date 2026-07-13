import React from "react";
import { Calendar, CheckCircle } from "lucide-react";

export default function AuthLayout({ children, onLogoClick }) {
  const bulletFeatures = [
    "10,000+ events listed monthly",
    "Instant ticket delivery",
    "Real-time booking analytics"
  ];

  return (
    <div className="auth-split-container">
      {/* Left Branding Panel */}
      <div className="auth-left-panel">


        <div className="auth-left-content">
          <h2 className="auth-left-title">
            Your events,<br />
            beautifully managed.
          </h2>
          <p className="auth-left-desc">
            Join over 500,000 event-goers and organizers on the platform that makes every event unforgettable.
          </p>

          <div className="auth-left-features">
            {bulletFeatures.map((feat, i) => (
              <div key={i} className="auth-left-feature">
                <span className="auth-left-feature-icon">
                  <CheckCircle size={18} />
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right-panel">
        <div className="auth-form-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
