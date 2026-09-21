import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, Modal, StatusBadge } from '../../../components/Dashboard/ui';
import { formatDate, formatTime, todayIso } from '../../../utils/format';

const TYPES = ['Financial Planning', 'Investment Review', 'Tax Consultation', 'Retirement Planning', 'Insurance Review'];
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const EMPTY_FORM = { appointmentType: TYPES[0], appointmentDate: '', appointmentTime: '10:00', notes: '' };

const AppointmentsTab = ({ data, reload, notify, intent, clearIntent }) => {
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const today = todayIso();

  const openBooking = () => {
    setForm(EMPTY_FORM);
    setError('');
    setBooking(true);
  };

  useEffect(() => {
    if (intent === 'book') {
      openBooking();
      clearIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const book = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post('/appointments', { ...form, notes: form.notes || null });
      await reload('appointments');
      setBooking(false);
      notify('Appointment requested — an advisor will confirm it shortly');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (appointment) => {
    if (!window.confirm(`Cancel your ${appointment.appointmentType} appointment on ${formatDate(appointment.appointmentDate)}?`)) return;
    try {
      await api.put(`/appointments/${appointment.id}/cancel`);
      await reload('appointments');
      notify('Appointment cancelled');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const upcoming = data.appointments.filter((a) => a.appointmentDate >= today && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  const past = data.appointments.filter((a) => !upcoming.includes(a));

  const renderList = (items, allowCancel) => (
    <div className="fw-list">
      {items.map((a) => {
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
                {formatDate(a.appointmentDate)} at {formatTime(a.appointmentTime)}
                {a.advisorName ? ` · Advisor: ${a.advisorName}` : ' · Advisor to be assigned'}
              </p>
              {a.notes && <p className="fw-list-sub"><i className="fas fa-sticky-note me-1"></i>{a.notes}</p>}
            </div>
            <StatusBadge status={a.status} />
            {allowCancel && (
              <button className="fw-btn fw-btn-danger fw-btn-sm" onClick={() => cancel(a)}>Cancel</button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="fw-card">
        <div className="fw-card-header">
          <h3>Upcoming</h3>
          <button className="fw-btn fw-btn-primary" onClick={openBooking}>
            <i className="fas fa-calendar-plus"></i> Book appointment
          </button>
        </div>
        {upcoming.length === 0
          ? <EmptyState icon="fa-calendar" title="No upcoming appointments" text="Book a free consultation with a Finwise advisor." />
          : renderList(upcoming, true)}
      </div>

      {past.length > 0 && (
        <div className="fw-card">
          <div className="fw-card-header"><h3>Past & cancelled</h3></div>
          {renderList(past, false)}
        </div>
      )}

      {booking && (
        <Modal
          title="Book an appointment"
          onClose={() => setBooking(false)}
          onSubmit={book}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setBooking(false)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>{saving ? 'Booking...' : 'Request appointment'}</button>
            </>
          }
        >
          {error && <div className="fw-alert">{error}</div>}
          <div className="fw-form-grid">
            <div className="fw-field full">
              <label htmlFor="a-type">Consultation type</label>
              <select id="a-type" className="fw-input" name="appointmentType" value={form.appointmentType} onChange={set}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="a-date">Date</label>
              <input id="a-date" className="fw-input" type="date" name="appointmentDate" min={today} value={form.appointmentDate} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="a-time">Time</label>
              <select id="a-time" className="fw-input" name="appointmentTime" value={form.appointmentTime} onChange={set}>
                {SLOTS.map((s) => <option key={s} value={s}>{formatTime(s)}</option>)}
              </select>
            </div>
            <div className="fw-field full">
              <label htmlFor="a-notes">What would you like to discuss? (optional)</label>
              <textarea id="a-notes" className="fw-input" name="notes" rows="3" value={form.notes} onChange={set} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AppointmentsTab;
