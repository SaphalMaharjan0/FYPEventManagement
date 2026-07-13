import React from "react";

export default function Stats() {
  const statsData = [
    { number: "10K+", label: "Events Listed" },
    { number: "500K+", label: "Happy Attendees" },
    { number: "200+", label: "Cities Covered" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
