import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBeauticianById } from '../../services/beauticianService';
import { getServicesByBeautician } from '../../services/serviceService';
import { getAvailableSlots } from '../../services/availabilityService';
import { getReviewsByBeautician } from '../../services/reviewService';
import { isFavorite, toggleFavorite } from '../../services/favoritesService';

function BeauticianDetailPage() {
  const { id } = useParams();
  const [beautician, setBeautician] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    getBeauticianById(id).then(res => setBeautician(res.data)).catch(console.error);
    getServicesByBeautician(id).then(res => setServices(res.data)).catch(console.error);
    getAvailableSlots(id).then(res => setSlots(res.data)).catch(console.error);
    getReviewsByBeautician(id).then(res => setReviews(res.data)).catch(console.error);
    setFav(isFavorite(id));
  }, [id]);

  if (!beautician) return <p>Loading...</p>;

  return (
    <div>
      <div className="card" style={{ position: 'relative' }}>
        <button onClick={() => { toggleFavorite(id); setFav(!fav); }}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: fav ? '#e74c3c' : '#ccc' }}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}>
          {fav ? '♥' : '♡'}
        </button>
        <h1 className="page-title">{beautician.salonName || beautician.username}</h1>
        <p><strong>Specialization:</strong> {beautician.specialization}</p>
        <p><strong>Experience:</strong> {beautician.experienceYears} years</p>
        <p><strong>Rating:</strong> <span className="stars">{'★'.repeat(Math.round(beautician.ratingAverage))}{'☆'.repeat(5 - Math.round(beautician.ratingAverage))}</span> ({beautician.ratingAverage})</p>
        <p style={{ marginTop: '10px' }}>{beautician.description}</p>
      </div>

      <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Services</h2>
      <div className="grid-3">
        {services.map(s => (
          <div key={s.id} className="card">
            <h3>{s.serviceName}</h3>
            <p>{s.description}</p>
            <p><strong>Duration:</strong> {s.durationMinutes} mins</p>
            <p><strong>Price:</strong> ₹{s.price}</p>
            <Link to={`/client/book?beauticianId=${id}&serviceId=${s.id}`} className="btn btn-primary btn-sm mt-20">
              Book Now
            </Link>
          </div>
        ))}
        {services.length === 0 && <p>No services listed.</p>}
      </div>

      <h2 className="page-title mt-20" style={{ fontSize: '1.4rem' }}>Available Slots</h2>
      {slots.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Date</th><th>Start</th><th>End</th></tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No available slots.</p>}

      <h2 className="page-title mt-20" style={{ fontSize: '1.4rem' }}>Reviews</h2>
      {reviews.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>{beautician.ratingAverage?.toFixed(1) || '0.0'}</div>
              <div className="stars" style={{ fontSize: '1.4rem' }}>{'★'.repeat(Math.round(beautician.ratingAverage || 0))}{'☆'.repeat(5 - Math.round(beautician.ratingAverage || 0))}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: '20px', textAlign: 'right', fontSize: '14px', color: 'var(--text-secondary)' }}>{star}★</span>
                    <div style={{ flex: 1, height: '12px', background: 'var(--border-light)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#ffc107', borderRadius: '6px', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ width: '28px', fontSize: '13px', color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {reviews.map(r => (
        <div key={r.id} className="card">
          <div className="flex-between">
            <strong>{r.clientName}</strong>
            <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>{r.reviewText}</p>
          <small style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
      {reviews.length === 0 && <p>No reviews yet.</p>}
    </div>
  );
}

export default BeauticianDetailPage;
