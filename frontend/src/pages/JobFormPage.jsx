import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById, createJob, updateJob } from '../api/hirehub';
import { ArrowLeft, Plus, X, Briefcase, Save } from 'lucide-react';
import './JobFormPage.css';

export default function JobFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    postProfile: '',
    postDesc: '',
    reqExperience: 0,
    postTechStack: [],
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data } = await getJobById(id);
        setForm({
          postProfile: data.postProfile || '',
          postDesc: data.postDesc || '',
          reqExperience: data.reqExperience ?? 0,
          postTechStack: data.postTechStack || [],
        });
      } catch {
        setError('Failed to load job.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetch();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'reqExperience' ? Number(value) : value }));
    setError('');
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t || form.postTechStack.includes(t)) return;
    setForm((f) => ({ ...f, postTechStack: [...f.postTechStack, t] }));
    setTechInput('');
  };

  const removeTech = (tech) => {
    setForm((f) => ({ ...f, postTechStack: f.postTechStack.filter((t) => t !== tech) }));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTech(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.postProfile.trim()) { setError('Job title is required.'); return; }
    if (!form.postDesc.trim()) { setError('Job description is required.'); return; }
    if (form.postTechStack.length === 0) { setError('Add at least one tech skill.'); return; }

    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateJob(id, form);
      } else {
        await createJob(form);
      }
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="form-page-header">
          <Link to="/jobs" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div>
            <h1 className="form-page-title">
              {isEdit ? 'Edit' : 'Post New'}{' '}
              <span className="gradient-text">Job</span>
            </h1>
            <p className="form-page-subtitle">
              {isEdit ? 'Update the job posting details' : 'Fill in the details to post a new position'}
            </p>
          </div>
        </div>

        <div className="form-page-layout">
          <div className="form-page-card card">
            <div className="form-page-icon">
              <Briefcase size={24} />
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-group">
                <label className="form-label" htmlFor="job-profile">Job Title / Profile *</label>
                <input
                  id="job-profile"
                  name="postProfile"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Java Developer"
                  value={form.postProfile}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-desc">Job Description *</label>
                <textarea
                  id="job-desc"
                  name="postDesc"
                  className="form-input form-textarea"
                  placeholder="Describe the role, responsibilities, and requirements…"
                  value={form.postDesc}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-exp">
                  Required Experience (years)
                </label>
                <input
                  id="job-exp"
                  name="reqExperience"
                  type="number"
                  className="form-input"
                  min="0"
                  max="30"
                  value={form.reqExperience}
                  onChange={handleChange}
                />
                <span className="form-hint">
                  {form.reqExperience === 0 ? 'Fresher / Entry Level' : `${form.reqExperience}+ years`}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-tech">Tech Stack *</label>
                <div className="tech-input-row">
                  <input
                    id="job-tech"
                    type="text"
                    className="form-input"
                    placeholder="Type a technology and press Enter or +"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                  />
                  <button type="button" className="btn btn-outline" onClick={addTech} id="add-tech-btn">
                    <Plus size={16} />
                  </button>
                </div>

                {form.postTechStack.length > 0 && (
                  <div className="tech-chips">
                    {form.postTechStack.map((tech) => (
                      <span key={tech} className="tech-chip">
                        {tech}
                        <button
                          type="button"
                          className="tech-chip-remove"
                          onClick={() => removeTech(tech)}
                          aria-label={`Remove ${tech}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Link to="/jobs" className="btn btn-ghost">Cancel</Link>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="save-job-btn">
                  {loading ? <span className="spinner" /> : (
                    <><Save size={16} /> {isEdit ? 'Save Changes' : 'Post Job'}</>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="form-preview card">
            <p className="preview-label">Live Preview</p>
            <div className="preview-title">{form.postProfile || 'Job Title'}</div>
            <p className="preview-desc">{form.postDesc || 'Job description will appear here…'}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {form.postTechStack.map((t) => (
                <span key={t} className="badge badge-accent">{t}</span>
              ))}
            </div>
            {form.reqExperience > 0 && (
              <span className="badge badge-cyan" style={{ marginTop: 10, display: 'inline-flex' }}>
                {form.reqExperience}+ yrs exp
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
