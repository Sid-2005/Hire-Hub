import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User, Plus, ChevronRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Briefcase size={20} />
          </div>
          <span className="navbar-logo-text">
            Hire<span className="gradient-text">Hub</span>
          </span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link
                to="/jobs"
                className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
              >
                Jobs
              </Link>
              {!isAdmin() && (
                <Link
                  to="/my-applications"
                  className={`nav-link ${isActive('/my-applications') ? 'active' : ''}`}
                >
                  My Applications
                </Link>
              )}
              {isAdmin() && (
                <Link
                  to="/jobs/new"
                  className={`nav-link ${isActive('/jobs/new') ? 'active' : ''}`}
                >
                  <Plus size={15} />
                  Post Job
                </Link>
              )}
            </>
          ) : null}
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="navbar-user">
              <div className="user-chip">
                <div className="user-avatar">
                  <User size={14} />
                </div>
                <span className="user-name">{user.username}</span>
                <span className={`user-role-badge ${user.role?.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
