import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/hirehub';
import { Briefcase, User, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import './Auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data || '';
      setError(typeof msg === 'string' ? msg : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Briefcase size={22} />
          </div>
          <div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join HireHub today</p>
          </div>
        </div>

        {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
        {success && <div className="alert alert-success"><span>✓</span> {success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                id="reg-username"
                type="text"
                name="username"
                className="form-input has-icon"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                className="form-input has-icon has-icon-right"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">
              <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
              Role
            </label>
            <select
              id="reg-role"
              name="role"
              className="form-input"
              value={form.role}
              onChange={handleChange}
            >
              <option value="USER">User — Browse jobs</option>
              <option value="ADMIN">Admin — Full access</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? <span className="spinner" /> : (
              <><span>Create Account</span> <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
