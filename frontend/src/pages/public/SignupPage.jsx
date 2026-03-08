import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Japan', 'South Korea', 'Brazil',
  'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden',
  'Singapore', 'Malaysia', 'UAE', 'South Africa', 'New Zealand'
];

function SignupPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    mobileNumber: '', country: '', role: 'CLIENT'
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (form.username.length < 3 || form.username.length > 30)
      errs.username = 'Username must be 3-30 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email format';
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (form.mobileNumber && !/^\+?[0-9]{10,15}$/.test(form.mobileNumber))
      errs.mobileNumber = 'Must be 10-15 digits (optional + prefix)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  const fieldError = (name) => errors[name] ? <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors[name]}</span> : null;

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Sign Up</h2>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required minLength={3} maxLength={30} placeholder="3-30 characters" />
            {fieldError('username')}
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            {fieldError('email')}
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" />
            {fieldError('password')}
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
            {fieldError('confirmPassword')}
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="+911234567890" maxLength={15} />
            {fieldError('mobileNumber')}
          </div>
          <div className="form-group">
            <label>Country</label>
            <select name="country" value={form.country} onChange={handleChange}>
              <option value="">-- Select Country --</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="CLIENT">Client</option>
              <option value="BEAUTICIAN">Beautician</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
