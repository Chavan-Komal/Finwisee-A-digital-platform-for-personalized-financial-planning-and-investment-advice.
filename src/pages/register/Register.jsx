import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { dashboardPathFor, useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import '../login/Login.css'; // shared .auth-page shell
import './Register.css';

const BENEFITS = [
  { icon: 'fa-chart-pie', title: 'A plan built on your numbers', text: 'Income, risk appetite and goals shape every recommendation you see.' },
  { icon: 'fa-bullseye', title: 'Goals with real projections', text: 'Know the month you will hit each target at your current savings rate.' },
  { icon: 'fa-user-tie', title: 'Certified advisors included', text: 'Book consultations and message your advisor from the dashboard.' },
];

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Strong', 'Very strong'];

/** Rough password strength: length plus variety of character types. */
const scorePassword = (password) => {
  if (!password) return -1;
  if (password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  if (isAuthenticated() && !success) {
    return <Navigate to={dashboardPathFor(user)} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Please enter a valid 10-digit phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const data = await api.post('/auth/register', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      const { token, ...userData } = data;
      login({ user: userData, token });
      setSuccess(true);
      setTimeout(() => navigate('/user', { replace: true }), 1400);
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = scorePassword(formData.password);
  const fieldClass = (name) => `auth-input-wrap ${errors[name] ? 'has-error' : ''}`;

  if (success) {
    return (
      <div className="auth-page auth-page-single">
        <main className="auth-main">
          <div className="auth-card reg-success">
            <div className="reg-success-icon"><i className="fas fa-check"></i></div>
            <h1>You&apos;re all set, {formData.firstName}!</h1>
            <p>Your account is ready. Taking you to your dashboard...</p>
            <i className="fas fa-spinner fa-spin reg-success-spinner"></i>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* ---------- Brand panel ---------- */}
      <aside className="auth-aside">
        <div className="auth-aside-inner">
          <Link to="/home" className="auth-brand">
            <span className="auth-brand-mark"><i className="fas fa-chart-line"></i></span>
            Finwisee
          </Link>

          <h2 className="auth-aside-title">Start planning in under two minutes.</h2>
          <p className="auth-aside-lede">
            Create a free account to set goals, book advisors and keep your financial documents in one place.
          </p>

          <ul className="auth-highlights">
            {BENEFITS.map((item) => (
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
            <i className="fas fa-lock"></i> Free to join · No card required
          </p>
        </div>
      </aside>

      {/* ---------- Form ---------- */}
      <main className="auth-main">
        <div className="auth-card reg-card">
          <Link to="/home" className="auth-back">
            <i className="fas fa-arrow-left"></i> Back to home
          </Link>

          <header className="auth-head">
            <h1>Create your account</h1>
            <p>Already have one? <Link to="/auth/login">Sign in instead</Link></p>
          </header>

          {errors.general && (
            <div className="auth-error" role="alert">
              <i className="fas fa-circle-exclamation"></i>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="reg-row">
              <div className="auth-field">
                <label htmlFor="firstName">First name</label>
                <div className={fieldClass('firstName')}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName}
                    onChange={handleInputChange} placeholder="John" autoComplete="given-name" />
                </div>
                {errors.firstName && <span className="reg-error">{errors.firstName}</span>}
              </div>

              <div className="auth-field">
                <label htmlFor="lastName">Last name</label>
                <div className={fieldClass('lastName')}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName}
                    onChange={handleInputChange} placeholder="Doe" autoComplete="family-name" />
                </div>
                {errors.lastName && <span className="reg-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className={fieldClass('email')}>
                <i className="fas fa-envelope"></i>
                <input type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder="you@example.com" autoComplete="email" />
              </div>
              {errors.email && <span className="reg-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="phone">Phone number</label>
              <div className={fieldClass('phone')}>
                <i className="fas fa-phone"></i>
                <input type="tel" id="phone" name="phone" value={formData.phone}
                  onChange={handleInputChange} placeholder="10-digit mobile number" autoComplete="tel" />
              </div>
              {errors.phone && <span className="reg-error">{errors.phone}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className={fieldClass('password')}>
                <i className="fas fa-lock"></i>
                <input type={showPassword ? 'text' : 'password'} id="password" name="password"
                  value={formData.password} onChange={handleInputChange}
                  placeholder="At least 8 characters" autoComplete="new-password" />
                <button type="button" className="auth-reveal" onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {formData.password && (
                <div className="reg-strength" aria-live="polite">
                  <div className="reg-strength-bars">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={i < strength ? `on s${strength}` : ''} />
                    ))}
                  </div>
                  <span className={`reg-strength-label s${strength}`}>{STRENGTH_LABELS[strength] ?? ''}</span>
                </div>
              )}
              {errors.password && <span className="reg-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className={fieldClass('confirmPassword')}>
                <i className="fas fa-lock"></i>
                <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleInputChange}
                  placeholder="Re-enter your password" autoComplete="new-password" />
                {formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <i className="fas fa-circle-check reg-match"></i>
                )}
              </div>
              {errors.confirmPassword && <span className="reg-error">{errors.confirmPassword}</span>}
            </div>

            <label className={`reg-terms ${errors.agreeTerms ? 'has-error' : ''}`}>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            {errors.agreeTerms && <span className="reg-error">{errors.agreeTerms}</span>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Creating account...</>
              ) : (
                <><i className="fas fa-user-plus"></i> Create free account</>
              )}
            </button>
          </form>

          <p className="auth-foot">
            Just exploring? <Link to="/auth/login">Try a demo account</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
