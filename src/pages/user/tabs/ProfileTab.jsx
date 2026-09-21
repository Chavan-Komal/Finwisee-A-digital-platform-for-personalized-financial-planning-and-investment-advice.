import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/client';
import { Modal } from '../../../components/Dashboard/ui';
import { formatCurrency, formatDate, humanize, todayIso } from '../../../utils/format';

const EXPERIENCE = ['BEGINNER', 'INTERMEDIATE', 'EXPERIENCED', 'EXPERT'];
const RISK = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY_AGGRESSIVE'];

const COMPLETION_FIELDS = ['dateOfBirth', 'occupation', 'annualIncome', 'investmentExperience', 'riskTolerance', 'city', 'financialGoals'];

// eslint-disable-next-line react-refresh/only-export-components
export const profileCompletion = (profile, user) => {
  const filled = COMPLETION_FIELDS.filter((f) => profile?.[f] !== null && profile?.[f] !== undefined && profile?.[f] !== '').length
    + (user?.phone ? 1 : 0);
  return Math.round((filled / (COMPLETION_FIELDS.length + 1)) * 100);
};

const toForm = (user, profile) => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  phone: user?.phone ?? '',
  dateOfBirth: profile?.dateOfBirth ?? '',
  gender: profile?.gender ?? '',
  occupation: profile?.occupation ?? '',
  annualIncome: profile?.annualIncome ?? '',
  investmentExperience: profile?.investmentExperience ?? '',
  riskTolerance: profile?.riskTolerance ?? '',
  financialGoals: profile?.financialGoals ?? '',
  address: profile?.address ?? '',
  city: profile?.city ?? '',
  state: profile?.state ?? '',
  postalCode: profile?.postalCode ?? '',
  country: profile?.country ?? '',
});

const ProfileTab = ({ data, reload, notify, intent, clearIntent }) => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(user, data.profile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const profile = data.profile;

  const openEditor = () => {
    setForm(toForm(user, profile));
    setError('');
    setEditing(true);
  };

  useEffect(() => {
    if (intent === 'edit') {
      openEditor();
      clearIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const me = await api.put('/auth/me', { firstName: form.firstName, lastName: form.lastName, phone: form.phone });
      updateUser({ firstName: me.firstName, lastName: me.lastName, phone: me.phone });
      await api.put('/user-profile', {
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        occupation: form.occupation || null,
        annualIncome: form.annualIncome === '' ? null : Number(form.annualIncome),
        investmentExperience: form.investmentExperience || null,
        riskTolerance: form.riskTolerance || null,
        financialGoals: form.financialGoals || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        postalCode: form.postalCode || null,
        country: form.country || null,
      });
      await reload('profile');
      setEditing(false);
      notify('Profile updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const completion = profileCompletion(profile, user);
  const show = (value) => (value === null || value === undefined || value === '' ? <span className="fw-muted">Not provided</span> : value);
  const location = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ');

  return (
    <>
      <div className="fw-card">
        <div className="fw-card-header">
          <div>
            <h3>Profile completeness</h3>
            <span className="fw-muted fw-small">{completion}% complete</span>
          </div>
          <button className="fw-btn fw-btn-primary" onClick={openEditor}>
            <i className="fas fa-edit"></i> Edit profile
          </button>
        </div>
        <div className={`fw-progress ${completion === 100 ? 'done' : ''}`}><div style={{ width: `${completion}%` }} /></div>
      </div>

      <div className="fw-grid fw-grid-2 fw-section-gap">
        <div className="fw-card">
          <div className="fw-card-header"><h3>Personal information</h3></div>
          <dl className="fw-dl">
            <dt>Full name</dt><dd>{user?.firstName} {user?.lastName}</dd>
            <dt>Email</dt><dd>{user?.email}</dd>
            <dt>Phone</dt><dd>{show(user?.phone)}</dd>
            <dt>Date of birth</dt><dd>{show(profile?.dateOfBirth && formatDate(profile.dateOfBirth))}</dd>
            <dt>Gender</dt><dd>{show(profile?.gender)}</dd>
            <dt>Address</dt><dd>{show(profile?.address)}</dd>
            <dt>Location</dt><dd>{show(location)}</dd>
          </dl>
        </div>

        <div className="fw-card">
          <div className="fw-card-header"><h3>Financial profile</h3></div>
          <dl className="fw-dl">
            <dt>Occupation</dt><dd>{show(profile?.occupation)}</dd>
            <dt>Annual income</dt><dd>{show(profile?.annualIncome != null && formatCurrency(profile.annualIncome))}</dd>
            <dt>Experience</dt><dd>{show(profile?.investmentExperience && humanize(profile.investmentExperience))}</dd>
            <dt>Risk tolerance</dt><dd>{show(profile?.riskTolerance && humanize(profile.riskTolerance))}</dd>
            <dt>Goals</dt><dd>{show(profile?.financialGoals)}</dd>
          </dl>
        </div>
      </div>

      {editing && (
        <Modal
          title="Edit profile"
          wide
          onClose={() => setEditing(false)}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </>
          }
        >
          {error && <div className="fw-alert">{error}</div>}
          <div className="fw-form-grid">
            <div className="fw-form-section">Personal</div>
            <div className="fw-field">
              <label htmlFor="p-first">First name</label>
              <input id="p-first" className="fw-input" name="firstName" value={form.firstName} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="p-last">Last name</label>
              <input id="p-last" className="fw-input" name="lastName" value={form.lastName} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="p-phone">Phone</label>
              <input id="p-phone" className="fw-input" name="phone" type="tel" value={form.phone} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-dob">Date of birth</label>
              <input id="p-dob" className="fw-input" name="dateOfBirth" type="date" max={todayIso()} value={form.dateOfBirth} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-gender">Gender</label>
              <select id="p-gender" className="fw-input" name="gender" value={form.gender} onChange={set}>
                <option value="">Prefer not to say</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="p-city">City</label>
              <input id="p-city" className="fw-input" name="city" value={form.city} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-state">State</label>
              <input id="p-state" className="fw-input" name="state" value={form.state} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-country">Country</label>
              <input id="p-country" className="fw-input" name="country" value={form.country} onChange={set} />
            </div>
            <div className="fw-field full">
              <label htmlFor="p-address">Address</label>
              <input id="p-address" className="fw-input" name="address" value={form.address} onChange={set} />
            </div>

            <div className="fw-form-section">Financial</div>
            <div className="fw-field">
              <label htmlFor="p-occ">Occupation</label>
              <input id="p-occ" className="fw-input" name="occupation" value={form.occupation} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-income">Annual income (₹)</label>
              <input id="p-income" className="fw-input" name="annualIncome" type="number" min="0" step="1000" value={form.annualIncome} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="p-exp">Investment experience</label>
              <select id="p-exp" className="fw-input" name="investmentExperience" value={form.investmentExperience} onChange={set}>
                <option value="">Select</option>
                {EXPERIENCE.map((v) => <option key={v} value={v}>{humanize(v)}</option>)}
              </select>
            </div>
            <div className="fw-field">
              <label htmlFor="p-risk">Risk tolerance</label>
              <select id="p-risk" className="fw-input" name="riskTolerance" value={form.riskTolerance} onChange={set}>
                <option value="">Select</option>
                {RISK.map((v) => <option key={v} value={v}>{humanize(v)}</option>)}
              </select>
            </div>
            <div className="fw-field full">
              <label htmlFor="p-goals">Financial goals</label>
              <textarea id="p-goals" className="fw-input" name="financialGoals" rows="3" value={form.financialGoals} onChange={set}
                placeholder="e.g. Retire by 55, fund my child's education, buy a home" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileTab;
