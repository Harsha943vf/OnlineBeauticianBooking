import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClientBookings } from '../../services/bookingService';

function AppointmentDetailsPage() {
  const { id } = useParams();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    getClientBookings(user.userId).then(res => {
      const found = res.data.find(b => b.id === Number(id));
      setBooking(found);
    }).catch(console.error);
  }, [id, user.userId]);

  if (!booking) return <p>Loading...</p>;

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': case 'COMPLETED': return 'badge-approved';
      case 'PENDING': return 'badge-pending';
      default: return 'badge-rejected';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Booking Details</h2>
      <div className="card">
        <table style={{ width: '100%' }}>
          <tbody>
            <tr><td><strong>Booking ID</strong></td><td>#{booking.id}</td></tr>
            <tr><td><strong>Date</strong></td><td>{booking.bookingDate}</td></tr>
            <tr><td><strong>Time</strong></td><td>{booking.bookingTime}</td></tr>
            <tr><td><strong>Service</strong></td><td>{booking.serviceName || '-'}</td></tr>
            {booking.servicePrice && <tr><td><strong>Price</strong></td><td>₹{booking.servicePrice}</td></tr>}
            {booking.serviceDuration && <tr><td><strong>Duration</strong></td><td>{booking.serviceDuration} mins</td></tr>}
            <tr><td><strong>Beautician</strong></td><td>{booking.beauticianName || '-'}</td></tr>
            {booking.notes && <tr><td><strong>Notes</strong></td><td>{booking.notes}</td></tr>}
            {booking.clientPhone && <tr><td><strong>Contact</strong></td><td>{booking.clientPhone}</td></tr>}
            <tr><td><strong>Status</strong></td><td><span className={`badge ${getStatusClass(booking.status)}`}>{booking.status}</span></td></tr>
            {booking.cancellationReason && <tr><td><strong>Cancellation Reason</strong></td><td>{booking.cancellationReason}</td></tr>}
            {booking.createdAt && <tr><td><strong>Booked On</strong></td><td>{new Date(booking.createdAt).toLocaleString()}</td></tr>}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Link to="/client/bookings" className="btn btn-secondary">Back to Bookings</Link>
          {booking.status === 'COMPLETED' && (
            <Link to={`/client/review?bookingId=${booking.id}&beauticianId=${booking.beauticianId}`} className="btn btn-primary">Write Review</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsPage;
