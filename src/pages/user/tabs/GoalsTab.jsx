import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, Modal, StatusBadge } from '../../../components/Dashboard/ui';
import { formatCurrency, formatDate, humanize } from '../../../utils/format';

const PLAN_TYPES = ['RETIREMENT', 'EDUCATION', 'HOME_PURCHASE', 'EMERGENCY_FUND', 'INVESTMENT', 'OTHER'];
const STATUSES = ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];

const PLAN_ICONS = {
  RETIREMENT: 'fa-umbrella-beach',
  EDUCATION: 'fa-graduation-cap',
  HOME_PURCHASE: 'fa-home',
  EMERGENCY_FUND: 'fa-life-ring',
  INVESTMENT: 'fa-chart-line',
  OTHER: 'fa-bullseye',
};

const EMPTY_FORM = {
  title: '', planType: 'RETIREMENT', targetAmount: '', currentAmount: '', monthlyContribution: '',
  expectedReturnRate: '8', targetDate: '', status: 'ACTIVE', description: '',
};

/** Month in which the goal is reached with the current contribution and return, or null if never (within 100 years). */
const projectCompletion = (goal) => {
  const target = Number(goal.targetAmount);
  let balance = Number(goal.currentAmount) || 0;
  const monthly = Number(goal.monthlyContribution) || 0;
  const rate = (Number(goal.expectedReturnRate) || 0) / 100 / 12;
  if (balance >= target) return new Date();
  for (let month = 1; month <= 1200; month++) {
    balance = balance * (1 + rate) + monthly;
    if (balance >= target) {
      const date = new Date();
      date.setMonth(date.getMonth() + month);
      return date;
    }
  }
  return null;
};

