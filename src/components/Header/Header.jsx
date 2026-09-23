import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { dashboardPathFor, useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/home', label: 'Home', end: true },
  { to: '/home/e-learning', label: 'E-Learning' },
  { to: '/home/calculator', label: 'Calculators' },
  { to: '/home/pricing', label: 'Pricing' },
  { to: '/home/Gallery', label: 'Gallery' },
  { to: '/home/aboutus', label: 'About' },
  { to: '/home/contactus', label: 'Contact' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const loggedIn = isAuthenticated();

  // Subtle shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  // Close the account dropdown on an outside click or Escape
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setAccountOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setAccountOpen(false);
    navigate('/home');
  };

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  return (
    <header className={`fwnav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="fwnav-inner">
        <Link to="/home" className="fwnav-brand">
          <span className="fwnav-brand-mark"><i className="fas fa-chart-line"></i></span>
          <span className="fwnav-brand-name">Finwisee</span>
        </Link>

        <nav className="fwnav-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `fwnav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="fwnav-actions">
          <Link to="/home/cart" className="fwnav-icon-btn" aria-label={`Cart (${cartCount} items)`} title="Cart">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="fwnav-cart-count">{cartCount}</span>}
          </Link>

          {loggedIn ? (
            <div className="fwnav-account" ref={accountRef}>
              <button
                className="fwnav-account-btn"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <span className="fwnav-avatar">{initials}</span>
                <span className="fwnav-account-name">{user?.firstName}</span>
                <i className={`fas fa-chevron-down ${accountOpen ? 'flip' : ''}`}></i>
              </button>

              {accountOpen && (
                <div className="fwnav-menu" role="menu">
                  <div className="fwnav-menu-head">
                    <strong>{user?.firstName} {user?.lastName}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <Link to={dashboardPathFor(user)} className="fwnav-menu-item" role="menuitem">
                    <i className="fas fa-table-columns"></i>
                    {user?.role === 'ADMIN' ? 'Admin dashboard' : 'My dashboard'}
                  </Link>
                  <button className="fwnav-menu-item danger" onClick={handleLogout} role="menuitem">
                    <i className="fas fa-arrow-right-from-bracket"></i>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/login" className="fwnav-btn fwnav-btn-ghost">Log in</Link>
              <Link to="/auth/register" className="fwnav-btn fwnav-btn-primary">Get started</Link>
            </>
          )}

          <button
            className="fwnav-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* ---------- Mobile panel ---------- */}
      <div className={`fwnav-mobile ${menuOpen ? 'open' : ''}`}>
        <nav className="fwnav-mobile-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `fwnav-mobile-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
              <i className="fas fa-chevron-right"></i>
            </NavLink>
          ))}
        </nav>

        <div className="fwnav-mobile-actions">
          {loggedIn ? (
            <>
              <Link to={dashboardPathFor(user)} className="fwnav-btn fwnav-btn-primary">
                {user?.role === 'ADMIN' ? 'Admin dashboard' : 'My dashboard'}
              </Link>
              <button className="fwnav-btn fwnav-btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/auth/register" className="fwnav-btn fwnav-btn-primary">Get started</Link>
              <Link to="/auth/login" className="fwnav-btn fwnav-btn-ghost">Log in</Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && <div className="fwnav-backdrop" onClick={() => setMenuOpen(false)} />}
    </header>
  );
};

export default Header;
