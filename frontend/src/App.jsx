import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import JobFormPage from './pages/JobFormPage';
import ApplicantsPage from './pages/ApplicantsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/jobs" element={
            <ProtectedRoute><JobsPage /></ProtectedRoute>
          } />
          <Route path="/jobs/:id" element={
            <ProtectedRoute><JobDetailPage /></ProtectedRoute>
          } />

          <Route path="/jobs/new" element={
            <ProtectedRoute adminOnly><JobFormPage /></ProtectedRoute>
          } />
          <Route path="/jobs/:id/edit" element={
            <ProtectedRoute adminOnly><JobFormPage /></ProtectedRoute>
          } />
          <Route path="/jobs/:id/applicants" element={
            <ProtectedRoute adminOnly><ApplicantsPage /></ProtectedRoute>
          } />

          <Route path="/my-applications" element={
            <ProtectedRoute><MyApplicationsPage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
