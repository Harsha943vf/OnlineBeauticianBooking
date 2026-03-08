import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addReview } from '../../services/reviewService';

function SubmitReviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }

  const bookingId = searchParams.get('bookingId');
  const beauticianId = searchParams.get('beauticianId');

  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addReview(user.userId, {
        beauticianId: Number(beauticianId),
        bookingId: Number(bookingId),
        rating: Number(form.rating),
        comment: form.comment
      });
      setSuccess('Review submitted successfully!');
      setTimeout(() => navigate('/client/bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Submit Review</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <div style={{ display: 'flex', gap: '10px', fontSize: '28px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setForm({...form, rating: star})}
                  style={{ color: star <= form.rating ? '#f5a623' : '#ccc' }}>★</span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea rows="4" value={form.comment}
              onChange={e => setForm({...form, comment: e.target.value})}
              placeholder="Share your experience..." required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default SubmitReviewPage;
