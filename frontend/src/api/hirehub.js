import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    '[HireHub] VITE_API_BASE_URL is not defined.\n' +
    'Local dev: set it in frontend/.env\n' +
    'Production: set it in your hosting platform environment variables.'
  );
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hirehub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hirehub_token');
      localStorage.removeItem('hirehub_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const loginUser = (creds) => api.post('/login', creds);
export const registerUser = (data) => api.post('/register', data);

export const getAllJobs = () => api.get('/jobs');
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const searchJobs = (keyword) => api.get('/jobs/search', { params: { keyword } });
export const filterJobs = (skill, years) => {
  const params = {};
  if (skill) params.skill = skill;
  if (years !== undefined && years !== '') params.years = years;
  return api.get('/jobs/filter', { params });
};
export const createJob = (job) => api.post('/jobs', job);
export const updateJob = (id, job) => api.put(`/jobs/${id}`, job);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

export const applyForJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const checkApplied = (jobId) => api.get(`/jobs/${jobId}/applied`);
export const getJobApplications = (jobId) => api.get(`/jobs/${jobId}/applications`);
export const getAllApplications = () => api.get('/applications');
export const getMyApplications = () => api.get('/my-applications');

export default api;
