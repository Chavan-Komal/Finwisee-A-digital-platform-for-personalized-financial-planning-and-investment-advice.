import { useAuth } from '../../../context/AuthContext';
import { EmptyState, StatCard, StatusBadge } from '../../../components/Dashboard/ui';
import { formatCurrency, formatTime, todayIso } from '../../../utils/format';
import { profileCompletion } from './ProfileTab';

const OverviewTab = ({ data, goTo }) => {
  const { user } = useAuth();
  const today = todayIso();

  const upcoming = data.appointments
    .filter((a) => a.appointmentDate >= today && ['PENDING', 'CONFIRMED'].includes(a.status))
    .sort((a, b) => `${a.appointmentDate}${a.appointmentTime}`.localeCompare(`${b.appointmentDate}${b.appointmentTime}`));
  const activeGoals = data.plans.filter((p) => p.status === 'ACTIVE');
  const unread = data.inbox.filter((m) => !m.isRead).length;
  const completion = profileCompletion(data.profile, user);

  return (
    <>
      <div className="fw-card fw-welcome d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h2>Welcome back, {user?.firstName}!</h2>
          <p>
            {completion < 100
              ? `Your profile is ${completion}% complete. A complete profile helps our advisors personalise your plan.`
              : 'Your profile is complete. Here is what is happening with your finances.'}
          </p>
        </div>
        {completion < 100 && (
          <button className="fw-btn fw-btn-light" onClick={() => goTo('profile', 'edit')}>
            <i className="fas fa-user-edit"></i> Complete profile
          </button>
        )}
      </div>

      <div className="fw-grid fw-grid-4 fw-section-gap">
        <StatCard icon="fa-calendar-check" color="blue" value={upcoming.length} label="Upcoming appointments" />
        <StatCard icon="fa-envelope" color="amber" value={unread} label="Unread messages" />
        <StatCard icon="fa-bullseye" color="green" value={activeGoals.length} label="Active goals" />
        <StatCard icon="fa-file-alt" color="cyan" value={data.documents.length} label="Documents shared" />
      </div>

      <div className="fw-grid fw-grid-2 fw-section-gap">
        <div className="fw-card">
          <div className="fw-card-header">
            <h3>Upcoming appointments</h3>
            <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => goTo('appointments', 'book')}>
              <i className="fas fa-plus"></i> Book
            </button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon="fa-calendar" title="No upcoming appointments" text="Book a session with an advisor." />
          ) : (
            <div className="fw-list">
              {upcoming.slice(0, 4).map((a) => {
                const date = new Date(`${a.appointmentDate}T00:00:00`);
                return (
                  <div className="fw-list-item" key={a.id}>
                    <div className="fw-date-chip">
                      <strong>{date.getDate()}</strong>
                      <span>{date.toLocaleString('en-IN', { month: 'short' })}</span>
                    </div>
                    <div className="fw-list-main">
                      <p className="fw-list-title">{a.appointmentType}</p>
                      <p className="fw-list-sub">
                        {formatTime(a.appointmentTime)}{a.advisorName ? ` · with ${a.advisorName}` : ''}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fw-card">
          <div className="fw-card-header">
            <h3>Goal progress</h3>
            <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => goTo('goals', 'add')}>
              <i className="fas fa-plus"></i> Add goal
            </button>
          </div>
          {activeGoals.length === 0 ? (
            <EmptyState icon="fa-bullseye" title="No active goals" text="Set a goal like an emergency fund or retirement." />
          ) : (
            <div className="fw-list">
              {activeGoals.slice(0, 4).map((goal) => {
                const pct = Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100) || 0);
                return (
                  <div className="fw-list-item d-block" key={goal.id}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-strong">{goal.title}</span>
                      <span className="fw-muted fw-small">
                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="fw-progress"><div style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fw-card fw-section-gap">
        <div className="fw-card-header"><h3>Quick actions</h3></div>
        <div className="fw-grid fw-grid-4">
          <button className="fw-btn fw-btn-light py-3" onClick={() => goTo('appointments', 'book')}>
            <i className="fas fa-calendar-plus"></i> Book appointment
          </button>
          <button className="fw-btn fw-btn-light py-3" onClick={() => goTo('messages', 'compose')}>
            <i className="fas fa-paper-plane"></i> Message an advisor
          </button>
          <button className="fw-btn fw-btn-light py-3" onClick={() => goTo('documents')}>
            <i className="fas fa-upload"></i> Upload documents
          </button>
          <button className="fw-btn fw-btn-light py-3" onClick={() => goTo('goals', 'add')}>
            <i className="fas fa-bullseye"></i> Add a goal
          </button>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
