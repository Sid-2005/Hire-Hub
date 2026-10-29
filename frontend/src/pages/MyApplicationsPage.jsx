import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../api/hirehub';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CalendarDays, ChevronRight, Send } from 'lucide-react';
import './MyApplicationsPage.css';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => setError('Failed to load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="my-appl-header">
          <div className="my-appl-icon">
            <Send size={22} />
          </div>
          <div>
            <h1 className="my-appl-title">
              My <span className="gradient-text">Applications</span>
            </h1>
            <p className="my-appl-subtitle">
              Hi <strong>{user?.username}</strong> — you&apos;ve applied to{' '}
              <strong>{applications.length}</strong> position{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        {applications.length === 0 ? (
          <div className="empty-state">
            <Send size={64} />
            <h3>No applications yet</h3>
            <p>Start exploring and apply to positions that interest you.</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>
              <Briefcase size={15} /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="my-appl-grid">
            {applications.map((app) => (
              <div key={app.id} className="my-appl-card card">
                <div className="my-appl-card-top">
                  <div className="my-appl-job-icon">
                    <Briefcase size={18} />
                  </div>
                  <span className="badge badge-green">Applied</span>
                </div>
                <h2 className="my-appl-job-title">{app.jobProfile}</h2>
                <div className="my-appl-date">
                  <CalendarDays size={13} />
                  {formatDate(app.appliedAt)}
                </div>
                <div className="my-appl-card-footer">
                  <Link
                    to={`/jobs/${app.jobPostId}`}
                    className="btn btn-outline btn-sm"
                    id={`view-applied-job-${app.jobPostId}`}
                  >
                    View Job <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
