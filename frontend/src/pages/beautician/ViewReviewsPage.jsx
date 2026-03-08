import { useState, useEffect } from 'react';
import { getBeauticianByUserId } from '../../services/beauticianService';
import { getReviewsByBeautician } from '../../services/reviewService';

function ViewReviewsPage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getBeauticianByUserId(user.userId).then(res => {
      const bId = res.data.id;
      if (bId) getReviewsByBeautician(bId).then(r => setReviews(r.data)).catch(console.error);
    }).catch(console.error);
  }, [user.userId]);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  return (
    <div>
      <h2>My Reviews</h2>
      <div className="card" style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '36px', color: '#f5a623' }}>{avgRating} ★</h3>
        <p>{reviews.length} total reviews</p>
      </div>

      {reviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No reviews yet.</p>
      ) : (
        <div className="grid">
          {reviews.map(r => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>{r.clientName || 'Client'}</strong>
                <span style={{ color: '#f5a623' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p>{r.comment}</p>
              <small style={{ color: '#999' }}>{r.createdAt || ''}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewReviewsPage;
