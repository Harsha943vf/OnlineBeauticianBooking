import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getClientBookings, cancelBooking } from '../../services/bookingService';
import ConfirmModal from '../../components/ConfirmModal';

function BookingHistoryPage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [bookings, setBookings] = useState([]);
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });

  useEffect(() => {
    getClientBookings(user.userId).then(res => setBookings(res.data)).catch(console.error);
  }, [user.userId]);

  const handleCancel = async (reason) => {
    try {
      await cancelBooking(cancelModal.bookingId, reason);
      const res = await getClientBookings(user.userId);
      setBookings(res.data);
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
    setCancelModal({ open: false, bookingId: null });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'badge-approved';
      case 'PENDING': return 'badge-pending';
      case 'REJECTED': case 'CANCELLED': return 'badge-rejected';
      case 'COMPLETED': return 'badge-approved';
      default: return '';
    }
  };

  return (
    <div>
      <h2>Booking History</h2>
      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No bookings yet.</p>
          <Link to="/beauticians" className="btn btn-primary">Book Now</Link>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Service</th>
                <th>Beautician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.bookingTime}</td>
                  <td>{b.serviceName || '-'}</td>
                  <td>{b.beauticianName || '-'}</td>
                  <td><span className={`badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
                  <td>
                    <Link to={`/client/bookings/${b.id}`} className="btn btn-secondary" style={{ fontSize: '13px', padding: '5px 10px' }}>View</Link>
                    {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                      <button onClick={() => setCancelModal({ open: true, bookingId: b.id })} className="btn" style={{ fontSize: '13px', padding: '5px 10px', marginLeft: '5px', background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '6px' }}>Cancel</button>
                    )}
                    {b.status === 'COMPLETED' && (
                      <Link to={`/client/review?bookingId=${b.id}&beauticianId=${b.beauticianId}`} className="btn btn-primary" style={{ fontSize: '13px', padding: '5px 10px', marginLeft: '5px' }}>Review</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={cancelModal.open}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        showInput={true}
        inputLabel="Reason for cancellation"
        onConfirm={handleCancel}
        onCancel={() => setCancelModal({ open: false, bookingId: null })}
      />
    </div>
  );
}

export default BookingHistoryPage;
