import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById, deleteJob, applyForJob, checkApplied } from '../api/hirehub';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, Clock, Code2, ArrowLeft, Pencil,
  Trash2, X, ChevronRight, Send, CheckCircle2, Users
} from 'lucide-react';
import './JobDetailPage.css';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const [applied, setApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobById(id);
        setJob(data);
      } catch {
        setError('Job not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!user) return;
    checkApplied(id)
      .then(({ data }) => setApplied(data.applied))
      .catch(() => {});
  }, [id, user]);

  const handleApply = async () => {
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    try {
      await applyForJob(id);
      setApplied(true);
      setApplySuccess('🎉 Application submitted successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to apply. Try again.';
      setApplyError(msg);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(id);
      navigate('/jobs');
    } catch {
      setError('Failed to delete. Try again.');
      setShowDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page container">
        <div className="alert alert-error">{error || 'Job not found.'}</div>
        <Link to="/jobs" className="btn btn-ghost" style={{ marginTop: 16 }}>
          <ArrowLeft size={14} /> Back to Jobs
        </Link>
      </div>
    );
  }

  const xpLabel = job.reqExperience === 0 ? 'Fresher / Entry Level' : `${job.reqExperience}+ years experience`;

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/jobs" className="breadcrumb-link">Jobs</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span>{job.postProfile}</span>
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-card card">
              <div className="detail-header">
                <div className="detail-icon-wrap">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h1 className="detail-title">{job.postProfile}</h1>
                  <div className="detail-meta">
                    <span className="badge badge-cyan">
                      <Clock size={12} style={{ marginRight: 4 }} />{xpLabel}
                    </span>
                    <span className="badge badge-green">Job ID #{job.postId}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h2 className="detail-section-title">Job Description</h2>
                <p className="detail-desc">{job.postDesc}</p>
              </div>

              <div className="detail-section">
                <h2 className="detail-section-title">
                  <Code2 size={16} style={{ marginRight: 6, display: 'inline' }} />
                  Tech Stack Required
                </h2>
                <div className="detail-stack">
                  {job.postTechStack?.map((tech) => (
                    <span key={tech} className="badge badge-accent detail-badge">{tech}</span>
                  ))}
                </div>
              </div>

              {!isAdmin() && (
                <div className="apply-section">
                  {applySuccess && (
                    <div className="alert alert-success" style={{ marginBottom: 12 }}>
                      <CheckCircle2 size={16} /> {applySuccess}
                    </div>
                  )}
                  {applyError && (
                    <div className="alert alert-error" style={{ marginBottom: 12 }}>
                      ⚠ {applyError}
                    </div>
                  )}

                  {applied ? (
                    <div className="applied-badge">
                      <CheckCircle2 size={18} />
                      <span>You&apos;ve already applied for this position</span>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-lg apply-btn"
                      onClick={handleApply}
                      disabled={applyLoading}
                      id={`apply-job-${id}`}
                    >
                      {applyLoading
                        ? <><span className="spinner" /> Submitting…</>
                        : <><Send size={16} /> Apply Now</>
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-card card">
              <h3 className="sidebar-title">Quick Info</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Role</span>
                  <span className="info-value">{job.postProfile}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Experience</span>
                  <span className="info-value">{xpLabel}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Skills Required</span>
                  <span className="info-value">{job.postTechStack?.length || 0}</span>
                </div>
              </div>
            </div>

            {isAdmin() && (
              <div className="sidebar-card card sidebar-actions">
                <h3 className="sidebar-title">Admin Actions</h3>
                <Link
                  to={`/jobs/${id}/applicants`}
                  className="btn btn-outline w-full"
                  id={`view-applicants-${id}`}
                >
                  <Users size={14} /> View Applicants
                </Link>
                <Link to={`/jobs/${id}/edit`} className="btn btn-ghost w-full" id={`edit-detail-job-${id}`}>
                  <Pencil size={14} /> Edit Job
                </Link>
                <button
                  className="btn btn-danger w-full"
                  onClick={() => setShowDelete(true)}
                  id={`delete-detail-job-${id}`}
                >
                  <Trash2 size={14} /> Delete Job
                </button>
              </div>
            )}

            <Link to="/jobs" className="btn btn-ghost w-full">
              <ArrowLeft size={14} /> All Jobs
            </Link>
          </div>
        </div>
      </div>

      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger"><Trash2 size={24} /></div>
            <h3>Delete Job Post?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} id="confirm-delete-detail-btn">Yes, Delete</button>
            </div>
            <button className="modal-close" onClick={() => setShowDelete(false)}><X size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
