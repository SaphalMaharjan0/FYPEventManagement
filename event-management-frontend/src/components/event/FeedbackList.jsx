import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export default function FeedbackList({ eventId, refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}/feedback`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [eventId, refreshTrigger]);

  if (loading) return <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>Loading feedback...</div>;
  if (error) return <div style={{ marginTop: '2rem', color: 'red' }}>Error loading feedback: {error}</div>;

  return (
    <div className="feedback-list" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
        Event Feedback {feedbacks.length > 0 && <span style={{ color: 'var(--text-muted, #6b7280)', fontSize: '1rem', fontWeight: 'normal' }}>({feedbacks.length})</span>}
      </h3>
      
      {feedbacks.length === 0 ? (
        <p style={{ color: 'var(--text-muted, #6b7280)', fontStyle: 'italic' }}>No feedback has been submitted yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedbacks.map((fb) => (
            <div key={fb.id} style={{ padding: '1rem', backgroundColor: 'var(--card-bg, #fff)', borderRadius: '8px', border: '1px solid var(--border-color, #e5e7eb)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>{fb.userName}</div>
                <div style={{ color: 'var(--text-muted, #6b7280)', fontSize: '0.75rem' }}>
                  {new Date(fb.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={fb.rating >= star ? '#eab308' : 'none'}
                    color={fb.rating >= star ? '#eab308' : '#d1d5db'}
                  />
                ))}
              </div>
              {fb.comment && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-main, #374151)' }}>
                  {fb.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
