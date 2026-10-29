import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, searchJobs, filterJobs, deleteJob } from '../api/hirehub';
import { useAuth } from '../context/AuthContext';
import {
  Search, Filter, Plus, Briefcase, Clock, Code2,
  Trash2, Pencil, ChevronRight, X, RotateCcw
} from 'lucide-react';
import './JobsPage.css';

const TECH_SUGGESTIONS = ['Java', 'Python', 'React', 'Spring Boot', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript'];

export default function JobsPage() {
  const { isAdmin } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterYears, setFilterYears] = useState('');
  const [activeFilter, setActiveFilter] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getAllJobs();
      setJobs(data);
    } catch {
      setError('Failed to load jobs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQ.trim()) { fetchAll(); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await searchJobs(searchQ.trim());
      setJobs(data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await filterJobs(filterSkill, filterYears !== '' ? Number(filterYears) : undefined);
      setJobs(data || []);
      setActiveFilter(true);
    } catch {
      setJobs([]);
      setActiveFilter(true);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQ('');
    setFilterSkill('');
    setFilterYears('');
    setActiveFilter(false);
    fetchAll();
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.postId !== id));
    } catch {
      setError('Failed to delete job.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="jobs-page page">
      <div className="container">
        <div className="jobs-header">
          <div>
            <h1 className="jobs-title">
              Job <span className="gradient-text">Listings</span>
            </h1>
            <p className="jobs-subtitle">
              {jobs.length} position{jobs.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {isAdmin() && (
            <Link to="/jobs/new" className="btn btn-primary">
              <Plus size={16} /> Post New Job
            </Link>
          )}
        </div>

        <div className="search-filter-bar">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-wrap" style={{ flex: 1 }}>
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Search jobs, skills, roles…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                id="jobs-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary" id="jobs-search-btn">Search</button>
          </form>

          <form className="filter-form" onSubmit={handleFilter}>
            <div className="filter-inputs">
              <div className="input-wrap">
                <Code2 size={15} className="input-icon" />
                <input
                  type="text"
                  className="form-input has-icon"
                  placeholder="Skill (e.g. Java)"
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  list="skill-suggestions"
                  id="filter-skill-input"
                />
                <datalist id="skill-suggestions">
                  {TECH_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div className="input-wrap">
                <Clock size={15} className="input-icon" />
                <input
                  type="number"
                  className="form-input has-icon"
                  placeholder="Min. years"
                  min="0"
                  value={filterYears}
                  onChange={(e) => setFilterYears(e.target.value)}
                  id="filter-years-input"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-outline" id="filter-apply-btn">
              <Filter size={14} /> Filter
            </button>
            {activeFilter && (
              <button type="button" className="btn btn-ghost" onClick={resetFilters} id="filter-reset-btn">
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </form>

          <div className="tech-tags">
            {TECH_SUGGESTIONS.slice(0, 5).map((tag) => (
              <button
                key={tag}
                className={`tech-tag ${filterSkill === tag ? 'active' : ''}`}
                onClick={() => { setFilterSkill(tag); }}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        {loading ? (
          <div className="jobs-loading">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="job-skeleton" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={64} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
            {activeFilter && (
              <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={resetFilters}>
                <RotateCcw size={14} /> Show all jobs
              </button>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.postId}
                job={job}
                isAdmin={isAdmin()}
                onDeleteClick={() => setDeleteId(job.postId)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon danger">
              <Trash2 size={24} />
            </div>
            <h3>Delete Job Post?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)} id="confirm-delete-btn">
                Yes, Delete
              </button>
            </div>
            <button className="modal-close" onClick={() => setDeleteId(null)}><X size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, isAdmin, onDeleteClick }) {
  const xpLabel = job.reqExperience === 0 ? 'Fresher' : `${job.reqExperience}+ yrs`;

  return (
    <div className="job-card card">
      <div className="job-card-top">
        <div className="job-icon-wrap">
          <Briefcase size={18} />
        </div>
        <div className="job-meta">
          <span className="badge badge-cyan">
            <Clock size={11} style={{ marginRight: 4 }} />
            {xpLabel}
          </span>
        </div>
      </div>

      <h2 className="job-title">{job.postProfile}</h2>
      <p className="job-desc">{job.postDesc}</p>

      <div className="job-stack">
        {job.postTechStack?.slice(0, 4).map((tech) => (
          <span key={tech} className="badge badge-accent">{tech}</span>
        ))}
        {job.postTechStack?.length > 4 && (
          <span className="badge badge-accent">+{job.postTechStack.length - 4}</span>
        )}
      </div>

      <div className="job-card-footer">
        <Link to={`/jobs/${job.postId}`} className="btn btn-outline btn-sm" id={`view-job-${job.postId}`}>
          View Details <ChevronRight size={13} />
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Link to={`/jobs/${job.postId}/edit`} className="btn btn-ghost btn-sm" id={`edit-job-${job.postId}`}>
              <Pencil size={13} />
            </Link>
            <button className="btn btn-danger btn-sm" onClick={onDeleteClick} id={`delete-job-${job.postId}`}>
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
