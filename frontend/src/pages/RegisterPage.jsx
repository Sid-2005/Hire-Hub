import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/hirehub';
import {
  ArrowRight, Briefcase, CheckCircle2, Eye, EyeOff,
  Lock, LogIn, Search, Shield, User, Zap,
} from 'lucide-react';
import './RegisterPage.css';

  /* ── Password strength scorer ── */
  function scorePassword(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 4) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 8) score++;
    return score; // 0–4
  }

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const BENEFIT_ITEMS = [
  { icon: Search, label: 'Browse jobs' },
  { icon: Zap, label: 'Quick apply' },
  { icon: Shield, label: 'Secure & free' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const strength = useMemo(() => scorePassword(form.password), [form.password]);

  const handleChange = (e) => {
    setForm((cur) => ({ ...cur, [e.target.name]: e.target.value }));
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
      setSuccess('Account created! Taking you to sign in…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data || '';
      setError(typeof msg === 'string' ? msg : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Progress step state */
  const usernameOk = form.username.trim().length > 0;
  const passwordOk = form.password.length >= 4;
  const step1Done = usernameOk;
  const step2Done = step1Done && passwordOk;

  return (
      <div className="rp-root">
        <div className="rp-blob rp-blob-1" />
        <div className="rp-blob rp-blob-2" />
        <div className="rp-blob rp-blob-3" />

            <div className="rp-card">
              <div className="rp-card-glow" />

                {/* Logo */}
                <div className="rp-logo">
                  <div className="rp-logo-icon"><Briefcase size={22} /></div>
                  <span className="rp-logo-text">HireHub</span>
                </div>

                {/* Progress steps */}
                <div className="rp-steps">
                  <div className="rp-step rp-step--done">
                    <div className="rp-step-dot"><CheckCircle2 size={14} /></div>
                    <span className="rp-step-label">Account</span>
                  </div>
                  <div className={`rp-step-line ${step1Done ? 'rp-step-line--done' : ''}`} />
                  <div className={`rp-step ${step1Done ? 'rp-step--active' : 'rp-step--idle'}`}>
                    <div className="rp-step-dot">2</div>
                    <span className="rp-step-label">Credentials</span>
                  </div>
                  <div className={`rp-step-line ${step2Done ? 'rp-step-line--done' : ''}`} />
                  <div className={`rp-step ${step2Done ? 'rp-step--active' : 'rp-step--idle'}`}>
                    <div className="rp-step-dot">3</div>
                    <span className="rp-step-label">Done</span>
                  </div>
                </div>

                {/* Header */}
                <div className="rp-header">
                  <h1 className="rp-title">
                    Join <span className="rp-title-accent">HireHub</span>
                  </h1>
                  <p className="rp-subtitle">Create your free account in seconds.</p>
                </div>

                  {/* Alerts */}
                  {error && (
                    <div className="rp-alert-error" role="alert">
                      <span className="rp-alert-dot" />
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="rp-alert-success" role="status">
                      <CheckCircle2 size={16} />
                      {success}
                    </div>
                  )}

                      <form onSubmit={handleSubmit} className="rp-form" noValidate>
                        {/* Username */}
                        <div className={`rp-field ${focused === 'username' ? 'rp-field--focused' : ''}`}>
                          <label className="rp-label" htmlFor="reg-username">Username</label>
                          <div className="rp-input-wrap">
                            <User size={16} className="rp-input-icon" />
                            <input
                              id="reg-username"
                              type="text"
                              name="username"
                              className="rp-input"
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

                            {/* Password + strength */}
                            <div className={`rp-field ${focused === 'password' ? 'rp-field--focused' : ''}`}>
                              <label className="rp-label" htmlFor="reg-password">Password</label>
                              <div className="rp-input-wrap">
                                <Lock size={16} className="rp-input-icon" />
                                <input
                                  id="reg-password"
                                  type={showPass ? 'text' : 'password'}
                                  name="password"
                                  className="rp-input rp-input--padded-right"
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
                                  className="rp-eye-btn"
                                  onClick={() => setShowPass((v) => !v)}
                                  aria-label={showPass ? 'Hide password' : 'Show password'}
                                >
                                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>

                                    {/* Strength meter (shows once user starts typing) */}
                                    {form.password.length > 0 && (
                                      <div className="rp-strength">
                                        <div className="rp-strength-bar">
                                          {[1, 2, 3, 4].map((seg) => (
                                            <div
                                              key={seg}
                                              className={`rp-strength-seg ${strength >= seg ? `rp-strength-seg--active-${strength}` : ''}`}
                                            />
                                          ))}
                                        </div>
                                        <span className={`rp-strength-label rp-strength-label--${strength}`}>
                                          {STRENGTH_LABELS[strength]}
                                        </span>
                                      </div>
            )}
                                  {form.password.length === 0 && (
                                    <span className="rp-field-hint">Use at least 4 characters.</span>
                                  )}
                                </div>

                                  {/* Submit */}
                                  <button
                                    type="submit"
                                    className="rp-submit-btn"
                                    disabled={loading}
                                    id="register-submit-btn"
                                  >
                                    {loading ? (
                                      <span className="rp-spinner" />
                                    ) : (
                                      <>
                                        <span>Create Account</span>
                                        <ArrowRight size={17} className="rp-btn-arrow" />
                                      </>
                                    )}
                                  </button>
                              </form>

                              {/* Quick benefits */}
                              <div className="rp-benefits">
                                {BENEFIT_ITEMS.map(({ icon: Icon, label }) => (
                                  <div key={label} className="rp-benefit">
                                    <div className="rp-benefit-icon"><Icon size={15} /></div>
                                    {label}
                                  </div>
                                ))}
                              </div>

                            {/* Footer */}
                            <div className="rp-footer">
                              Already have an account?{' '}
                              <Link to="/login" className="rp-footer-link">
                                Sign in <LogIn size={12} />
                              </Link>
                            </div>
      </div>
                  </div>
                  );
}
