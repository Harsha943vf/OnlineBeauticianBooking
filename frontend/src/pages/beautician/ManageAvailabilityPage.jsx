import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getBeauticianByUserId } from '../../services/beauticianService';
import { getSlotsByBeautician, addSlot, deleteSlot } from '../../services/availabilityService';
import ConfirmModal from '../../components/ConfirmModal';

function ManageAvailabilityPage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [beauticianId, setBeauticianId] = useState(null);
  const beauticianIdRef = useRef(null);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    getBeauticianByUserId(user.userId).then(res => {
      const bId = res.data.id;
      setBeauticianId(bId);
      beauticianIdRef.current = bId;
      if (bId) loadSlots(bId);
    }).catch(console.error);
  }, [user.userId]);

  const loadSlots = (bId) => {
    if (!bId) return;
    getSlotsByBeautician(bId).then(res => setSlots(res.data)).catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const bId = beauticianIdRef.current;
      if (!bId) return;
      await addSlot(bId, {
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime
      });
      setForm({ date: '', startTime: '', endTime: '' });
      setShowForm(false);
      loadSlots(bId);
      toast.success('Slot added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add slot');
    }
  };

  const handleDelete = async () => {
    await deleteSlot(deleteModal.id);
    loadSlots(beauticianIdRef.current);
    toast.success('Slot deleted');
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Availability</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Slot'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '25px' }}>
          <h3>Add Availability Slot</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Slot</button>
          </form>
        </div>
      )}

      {slots.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><p>No availability slots added.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Date</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.startTime}</td>
                  <td>{s.endTime}</td>
                  <td><span className={`badge ${s.booked ? 'badge-rejected' : 'badge-approved'}`}>{s.booked ? 'Booked' : 'Available'}</span></td>
                  <td><button className="btn btn-danger" onClick={() => setDeleteModal({ open: true, id: s.id })} style={{ fontSize: '13px', padding: '5px 10px' }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Slot"
        message="Are you sure you want to delete this availability slot?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}

export default ManageAvailabilityPage;