const GoalsTab = ({ data, reload, notify, intent, clearIntent }) => {
  const [editing, setEditing] = useState(null); // null | 'new' | goal
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const open = (goal) => {
    setError('');
    setEditing(goal ?? 'new');
    setForm(goal ? {
      title: goal.title,
      planType: goal.planType,
      targetAmount: goal.targetAmount ?? '',
      currentAmount: goal.currentAmount ?? '',
      monthlyContribution: goal.monthlyContribution ?? '',
      expectedReturnRate: goal.expectedReturnRate ?? '',
      targetDate: goal.targetDate ?? '',
      status: goal.status,
      description: goal.description ?? '',
    } : EMPTY_FORM);
  };

  useEffect(() => {
    if (intent === 'add') {
      open(null);
      clearIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const num = (v) => (v === '' || v === null ? null : Number(v));

  const save = async () => {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      targetAmount: num(form.targetAmount),
      currentAmount: num(form.currentAmount) ?? 0,
      monthlyContribution: num(form.monthlyContribution),
      expectedReturnRate: num(form.expectedReturnRate),
      targetDate: form.targetDate || null,
    };
    try {
      if (editing === 'new') await api.post('/financial-plans', payload);
      else await api.put(`/financial-plans/${editing.id}`, payload);
      await reload('plans');
      setEditing(null);
      notify(editing === 'new' ? 'Goal created' : 'Goal updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (goal) => {
    if (!window.confirm(`Delete the goal "${goal.title}"?`)) return;
    try {
      await api.del(`/financial-plans/${goal.id}`);
      await reload('plans');
      notify('Goal deleted');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const totalTarget = data.plans.reduce((sum, p) => sum + Number(p.targetAmount || 0), 0);
  const totalSaved = data.plans.reduce((sum, p) => sum + Number(p.currentAmount || 0), 0);

  return (
    <>
      <div className="fw-card">
        <div className="fw-card-header">
          <div>
            <h3>Your goals</h3>
            <span className="fw-muted fw-small">
              {formatCurrency(totalSaved)} saved towards {formatCurrency(totalTarget)} across {data.plans.length} goal(s)
            </span>
          </div>
          <button className="fw-btn fw-btn-primary" onClick={() => open(null)}>
            <i className="fas fa-plus"></i> New goal
          </button>
        </div>
        {data.plans.length === 0 && (
          <EmptyState icon="fa-bullseye" title="No goals yet"
            text="Create a goal and we'll project when you'll reach it based on your monthly savings." />
        )}
      </div>

      <div className="fw-grid fw-grid-2 fw-section-gap">
        {data.plans.map((goal) => {
          const pct = Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100) || 0);
          const projected = goal.status === 'ACTIVE' ? projectCompletion(goal) : null;
          const target = goal.targetDate ? new Date(`${goal.targetDate}T00:00:00`) : null;
          const onTrack = projected && (!target || projected <= target);
          return (
            <div className="fw-card" key={goal.id}>
              <div className="fw-card-header mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="fw-stat-icon blue"><i className={`fas ${PLAN_ICONS[goal.planType] ?? 'fa-bullseye'}`}></i></div>
                  <div>
                    <h3>{goal.title}</h3>
                    <span className="fw-muted fw-small">{humanize(goal.planType)}</span>
                  </div>
                </div>
                <StatusBadge status={goal.status} />
              </div>

              <div className="d-flex justify-content-between mb-2 fw-small">
                <span className="fw-strong">{formatCurrency(goal.currentAmount)}</span>
                <span className="fw-muted">{pct}% of {formatCurrency(goal.targetAmount)}</span>
              </div>
              <div className={`fw-progress ${pct >= 100 ? 'done' : ''}`}><div style={{ width: `${pct}%` }} /></div>

              <dl className="fw-goal-meta">
                <div><dt>Monthly saving</dt><dd>{goal.monthlyContribution ? formatCurrency(goal.monthlyContribution) : '—'}</dd></div>
                <div><dt>Expected return</dt><dd>{goal.expectedReturnRate != null ? `${goal.expectedReturnRate}% p.a.` : '—'}</dd></div>
                <div><dt>Target date</dt><dd>{formatDate(goal.targetDate)}</dd></div>
                <div>
                  <dt>Projected</dt>
                  <dd className={goal.status !== 'ACTIVE' ? '' : onTrack ? 'text-success' : 'text-danger'}>
                    {goal.status !== 'ACTIVE' ? '—' : projected ? formatDate(projected.toISOString()) : 'Not reachable'}
                  </dd>
                </div>
              </dl>
              {goal.status === 'ACTIVE' && target && (
                <p className={`fw-small mt-3 mb-0 ${onTrack ? 'text-success' : 'text-danger'}`}>
                  <i className={`fas ${onTrack ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-1`}></i>
                  {onTrack ? 'On track to meet your target date.' : 'Behind schedule — consider increasing your monthly saving.'}
                </p>
              )}

              <div className="fw-actions mt-3">
                <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => open(goal)}>
                  <i className="fas fa-edit"></i> Update
                </button>
                <button className="fw-btn fw-btn-danger fw-btn-sm" onClick={() => remove(goal)}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal
          title={editing === 'new' ? 'New financial goal' : 'Update goal'}
          onClose={() => setEditing(null)}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save goal'}</button>
            </>
          }
        >
          {error && <div className="fw-alert">{error}</div>}
          <div className="fw-form-grid">
            <div className="fw-field full">
              <label htmlFor="g-title">Goal name</label>
              <input id="g-title" className="fw-input" name="title" value={form.title} onChange={set} required placeholder="e.g. Child's college fund" />
            </div>
            <div className="fw-field">
              <label htmlFor="g-type">Type</label>
              <select id="g-type" className="fw-input" name="planType" value={form.planType} onChange={set}>
                {PLAN_TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="g-status">Status</label>
              <select id="g-status" className="fw-input" name="status" value={form.status} onChange={set}>
                {STATUSES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="g-target">Target amount (₹)</label>
              <input id="g-target" className="fw-input" name="targetAmount" type="number" min="1" value={form.targetAmount} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="g-current">Saved so far (₹)</label>
              <input id="g-current" className="fw-input" name="currentAmount" type="number" min="0" value={form.currentAmount} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="g-monthly">Monthly saving (₹)</label>
              <input id="g-monthly" className="fw-input" name="monthlyContribution" type="number" min="0" value={form.monthlyContribution} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="g-rate">Expected return (% p.a.)</label>
              <input id="g-rate" className="fw-input" name="expectedReturnRate" type="number" min="0" max="50" step="0.1" value={form.expectedReturnRate} onChange={set} />
            </div>
            <div className="fw-field full">
              <label htmlFor="g-date">Target date</label>
              <input id="g-date" className="fw-input" name="targetDate" type="date" value={form.targetDate} onChange={set} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GoalsTab;
