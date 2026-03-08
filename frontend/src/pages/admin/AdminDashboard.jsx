import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, getAllBookings, getAllReviews } from '../../services/adminService';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.data)).catch(console.error);
    getAllBookings().then(res => setBookings(res.data)).catch(console.error);
    getAllReviews().then(res => setReviews(res.data)).catch(console.error);
  }, []);

  const clientCount = users.filter(u => u.role === 'CLIENT').length;
  const beauticianCount = users.filter(u => u.role === 'BEAUTICIAN').length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  const revenue = bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.servicePrice || 0), 0);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>System Overview</p>

      <div className="dashboard-stats">
        <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}><h3>{users.length}</h3><p>Total Users</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #2ecc71' }}><h3>{clientCount}</h3><p>Clients</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #9b59b6' }}><h3>{beauticianCount}</h3><p>Beauticians</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #e67e22' }}><h3>{totalBookings}</h3><p>Total Bookings</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f39c12' }}><h3>{pendingBookings}</h3><p>Pending</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #27ae60' }}><h3>{completedBookings}</h3><p>Completed</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #16a085' }}><h3>\u20b9{revenue.toLocaleString()}</h3><p>Total Revenue</p></div>
        <div className="stat-card" style={{ borderLeft: '4px solid #e74c3c' }}><h3>{avgRating} \u2605</h3><p>Avg Rating ({reviews.length})</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <Link to="/admin/users" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Manage Users</h3><p>View and manage all users</p>
        </Link>
        <Link to="/admin/beauticians" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Manage Beauticians</h3><p>View beautician profiles</p>
        </Link>
        <Link to="/admin/bookings" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>All Bookings</h3><p>View all system bookings</p>
        </Link>
        <Link to="/admin/reviews" className="card" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <h3>Manage Reviews</h3><p>Moderate user reviews</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
