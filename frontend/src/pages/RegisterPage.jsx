import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/hirehub';
import {
  ArrowRight, Bell, Briefcase, CheckCircle2, ClipboardList, Eye, EyeOff,
  Lock, Search, Sparkles, User,
} from 'lucide-react';
import './LoginPage.css';

const FEATURES = [
  'Discover thousands of curated job listings',
  'Track every application in one place',
  'Get instant alerts for new opportunities',
];

const FEATURE_ICONS = [Search, ClipboardList, Bell];

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ ...form, username: form.username.trim(), role: 'USER' });
      setSuccess('Your account is ready. Taking you to sign in...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data || '';
      setError(typeof message === 'string' ? message : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      <aside className="lp-brand">
        <div className="lp-brand-inner">
          <div className="lp-logo">
            <div className="lp-logo-icon"><Briefcase size={26} /></div>
            <span className="lp-logo-text">HireHub</span>
          </div>

          <div className="lp-brand-copy">
            <h2 className="lp-brand-headline">
              Make your next<br />
              <span className="lp-gradient-text">move count.</span>
            </h2>
            <p className="lp-brand-tagline">
              Create your free account and bring your job search into one place.
            </p>
          </div>

          <ul className="lp-features">
            {FEATURES.map((text, index) => {
              const Icon = FEATURE_ICONS[index];
              return (
                <li key={text} className="lp-feature-item">
                  <span className="lp-feature-icon"><Icon size={16} /></span>
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
          <div className="lp-grid-overlay" />
        </div>
      </aside>

      <main className="lp-form-panel">
        <div className="lp-card">
          <div className="lp-card-glow" />

          <div className="lp-card-header">
            <div className="lp-mobile-logo">
              <div className="lp-logo-icon lp-logo-icon--sm"><Briefcase size={18} /></div>
              <span className="lp-logo-text lp-logo-text--sm">HireHub</span>
            </div>
            <h1 className="lp-card-title">Create your account</h1>
            <p className="lp-card-subtitle">Start finding opportunities that fit you.</p>
          </div>

          {error && (
            <div className="lp-alert-error" role="alert">
              <span className="lp-alert-dot" />
              {error}
            </div>
          )}
          {success && (
            <div className="lp-alert-success" role="status">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form" noValidate>
            <div className={`lp-field ${focused === 'username' ? 'lp-field--focused' : ''}`}>
              <label className="lp-label" htmlFor="reg-username">Username</label>
              <div className="lp-input-wrap">
                <User size={16} className="lp-input-icon" />
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  className="lp-input"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className={`lp-field ${focused === 'password' ? 'lp-field--focused' : ''}`}>
              <label className="lp-label" htmlFor="reg-password">Password</label>
              <div className="lp-input-wrap">
                <Lock size={16} className="lp-input-icon" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="lp-input lp-input--padded-right"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  autoComplete="new-password"
                  minLength={4}
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPass((visible) => !visible)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="lp-field-hint">Use at least 4 characters.</span>
            </div>

            <button
              type="submit"
              className="lp-submit-btn"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} className="lp-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="lp-card-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="lp-footer-link">
                Sign in <Sparkles size={12} />
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
