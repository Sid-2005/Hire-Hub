import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/hirehub';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, Lock, Eye, EyeOff, ArrowRight,
  Sparkles, CheckCircle2, Search, ClipboardList, Bell,
  User,
} from 'lucide-react';
import './LoginPage.css';

const FEATURES = [
  { icon: Search,        text: 'Discover thousands of curated job listings' },
  { icon: ClipboardList, text: 'Track every application in one place'        },
  { icon: Bell,          text: 'Get instant alerts for new opportunities'     },
];

export default function LoginPage() {
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState('');
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      if (!data || data === 'Fail') {
        setError('Invalid username or password.');
        return;
      }
      login(data);
      navigate('/jobs');
    } catch (err) {
      const msg = err.response?.data || '';
      setError(msg || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      {/* ── Left branding panel ── */}
      <aside className="lp-brand">
        <div className="lp-brand-inner">
          {/* Logo */}
          <div className="lp-logo">
            <div className="lp-logo-icon">
              <Briefcase size={26} />
            </div>
            <span className="lp-logo-text">HireHub</span>
          </div>

          <div className="lp-brand-copy">
            <h2 className="lp-brand-headline">
              Your next career<br />
              <span className="lp-gradient-text">move starts here.</span>
            </h2>
            <p className="lp-brand-tagline">
              Join thousands of professionals who found their dream roles through HireHub.
            </p>
          </div>

          <ul className="lp-features">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="lp-feature-item">
                <span className="lp-feature-icon">
                  <CheckCircle2 size={16} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* Decorative grid */}
          <div className="lp-grid-overlay" />
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="lp-form-panel">
        <div className="lp-card">
          {/* Card glow */}
          <div className="lp-card-glow" />

          <div className="lp-card-header">
            {/* Mobile-only logo */}
            <div className="lp-mobile-logo">
              <div className="lp-logo-icon lp-logo-icon--sm">
                <Briefcase size={18} />
              </div>
              <span className="lp-logo-text lp-logo-text--sm">HireHub</span>
            </div>

            <h1 className="lp-card-title">Welcome back</h1>
            <p className="lp-card-subtitle">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="lp-alert-error" role="alert">
              <span className="lp-alert-dot" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="lp-form" noValidate>
            {/* Username */}
            <div className={`lp-field ${focused === 'username' ? 'lp-field--focused' : ''}`}>
              <label className="lp-label" htmlFor="login-username">Username</label>
              <div className="lp-input-wrap">
                <User size={16} className="lp-input-icon" />
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  className="lp-input"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className={`lp-field ${focused === 'password' ? 'lp-field--focused' : ''}`}>
              <label className="lp-label" htmlFor="login-password">Password</label>
              <div className="lp-input-wrap">
                <Lock size={16} className="lp-input-icon" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  className="lp-input lp-input--padded-right"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="lp-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} className="lp-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="lp-card-footer">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="lp-footer-link">
                Create one <Sparkles size={12} />
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
