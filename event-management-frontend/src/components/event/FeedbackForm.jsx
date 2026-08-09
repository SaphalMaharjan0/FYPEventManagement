import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function FeedbackForm({ eventId, onSubmitSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
      
      const newFeedback = await response.json();
      setRating(0);
      setComment('');
      if (onSubmitSuccess) {
        onSubmitSuccess(newFeedback);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--card-bg, #fff)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Leave Feedback</h3>
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Rating</label>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Star
                  size={24}
                  fill={(hoverRating || rating) >= star ? '#eab308' : 'none'}
                  color={(hoverRating || rating) >= star ? '#eab308' : '#d1d5db'}
                />
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Comment (Optional)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color, #d1d5db)', resize: 'vertical' }}
            placeholder="Tell us what you thought about the event..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={loading || rating === 0}
          style={{
            backgroundColor: 'var(--primary, #3b82f6)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            fontWeight: 600,
            cursor: (loading || rating === 0) ? 'not-allowed' : 'pointer',
            opacity: (loading || rating === 0) ? 0.7 : 1
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
