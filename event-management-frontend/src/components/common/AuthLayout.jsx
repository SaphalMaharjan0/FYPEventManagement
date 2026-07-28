import React from "react";
import { Calendar, CheckCircle2, Sparkles } from "lucide-react";

export default function AuthLayout({ children, onLogoClick }) {
  const bulletFeatures = [
    "10,000+ events listed monthly",
    "Instant ticket delivery",
    "Real-time booking analytics",
  ];

  return (
    <div className="auth-container">
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }

        .auth-container {
          width: 100%;
          max-width: 100%;
          display: flex;
          background-color: var(--bg-body-alt);
          color: var(--text-main);
          font-family: var(--font-body);
        }

        /* Large / Desktop Devices (LG): Fixed viewport height, NO scrolling */
        @media (min-width: 901px) {
          .auth-container {
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            padding-top: 0;
          }

          .auth-left-panel {
            flex: 0 0 50%;
            width: 50%;
            max-width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(135deg, #090d16 0%, #151e33 60%, #1d2b4a 100%);
            color: #ffffff;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2.25rem 3rem;
            height: 100%;
          }

          .auth-right-panel {
            flex: 0 0 50%;
            width: 50%;
            max-width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            height: 100%;
          }
        }

        /* Small & Medium Devices (SM & MD): Allow natural vertical scrolling */
        @media (max-width: 900px) {
          .auth-container {
            flex-direction: column;
            min-height: 100vh;
            min-height: 100dvh;
            height: auto;
            overflow-y: auto;
            overflow-x: hidden;
            padding-top: 0;
          }

          .auth-left-panel {
            display: none; /* Hide branding sidebar on mobile/tablet */
          }

          .auth-right-panel {
            flex: 1 1 auto;
            width: 100%;
            max-width: 100%;
            padding: 2rem 1.25rem 3rem 1.25rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>

      {/* Left Branding Panel (LG Desktop Only) */}
      <div className="auth-left-panel">
        {/* Logo */}
        <div
          onClick={onLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <div
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={22} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.35rem",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            EventPulse
          </span>
        </div>

        {/* Hero Copy */}
        <div style={{ maxWidth: "480px", margin: "auto 0", padding: "1rem 0" }}>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.15rem",
              fontWeight: "800",
              lineHeight: "1.15",
              marginBottom: "0.85rem",
              color: "#ffffff",
            }}
          >
            Your events,
            <br />
            beautifully managed.
          </h2>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              marginBottom: "1.5rem",
            }}
          >
            Join over 500,000 event-goers and organizers on the platform that
            makes every event unforgettable.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {bulletFeatures.map((feat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <CheckCircle2
                  size={18}
                  color="#10b981"
                  style={{ flexShrink: 0 }}
                />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.6)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1.25rem",
          }}
        >
          © 2026 EventPulse. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel (Wider container) */}
      <div className="auth-right-panel" style={{ backgroundColor: "#ffffff" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>{children}</div>
      </div>
    </div>
  );
}
