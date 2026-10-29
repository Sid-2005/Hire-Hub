import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Search, Shield, Zap, ChevronRight, Code2, Users } from 'lucide-react';
import './HomePage.css';

const FEATURES = [
  {
    icon: <Search size={22} />,
    title: 'Smart Search',
    desc: 'Search jobs by keyword, skill, or experience level instantly.',
    color: 'accent',
  },
  {
    icon: <Shield size={22} />,
    title: 'Secure Auth',
    desc: 'JWT-based authentication with role-based access control.',
    color: 'green',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-time Filtering',
    desc: 'Filter by tech stack and experience level to find your perfect match.',
    color: 'yellow',
  },
  {
    icon: <Code2 size={22} />,
    title: 'Tech-first Jobs',
    desc: 'Every listing includes a detailed tech stack so you know exactly what\'s needed.',
    color: 'cyan',
  },
];

const STATS = [
  { value: '500+', label: 'Active Listings' },
  { value: '200+', label: 'Companies' },
  { value: '50+', label: 'Technologies' },
  { value: '10K+', label: 'Placements' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="container hero-content">
          <div className="hero-badge">
            <Zap size={12} /> Now with AI-powered job matching
          </div>
          <h1 className="hero-title">
            Find Your Dream<br />
            <span className="gradient-text">Tech Career</span>
          </h1>
          <p className="hero-subtitle">
            HireHub connects talented developers with top companies.<br />
            Search, filter, and apply to hundreds of curated tech positions.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/jobs" className="btn btn-primary btn-lg">
                Browse Jobs <ChevronRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <ChevronRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="stats-row">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything you need to<br />
              <span className="gradient-text">land the role</span>
            </h2>
            <p className="section-subtitle">
              A complete hiring platform built for modern tech professionals.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className={`feature-icon feature-icon-${f.color}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <div className="cta-icon"><Users size={28} /></div>
              <h2 className="cta-title">Ready to get hired?</h2>
              <p className="cta-subtitle">Join thousands of developers who found their dream job on HireHub.</p>
              {!user && (
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Free Account <ChevronRight size={18} />
                </Link>
              )}
              {user && (
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  <Briefcase size={18} /> View Open Positions
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
