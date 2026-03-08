import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBeauticianByUserId } from '../../services/beauticianService';
import { getBeauticianBookings } from '../../services/bookingService';
import { getReviewsByBeautician } from '../../services/reviewService';

function BeauticianDashboard() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [beautician, setBeautician] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getBeauticianByUserId(user.userId).then(res => {
      setBeautician(res.data);
      const bId = res.data.id;
      if (bId) {
        getBeauticianBookings(bId).then(r => setBookings(r.data)).catch(console.error);
        getReviewsByBeautician(bId).then(r => setReviews(r.data)).catch(console.error);
      }
    }).catch(console.error);
  }, [user.userId]);

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  const revenue = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  return (
    <div>
      <h2>Beautician Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>Welcome back, {user.username || user.email}!</p>

      <div className="dashboard-stats">
        <div className="stat-card" style={{ borderLeft: '4px solid #f39c12' }}><h3>{pendingCount}</h3><p>Pending Requests</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}><h3>{approvedCount}</h3><p>Upcoming Appointments</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #27ae60' }}><h3>{completedCount}</h3><p>Completed</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #16a085' }}><h3>\u20b9{revenue.toLocaleString()}</h3><p>Total Revenue</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #e74c3c' }}><h3>{avgRating} \u2605</h3><p>Avg Rating ({reviews.length})</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #9b59b6' }}><h3>{bookings.length}</h3><p>Total Bookings</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <Link to="/beautician/services" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Manage Services</h3><p>Add, edit, or remove your services</p>
        </Link>
        <Link to="/beautician/availability" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Manage Availability</h3><p>Set your available time slots</p>
        </Link>
        <Link to="/beautician/bookings" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Booking Requests</h3><p>View and manage bookings</p>
        </Link>
        <Link to="/beautician/reviews" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Reviews</h3><p>See what clients say about you</p>
        </Link>
      </div>
    </div>
  );
}

export default BeauticianDashboard;
