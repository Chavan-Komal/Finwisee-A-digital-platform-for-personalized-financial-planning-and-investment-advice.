import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigate = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <header className="header">
      <div className="header-container d-flex justify-content-between align-items-center px-4 py-2">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/home" className="logo-link" onClick={closeMobileMenu}>
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div> 
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav mt-2 d-none d-md-block">
          <ul className="nav-list d-flex">
<li className="nav-item">
  <Link to="/home/e-learning" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-graduation-cap"></i>
    <span className="text-nowrap">E-Learning</span>
  </Link>
</li>

<li className="nav-item">
  <Link to="/home/calculator" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-calculator"></i>
    <span className="text-nowrap">Trackers & Calculators</span>
  </Link>
</li>

<li className="nav-item">
  <Link to="/home/Gallery" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-images"></i>
    <span className="text-nowrap">Gallery</span>
  </Link>
</li>

<li className="nav-item">
  <Link to="/home/aboutus" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-info-circle"></i>
    <span className="text-nowrap">About Us</span>
  </Link>
</li>

<li className="nav-item">
  <Link to="/home/contactus" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-envelope"></i>
    <span className="text-nowrap">Contact Us</span>
  </Link>
</li>

<li className="nav-item">
  <Link to="/home/pricing" className="nav-link d-flex align-items-center gap-2">
    <i className="fas fa-tags"></i>
    <span className="text-nowrap">Pricing</span>
  </Link>
</li>

          </ul>
        </nav>

        {/* Login Button (Desktop) */}
        <div className="header-login desktop-login d-none d-md-block">
          <button
            onClick={() => handleNavigate("/auth/login")}
            className="login-button"
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
       <button
  className="mobile-menu-toggle d-block d-md-none"
  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
  aria-label="Toggle mobile menu"
  aria-expanded={isMobileMenuOpen}
>
  
   <i className="fas fa-bars fa-lg"></i>
  
</button>

        {/* Mobile Navigation */}
        <nav className={`header-nav mobile-nav ${isMobileMenuOpen ? 'open' : 'hidden'}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/home/e-learning" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-graduation-cap"></i>
                <span>E-Learning</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/calculator" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-calculator"></i>
                <span>Trackers & Calculators</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/Gallery" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-images"></i>
                <span>Gallery</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/aboutus" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-info-circle"></i>
                <span>About Us</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/contactus" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-envelope"></i>
                <span>Contact Us</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/home/pricing" className="nav-link" onClick={closeMobileMenu}>
                <i className="fas fa-tags"></i>
                <span>Pricing</span>
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={() => handleNavigate("/auth/login")}
                className="login-button mobile-login"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
