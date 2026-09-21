import { useEffect } from 'react';
import { humanize } from '../../utils/format';

const BADGE_COLORS = {
  PENDING: 'amber',
  CONFIRMED: 'green',
  COMPLETED: 'green',
  APPROVED: 'green',
  PAID: 'green',
  ACTIVE: 'blue',
  REVIEWED: 'cyan',
  PROCESSING: 'cyan',
  PAUSED: 'amber',
  CANCELLED: 'red',
  REJECTED: 'red',
  FAILED: 'red',
  REFUNDED: 'red',
  ADMIN: 'blue',
  USER: '',
};

export const StatusBadge = ({ status }) => (
  <span className={`fw-badge ${BADGE_COLORS[status] ?? ''}`}>{humanize(status)}</span>
);

export const Avatar = ({ user }) => {
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  return <div className="fw-avatar">{initials}</div>;
};

export const StatCard = ({ icon, color, value, label }) => (
  <div className="fw-card fw-stat">
    <div className={`fw-stat-icon ${color}`}><i className={`fas ${icon}`}></i></div>
    <div>
      <div className="fw-stat-value">{value}</div>
      <div className="fw-stat-label">{label}</div>
    </div>
  </div>
);

export const EmptyState = ({ icon, title, text, action }) => (
  <div className="fw-empty">
    <i className={`fas ${icon}`}></i>
    <h4>{title}</h4>
    {text && <p>{text}</p>}
    {action}
  </div>
);

export const Loading = ({ text = 'Loading...' }) => (
  <div className="fw-loading">
    <i className="fas fa-spinner fa-spin"></i>
    {text}
  </div>
);

export const Modal = ({ title, onClose, children, footer, wide = false, onSubmit }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const Body = onSubmit ? 'form' : 'div';
  const bodyProps = onSubmit
    ? { onSubmit: (e) => { e.preventDefault(); onSubmit(e); }, className: 'd-flex flex-column', style: { minHeight: 0 } }
    : { className: 'd-flex flex-column', style: { minHeight: 0 } };

  return (
    <div className="fw-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`fw-modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="fw-modal-header">
          <h3>{title}</h3>
          <button type="button" className="fw-btn fw-btn-ghost fw-icon-btn" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <Body {...bodyProps}>
          <div className="fw-modal-body">{children}</div>
          {footer && <div className="fw-modal-footer">{footer}</div>}
        </Body>
      </div>
    </div>
  );
};

export const Notice = ({ notice }) =>
  notice ? (
    <div className={`fw-notice ${notice.type}`} role="status">
      <i className={`fas ${notice.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
      {notice.message}
    </div>
  ) : null;
