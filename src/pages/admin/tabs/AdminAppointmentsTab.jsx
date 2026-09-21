import { useState } from 'react';
import { api } from '../../../api/client';
import { Avatar, EmptyState, Modal, StatusBadge } from '../../../components/Dashboard/ui';
import { formatDate, formatTime, fullName, humanize } from '../../../utils/format';

const STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const AdminAppointmentsTab = ({ data, reload, notify }) => {
  const [filter, setFilter] = useState('PENDING');
  const [managing, setManaging] = useState(null);
  const [form, setForm] = useState({ status: 'CONFIRMED', advisorName: '' });
  const [saving, setSaving] = useState(false);

  const open = (appointment) => {
    setManaging(appointment);
    setForm({
      status: appointment.status === 'PENDING' ? 'CONFIRMED' : appointment.status,
      advisorName: appointment.advisorName ?? '',
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const params = new URLSearchParams({ status: form.status });
      if (form.advisorName.trim()) params.set('advisorName', form.advisorName.trim());
      await api.put(`/appointments/${managing.id}/status?${params}`);
      await reload('appointments');
      setManaging(null);
      notify('Appointment updated');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const appointments = data.appointments.filter((a) => filter === 'ALL' || a.status === filter);

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <div className="fw-tabs">
          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'ALL'].map((s) => (
            <button key={s} className={`fw-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {humanize(s)} ({s === 'ALL' ? data.appointments.length : data.appointments.filter((a) => a.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {appointments.length === 0 ? (
        <EmptyState icon="fa-calendar" title={`No ${filter === 'ALL' ? '' : humanize(filter).toLowerCase()} appointments`} />
      ) : (
        <div className="fw-table-wrap">
          <table className="fw-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>When</th>
                <th>Advisor</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="fw-person">
                      <Avatar user={a.user} />
                      <div>
                        <div className="fw-strong">{fullName(a.user)}</div>
                        <div className="fw-muted fw-small">{a.user?.phone || a.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {a.appointmentType}
                    {a.notes && <div className="fw-muted fw-small" title={a.notes}>“{a.notes.length > 50 ? `${a.notes.slice(0, 50)}…` : a.notes}”</div>}
                  </td>
                  <td className="text-nowrap">{formatDate(a.appointmentDate)}<div className="fw-muted fw-small">{formatTime(a.appointmentTime)}</div></td>
                  <td>{a.advisorName || <span className="fw-muted">Unassigned</span>}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => open(a)}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {managing && (
        <Modal
          title="Manage appointment"
          onClose={() => setManaging(null)}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setManaging(null)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          <p className="mb-3">
            <span className="fw-strong">{fullName(managing.user)}</span> — {managing.appointmentType}<br />
            <span className="fw-muted">{formatDate(managing.appointmentDate)} at {formatTime(managing.appointmentTime)}</span>
          </p>
          <div className="fw-form-grid">
            <div className="fw-field">
              <label htmlFor="ap-status">Status</label>
              <select id="ap-status" className="fw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="ap-advisor">Advisor</label>
              <input id="ap-advisor" className="fw-input" placeholder="e.g. Sarah Johnson" value={form.advisorName}
                onChange={(e) => setForm({ ...form, advisorName: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminAppointmentsTab;
