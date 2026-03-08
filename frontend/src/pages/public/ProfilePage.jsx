import { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../../services/userService';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'South Korea', 'Brazil',
  'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden',
  'Singapore', 'Malaysia', 'UAE', 'South Africa', 'New Zealand'
];

function ProfilePage() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { localStorage.removeItem('user'); }
  const [form, setForm] = useState({ email: '', mobileNumber: '', country: '', password: '' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => {
    if (user) {
      getUserById(user.userId).then(res => {
        setForm({ email: res.data.email, mobileNumber: res.data.mobileNumber || '', country: res.data.country || '', password: '' });
      }).catch(console.error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.mobileNumber && !/^\+?[0-9]{10,15}$/.test(form.mobileNumber)) {
      setMessage('Mobile number must be 10-15 digits'); setMsgType('danger'); return;
    }
    if (form.password && form.password.length < 6) {
      setMessage('Password must be at least 6 characters'); setMsgType('danger'); return;
    }
    try {
      await updateUser(user.userId, form);
      setMessage('Profile updated successfully!'); setMsgType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed'); setMsgType('danger');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>My Profile</h2>
        {message && <div className={`alert alert-${msgType}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={user?.username || ''} disabled />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} placeholder="+911234567890" maxLength={15} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
              <option value="">-- Select Country --</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
