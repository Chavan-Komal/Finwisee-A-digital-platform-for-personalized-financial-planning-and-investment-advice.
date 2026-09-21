import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from './ui';
import './Dashboard.css';

/**
 * Sidebar + top bar shell shared by the user and admin dashboards.
 * navItems: [{ key, label, icon, badge? }]
 */
const DashboardLayout = ({ roleLabel, navItems, activeTab, onTabChange, title, subtitle, user, onLogout, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const selectTab = (key) => {
    onTabChange(key);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="fw-dash">
      {menuOpen && <div className="fw-sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`fw-sidebar ${menuOpen ? 'open' : ''}`}>
        <Link to="/home" className="fw-brand">
          <span className="fw-brand-icon"><i className="fas fa-chart-line"></i></span>
          Finwisee
        </Link>
        <div className="fw-role-tag">{roleLabel}</div>

        <nav className="fw-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`fw-nav-btn ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => selectTab(item.key)}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
              {item.badge > 0 && <span className="fw-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="fw-sidebar-footer">
          <Link to="/home" className="fw-nav-btn text-decoration-none">
            <i className="fas fa-globe"></i>
            Back to website
          </Link>
          <button className="fw-nav-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </aside>

      <div className="fw-main">
        <header className="fw-topbar">
          <button className="fw-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <i className="fas fa-bars"></i>
          </button>
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="fw-topbar-user">
            <div className="text-end fw-topbar-name">
              <div className="fw-strong">{user?.firstName} {user?.lastName}</div>
              <div className="fw-muted fw-small">{user?.email}</div>
            </div>
            <Avatar user={user} />
          </div>
        </header>

        <main className="fw-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
