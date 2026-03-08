import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClientBookings } from '../../services/bookingService';

function ClientDashboard() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      getClientBookings(user.userId).then(res => setBookings(res.data)).catch(console.error);
    }
  }, []);

  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div>
      <h1 className="page-title">Welcome, {user?.username}!</h1>

      <div className="dashboard">
        <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}>
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f39c12' }}>
          <h2>{pending}</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #2ecc71' }}>
          <h2>{approved}</h2>
          <p>Approved</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #27ae60' }}>
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #16a085' }}>
          <h2>\u20b9{bookings.filter(b => b.status === 'COMPLETED').reduce((s, b) => s + (b.servicePrice || 0), 0).toLocaleString()}</h2>
          <p>Total Spent</p>
        </div>
      </div>

      <div className="flex-between mb-20">
        <h2>Recent Bookings</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/beauticians" className="btn btn-primary">Book Appointment</Link>
          <Link to="/client/bookings" className="btn btn-success">View All</Link>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Beautician</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 5).map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.beauticianName}</td>
                <td>{b.serviceName}</td>
                <td>{b.bookingDate}</td>
                <td>{b.bookingTime}</td>
                <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientDashboard;
