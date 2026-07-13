import React from "react";

export default function HostBanner() {
  return (
    <section className="container">
      <div className="host-banner">
        <div className="host-content">
          <h2 className="host-title">Host Your Own Event</h2>
          <p className="host-subtitle">
            Create, manage, and sell tickets to your events. Join 5,000+ organizers on EventPulse.
          </p>
        </div>
        <div className="host-actions">
          <button className="btn-host-white">Start for Free</button>
          <button className="btn-host-outline">Learn More</button>
        </div>
      </div>
    </section>
  );
}
