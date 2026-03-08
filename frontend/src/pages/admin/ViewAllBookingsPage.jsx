import { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/adminService';

function ViewAllBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getAllBookings().then(res => setBookings(res.data)).catch(console.error);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': case 'COMPLETED': return 'badge-approved';
      case 'PENDING': return 'badge-pending';
      default: return 'badge-rejected';
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <h2>All Bookings</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)} style={{ fontSize: '13px', padding: '5px 12px' }}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><p>No bookings found.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Client</th><th>Beautician</th><th>Service</th><th>Price</th><th>Date</th><th>Time</th><th>Contact</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.clientName || '-'}</td>
                  <td>{b.beauticianName || '-'}</td>
                  <td>{b.serviceName || '-'}</td>
                  <td>{b.servicePrice ? `₹${b.servicePrice}` : '-'}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.bookingTime}</td>
                  <td>{b.clientPhone || b.clientEmail || '-'}</td>
                  <td><span className={`badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewAllBookingsPage;
