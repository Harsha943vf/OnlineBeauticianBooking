import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBeauticianById } from '../../services/beauticianService';
import { getServicesByBeautician } from '../../services/serviceService';
import { getAvailableSlots } from '../../services/availabilityService';
import { createBooking } from '../../services/bookingService';

function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }

  const beauticianId = searchParams.get('beauticianId');
  const preSelectedServiceId = searchParams.get('serviceId');

  const [beautician, setBeautician] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    serviceId: preSelectedServiceId || '',
    bookingDate: '',
    bookingTime: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (beauticianId) {
      getBeauticianById(beauticianId).then(res => setBeautician(res.data)).catch(console.error);
      getServicesByBeautician(beauticianId).then(res => setServices(res.data)).catch(console.error);
      getAvailableSlots(beauticianId).then(res => setSlots(res.data)).catch(console.error);
    }
  }, [beauticianId]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.bookingDate < today) {
      setError('Booking date cannot be in the past');
      return;
    }
    try {
      await createBooking(user.userId, {
        beauticianId: Number(beauticianId),
        serviceId: Number(form.serviceId),
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        notes: form.notes || null
      });
      setSuccess('Booking created successfully!');
      setTimeout(() => navigate('/client/bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!beauticianId) return <p>Please select a beautician first. <a href="/beauticians">Browse beauticians</a></p>;

  return (
    <div className="auth-container" style={{ maxWidth: '550px' }}>
      <div className="card">
        <h2>Book Appointment</h2>
        {beautician && <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>with <strong>{beautician.salonName || beautician.username}</strong></p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Service</label>
            <select value={form.serviceId} onChange={e => setForm({...form, serviceId: e.target.value})} required>
              <option value="">-- Choose a service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.serviceName} - ₹{s.price} ({s.durationMinutes} mins)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Booking Date</label>
            <input type="date" value={form.bookingDate} min={today} onChange={e => setForm({...form, bookingDate: e.target.value})} required />
          </div>

          <div className="form-group">
            <label>Booking Time</label>
            <input type="time" value={form.bookingTime} onChange={e => setForm({...form, bookingTime: e.target.value})} required />
          </div>

          {slots.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 600, color: '#555' }}>Available Slots:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {slots.map(s => (
                  <span key={s.id} className="badge badge-approved" style={{ cursor: 'pointer' }}
                    onClick={() => setForm({...form, bookingDate: s.date, bookingTime: s.startTime})}>
                    {s.date} {s.startTime}-{s.endTime}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              maxLength={500} rows={3} placeholder="Any special requests or preferences..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit', resize: 'vertical' }} />
            <span style={{ fontSize: '11px', color: '#999' }}>{form.notes.length}/500</span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Book Now</button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointmentPage;
