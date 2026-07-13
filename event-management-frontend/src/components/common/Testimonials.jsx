import React from "react";
import { Star } from "lucide-react";

export default function Testimonials({ testimonials }) {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header" style={{ justifyContent: "center", textAlign: "center", marginBottom: "3rem" }}>
          <div className="section-title-area">
            <h2 className="section-title">What Organizers Say</h2>
            <p className="section-subtitle">Trusted by event professionals worldwide</p>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((test) => (
            <div key={test.id} className="testimonial-card">
              <div>
                {/* 5 Stars */}
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </div>

                {/* Quote */}
                <p className="testimonial-text">
                  "{test.text}"
                </p>
              </div>

              {/* User Avatar & Info */}
              <div className="testimonial-user">
                <div className="user-avatar" style={{ backgroundColor: test.color }}>
                  {test.initials}
                </div>
                <div className="user-details">
                  <span className="user-name">{test.name}</span>
                  <span className="user-role">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
