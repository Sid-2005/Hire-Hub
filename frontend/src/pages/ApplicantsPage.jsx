import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobApplications, getJobById } from '../api/hirehub';
import {
  ArrowLeft, Users, User, CalendarDays,
  Briefcase, ChevronRight, Search, Download
} from 'lucide-react';
import './ApplicantsPage.css';

export default function ApplicantsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          getJobById(id),
          getJobApplications(id),
        ]);
        setJob(jobRes.data);
        setApplicants(appRes.data);
        setFiltered(appRes.data);
      } catch {
        setError('Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(applicants.filter((a) => a.username.toLowerCase().includes(q)));
  }, [search, applicants]);

  const formatDate = (dt) => {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleExportCSV = () => {
    const rows = [
      ['#', 'Username', 'Job Profile', 'Applied At'],
      ...filtered.map((a, i) => [i + 1, a.username, a.jobProfile, formatDate(a.appliedAt)]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applicants-job-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="breadcrumb">
          <Link to="/jobs" className="breadcrumb-link">Jobs</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <Link to={`/jobs/${id}`} className="breadcrumb-link">{job?.postProfile || `Job #${id}`}</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span>Applicants</span>
        </div>

        <div className="appl-header">
          <div className="appl-header-left">
            <div className="appl-icon">
              <Users size={24} />
            </div>
            <div>
              <h1 className="appl-title">
                Applicants for <span className="gradient-text">{job?.postProfile}</span>
              </h1>
              <p className="appl-subtitle">
                {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="appl-header-actions">
            <Link to={`/jobs/${id}`} className="btn btn-ghost btn-sm">
              <ArrowLeft size={14} /> Back to Job
            </Link>
            {applicants.length > 0 && (
              <button className="btn btn-outline btn-sm" onClick={handleExportCSV} id="export-csv-btn">
                <Download size={14} /> Export CSV
              </button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        <div className="appl-stats">
          <div className="appl-stat-card card">
            <div className="appl-stat-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent-light)' }}>
              <Users size={20} />
            </div>
            <div>
              <div className="appl-stat-value">{applicants.length}</div>
              <div className="appl-stat-label">Total Applicants</div>
            </div>
          </div>
          <div className="appl-stat-card card">
            <div className="appl-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green-light)' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="appl-stat-value">{job?.reqExperience === 0 ? 'Fresher' : `${job?.reqExperience}+ yrs`}</div>
              <div className="appl-stat-label">Required Experience</div>
            </div>
          </div>
          <div className="appl-stat-card card">
            <div className="appl-stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: 'var(--cyan)' }}>
              <CalendarDays size={20} />
            </div>
            <div>
              <div className="appl-stat-value">
                {applicants.length > 0
                  ? formatDate(applicants[applicants.length - 1]?.appliedAt).split(',')[0]
                  : '—'}
              </div>
              <div className="appl-stat-label">Latest Application</div>
            </div>
          </div>
        </div>

        {applicants.length > 0 && (
          <div className="appl-search">
            <div className="input-wrap">
              <Search size={15} className="input-icon" />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Search applicants by username…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="applicants-search"
              />
            </div>
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <h3>No applicants yet</h3>
            <p>Nobody has applied for this position yet.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={64} />
            <h3>No match found</h3>
            <p>No applicants match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="appl-table-wrap card">
            <table className="appl-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Position</th>
                  <th>Applied At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, index) => (
                  <tr key={app.id} className="appl-row">
                    <td className="appl-idx">{index + 1}</td>
                    <td>
                      <div className="appl-user">
                        <div className="appl-avatar">
                          <User size={14} />
                        </div>
                        <span className="appl-username">{app.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-accent">{app.jobProfile}</span>
                    </td>
                    <td className="appl-date">
                      <CalendarDays size={13} style={{ marginRight: 6, opacity: 0.5 }} />
                      {formatDate(app.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
