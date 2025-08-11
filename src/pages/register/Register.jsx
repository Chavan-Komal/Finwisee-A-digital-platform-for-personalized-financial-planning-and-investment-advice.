import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const API_URL = 'http://localhost:8080';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Navigate after successful registration when user is available
  useEffect(() => {
    if (user && success) {
      console.log('User authenticated after registration, navigating to dashboard:', user);
      navigate('/user');
    }
  }, [user, success, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      console.log('Registration attempt with:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
      });
      
      console.log('Registration response status:', res.status);
      
      if (res.status === 409) {
        setErrors({ general: 'Email already in use' });
        return;
      }
      if (!res.ok) {
        const txt = await res.text();
        console.error('Registration failed with status:', res.status, 'response:', txt);
        throw new Error(txt || 'Registration failed');
      }
      const data = await res.json();
      
      console.log('Registration successful, received data:', data);

      const userData = {
        id: data.id,
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };
      
      console.log('Calling login with userData:', userData, 'token:', data.token);
      
      // Call login to update the auth state
      login({ user: userData, token: data.token });
      
      // Set success state to trigger navigation
      setSuccess(true);
      
      console.log('Registration completed, success states set');

    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Registration Successful!</h2>
            <p>Your account has been created successfully. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1>Join Finwisee</h1>
            <p>Create your account to get started</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {errors.general}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                />
              </div>
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                />
              </div>
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

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
                placeholder="Enter your email address"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <i className="fas fa-phone input-icon"></i>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`form-input ${errors.phone ? 'error' : ''}`}
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-row">
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
                  placeholder="Create a password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
            {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
          </div>

          <button 
            type="submit" 
            className={`register-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/auth/login">Sign in here</a></p>
        </div>
        
        {/* Debug section - remove in production */}
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
          <h4>Debug Info:</h4>
          <p>Current user: {JSON.stringify(user)}</p>
          <p>Registration success: {success ? 'true' : 'false'}</p>
          <p>localStorage userInfo: {localStorage.getItem('userInfo')}</p>
          <p>localStorage token: {localStorage.getItem('token')}</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
