import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getBeauticianByUserId } from '../../services/beauticianService';
import { getServicesByBeautician, addService, deleteService } from '../../services/serviceService';
import ConfirmModal from '../../components/ConfirmModal';

function ManageServicesPage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [beauticianId, setBeauticianId] = useState(null);
  const beauticianIdRef = useRef(null);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ serviceName: '', description: '', price: '', durationMinutes: '' });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    getBeauticianByUserId(user.userId).then(res => {
      const bId = res.data.id;
      setBeauticianId(bId);
      beauticianIdRef.current = bId;
      if (bId) loadServices(bId);
    }).catch(console.error);
  }, [user.userId]);

  const loadServices = (bId) => {
    if (!bId) return;
    getServicesByBeautician(bId).then(res => setServices(res.data)).catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const bId = beauticianIdRef.current;
      if (!bId) return;
      await addService(bId, {
        serviceName: form.serviceName,
        description: form.description,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes)
      });
      setForm({ serviceName: '', description: '', price: '', durationMinutes: '' });
      setEditing(false);
      loadServices(bId);
      toast.success('Service added successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service');
    }
  };

  const handleDelete = async () => {
    await deleteService(deleteModal.id);
    loadServices(beauticianIdRef.current);
    toast.success('Service deleted');
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Services</h2>
        <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {editing && (
        <div className="card" style={{ marginBottom: '25px' }}>
          <h3>Add New Service</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Name</label>
              <input type="text" value={form.serviceName} onChange={e => setForm({...form, serviceName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Duration (mins)</label>
                <input type="number" value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Service</button>
          </form>
        </div>
      )}

      {services.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><p>No services added yet.</p></div>
      ) : (
        <div className="grid">
          {services.map(s => (
            <div key={s.id} className="card">
              <h3>{s.serviceName}</h3>
              <p>{s.description || 'No description'}</p>
              <p><strong>Price:</strong> ₹{s.price} | <strong>Duration:</strong> {s.durationMinutes} mins</p>
              <button className="btn btn-danger" onClick={() => setDeleteModal({ open: true, id: s.id })} style={{ marginTop: '10px' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}

export default ManageServicesPage;
