import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated()) {
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-animation">
          <div className="error-number">404</div>
          <div className="error-text">Page Not Found</div>
        </div>
        
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>
            {isAuthenticated() 
              ? "You don't have permission to access this page or the page doesn't exist."
              : "The page you're looking for doesn't exist or you need to log in first."
            }
          </p>
        </div>

        <div className="error-actions">
          <button onClick={handleGoHome} className="login-btn">
            <i className="fas fa-home"></i>
            {isAuthenticated() ? 'Go to Dashboard' : 'Go to Home'}
          </button>
          {!isAuthenticated() && (
            <button onClick={() => navigate('/auth/login')} className="login-btn">
              <i className="fas fa-sign-in-alt"></i>
              Login
            </button>
          )}
        </div>

        <div className="help-section">
          <p>Need help? <Link to="/home/contactus">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
