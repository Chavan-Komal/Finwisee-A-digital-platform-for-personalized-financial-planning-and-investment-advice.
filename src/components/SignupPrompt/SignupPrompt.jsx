import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPrompt.css';

const SignupPrompt = ({ onClose, show = false }) => {
  const [isVisible, setIsVisible] = useState(show);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleSignup = () => {
    navigate('/auth/register');
    handleClose();
  };

  const handleLogin = () => {
    navigate('/auth/login');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="signup-prompt-overlay">
      <div className="signup-prompt-modal">
        <button className="close-btn" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="signup-prompt-content">
          <div className="prompt-header">
            <div className="prompt-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h2>Join Finwisee Today!</h2>
            <p>Create your account to unlock exclusive features and personalized financial insights.</p>
          </div>

          <div className="benefits-list">
            <div className="benefit-item">
              <i className="fas fa-calculator"></i>
              <div>
                <h4>Advanced Calculators</h4>
                <p>Access to all financial planning calculators</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-chart-line"></i>
              <div>
                <h4>Personalized Insights</h4>
                <p>Get tailored financial recommendations</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Secure & Private</h4>
                <p>Your data is protected with bank-level security</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <i className="fas fa-headset"></i>
              <div>
                <h4>Expert Support</h4>
                <p>Get help from certified financial advisors</p>
              </div>
            </div>
          </div>

          <div className="prompt-actions">
            <button className="btn-signup" onClick={handleSignup}>
              <i className="fas fa-user-plus"></i>
              Create Free Account
            </button>
            
            <div className="login-link">
              Already have an account?{' '}
              <button className="link-btn" onClick={handleLogin}>
                Sign In
              </button>
            </div>
          </div>

          <div className="prompt-footer">
            <p>By signing up, you agree to our{' '}
              Terms of Service and{' '}
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPrompt; 