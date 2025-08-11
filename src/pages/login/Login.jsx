import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const API_URL = 'http://localhost:8080';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Login attempt with:', formData);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', res.status);

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Login failed');
      }

      const data = await res.json();
      console.log('Login successful, received data:', data);

      const userData = {
        id: data.id,
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };

      // Save user and token in AuthContext (this will also sync localStorage)
      login({ user: userData, token: data.token });

      // Navigate AFTER context has been updated
      setTimeout(() => {
        if (data.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      }, 100); // short delay ensures state sync before route check

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
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
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/auth/register">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
