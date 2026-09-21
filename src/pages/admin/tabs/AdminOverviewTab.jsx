import { Avatar, EmptyState, StatCard, StatusBadge } from '../../../components/Dashboard/ui';
import { formatCurrency, formatDate, formatDateTime, formatTime, fullName } from '../../../utils/format';

const AdminOverviewTab = ({ data, goTo }) => {
  const { stats } = data;
  const pendingAppointments = data.appointments.filter((a) => a.status === 'PENDING');
  const pendingDocuments = data.documents.filter((d) => d.status === 'PENDING');

  return (
    <>
      <div className="fw-grid fw-grid-4">
        <StatCard icon="fa-users" color="blue" value={stats?.users?.regular ?? 0} label={`Clients (${stats?.users?.admins ?? 0} admins)`} />
        <StatCard icon="fa-rupee-sign" color="green" value={formatCurrency(stats?.orders?.revenue)} label={`Revenue from ${stats?.orders?.total ?? 0} orders`} />
        <StatCard icon="fa-calendar-alt" color="amber" value={stats?.appointments?.pending ?? 0} label="Appointments to confirm" />
        <StatCard icon="fa-file-alt" color="cyan" value={stats?.documents?.pending ?? 0} label="Documents to review" />
      </div>

      <div className="fw-grid fw-grid-2 fw-section-gap">
        <div className="fw-card">
          <div className="fw-card-header">
            <h3>Appointments awaiting confirmation</h3>
            <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => goTo('appointments')}>View all</button>
          </div>
          {pendingAppointments.length === 0 ? (
            <EmptyState icon="fa-calendar-check" title="All caught up" text="No appointments waiting for confirmation." />
          ) : (
            <div className="fw-list">
              {pendingAppointments.slice(0, 5).map((a) => (
                <div className="fw-list-item" key={a.id}>
                  <Avatar user={a.user} />
                  <div className="fw-list-main">
                    <p className="fw-list-title">{fullName(a.user)} · {a.appointmentType}</p>
                    <p className="fw-list-sub">{formatDate(a.appointmentDate)} at {formatTime(a.appointmentTime)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="fw-card">
          <div className="fw-card-header">
            <h3>Documents to review</h3>
            <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => goTo('documents')}>View all</button>
          </div>
          {pendingDocuments.length === 0 ? (
            <EmptyState icon="fa-folder-open" title="Nothing to review" text="New client uploads will appear here." />
          ) : (
            <div className="fw-list">
              {pendingDocuments.slice(0, 5).map((d) => (
                <div className="fw-list-item" key={d.id}>
                  <div className="fw-file-icon"><i className="fas fa-file-alt"></i></div>
                  <div className="fw-list-main">
                    <p className="fw-list-title">{d.fileName}</p>
                    <p className="fw-list-sub">{fullName(d.user)} · {formatDateTime(d.uploadDate)}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fw-card fw-section-gap">
        <div className="fw-card-header">
          <h3>Newest users</h3>
          <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => goTo('users')}>Manage users</button>
        </div>
        <div className="fw-list">
          {data.users.slice(0, 5).map((u) => (
            <div className="fw-list-item" key={u.id}>
              <Avatar user={u} />
              <div className="fw-list-main">
                <p className="fw-list-title">{fullName(u)}</p>
                <p className="fw-list-sub">{u.email}</p>
              </div>
              <span className="fw-muted fw-small">Joined {formatDate(u.createdAt)}</span>
              <StatusBadge status={u.role} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminOverviewTab;
