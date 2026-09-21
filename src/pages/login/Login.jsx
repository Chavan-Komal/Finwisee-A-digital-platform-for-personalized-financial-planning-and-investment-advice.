import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { dashboardPathFor, useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to={dashboardPathFor(user)} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fillDemo = (email, password) => setFormData({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/login', formData);
      const { token, ...userData } = data;
      login({ user: userData, token });

      // Return to the page that required login (if it belongs to this role), else the dashboard
      const from = location.state?.from;
      const target = from && (from !== '/admin' || userData.role === 'ADMIN') ? from : dashboardPathFor(userData);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1>Finwisee</h1>
            <p>Welcome back! Please sign in to your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>

          <div className="demo-accounts">
            <span>Demo accounts:</span>
            <button type="button" onClick={() => fillDemo('john.doe@example.com', 'user123')}>User</button>
            <button type="button" onClick={() => fillDemo('admin@finwise.com', 'admin123')}>Admin</button>
          </div>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/auth/register">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
