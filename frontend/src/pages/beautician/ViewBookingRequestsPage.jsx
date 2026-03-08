import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getBeauticianByUserId } from '../../services/beauticianService';
import { getBeauticianBookings, approveBooking, rejectBooking, completeBooking } from '../../services/bookingService';

function ViewBookingRequestsPage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [bookings, setBookings] = useState([]);
  const [beauticianId, setBeauticianId] = useState(null);
  const beauticianIdRef = useRef(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getBeauticianByUserId(user.userId).then(res => {
      const bId = res.data.id;
      setBeauticianId(bId);
      beauticianIdRef.current = bId;
      if (bId) loadBookings(bId);
    }).catch(console.error);
  }, [user.userId]);

  const loadBookings = (bId) => {
    if (!bId) return;
    getBeauticianBookings(bId).then(res => setBookings(res.data)).catch(console.error);
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      if (status === 'APPROVED') await approveBooking(bookingId);
      else if (status === 'REJECTED') await rejectBooking(bookingId);
      else if (status === 'COMPLETED') await completeBooking(bookingId);
      loadBookings(beauticianIdRef.current);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

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
      <h2>Booking Requests</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
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
              <tr><th>ID</th><th>Client</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.clientName || '-'}</td>
                  <td>{b.serviceName || '-'}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.bookingTime}</td>
                  <td><span className={`badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'PENDING' && (
                      <>
                        <button className="btn btn-primary" onClick={() => handleStatusUpdate(b.id, 'APPROVED')} style={{ fontSize: '12px', padding: '4px 8px', marginRight: '5px' }}>Approve</button>
                        <button className="btn btn-danger" onClick={() => handleStatusUpdate(b.id, 'REJECTED')} style={{ fontSize: '12px', padding: '4px 8px' }}>Reject</button>
                      </>
                    )}
                    {b.status === 'APPROVED' && (
                      <button className="btn btn-primary" onClick={() => handleStatusUpdate(b.id, 'COMPLETED')} style={{ fontSize: '12px', padding: '4px 8px' }}>Mark Done</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewBookingRequestsPage;
