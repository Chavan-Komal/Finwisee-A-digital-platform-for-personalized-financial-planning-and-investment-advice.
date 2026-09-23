import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { dashboardPathFor, useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import './Login.css';

const HIGHLIGHTS = [
  { icon: 'fa-bullseye', title: 'Goals that track themselves', text: 'See exactly when you will reach each goal at your current savings rate.' },
  { icon: 'fa-calendar-check', title: 'Advisors on your schedule', text: 'Book consultations and message certified advisors from your dashboard.' },
  { icon: 'fa-shield-halved', title: 'Documents kept private', text: 'Share statements securely — only you and your advisor can open them.' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const signIn = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/login', credentials);
      const { token, ...userData } = data;
      login({ user: userData, token });

      // Return to the page that required login (if this role may see it), else the dashboard
      const from = location.state?.from;
      const target = from && (from !== '/admin' || userData.role === 'ADMIN') ? from : dashboardPathFor(userData);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(formData);
  };

  const signInWithDemo = (email, password) => {
    setFormData({ email, password });
    signIn({ email, password });
  };

  return (
    <div className="auth-page">
      {/* ---------- Brand panel ---------- */}
      <aside className="auth-aside">
        <div className="auth-aside-inner">
          <Link to="/home" className="auth-brand">
            <span className="auth-brand-mark"><i className="fas fa-chart-line"></i></span>
            Finwisee
          </Link>

          <h2 className="auth-aside-title">Your financial plan, always within reach.</h2>
          <p className="auth-aside-lede">
            Sign in to track your goals, talk to your advisor and keep every document in one secure place.
          </p>

          <ul className="auth-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title}>
                <span className="auth-highlight-icon"><i className={`fas ${item.icon}`}></i></span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>

          <p className="auth-aside-foot">
            <i className="fas fa-lock"></i> SEBI registered · Bank-level encryption
          </p>
        </div>
      </aside>

      {/* ---------- Form ---------- */}
      <main className="auth-main">
        <div className="auth-card">
          <Link to="/home" className="auth-back">
            <i className="fas fa-arrow-left"></i> Back to home
          </Link>

          <header className="auth-head">
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard.</p>
          </header>

          {error && (
            <div className="auth-error" role="alert">
              <i className="fas fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-reveal"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
              ) : (
                <><i className="fas fa-arrow-right-to-bracket"></i> Sign in</>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or explore with a demo account</span></div>

          <div className="auth-demos">
            <button type="button" className="auth-demo" disabled={isLoading}
              onClick={() => signInWithDemo('john.doe@example.com', 'user123')}>
              <span className="auth-demo-icon"><i className="fas fa-user"></i></span>
              <span className="auth-demo-body">
                <strong>Client demo</strong>
                <span>Goals, appointments, documents</span>
              </span>
              <i className="fas fa-chevron-right"></i>
            </button>

            <button type="button" className="auth-demo" disabled={isLoading}
              onClick={() => signInWithDemo('admin@finwise.com', 'admin123')}>
              <span className="auth-demo-icon admin"><i className="fas fa-user-shield"></i></span>
              <span className="auth-demo-body">
                <strong>Admin demo</strong>
                <span>Users, reviews, orders</span>
              </span>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <p className="auth-foot">
            New to Finwisee? <Link to="/auth/register">Create a free account</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
