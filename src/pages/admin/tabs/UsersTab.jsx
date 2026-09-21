import { useState } from 'react';
import { api } from '../../../api/client';
import { Avatar, EmptyState, Modal } from '../../../components/Dashboard/ui';
import { formatDate, fullName } from '../../../utils/format';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', password: '', role: 'USER' };

const UsersTab = ({ data, reload, notify, currentUser }) => {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editing, setEditing] = useState(null); // null | 'new' | user
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const open = (user) => {
    setError('');
    setEditing(user ?? 'new');
    setForm(user
      ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone ?? '', password: '', role: user.role }
      : EMPTY_FORM);
  };

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') await api.post('/admin/users', form);
      else await api.put(`/admin/users/${editing.id}`, form);
      await reload('users');
      setEditing(null);
      notify(editing === 'new' ? 'User created' : 'User updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (user, role) => {
    try {
      await api.put(`/admin/users/${user.id}/role?role=${role}`);
      await reload('users');
      notify(`${fullName(user)} is now ${role === 'ADMIN' ? 'an admin' : 'a user'}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete ${fullName(user)}? Their appointments, messages, documents and orders will also be removed.`)) return;
    try {
      await api.del(`/admin/users/${user.id}`);
      await reload('users', 'appointments', 'messages', 'documents', 'orders');
      notify('User deleted');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const q = query.trim().toLowerCase();
  const users = data.users.filter((u) =>
    (roleFilter === 'ALL' || u.role === roleFilter) &&
    (!q || `${fullName(u)} ${u.email} ${u.phone ?? ''}`.toLowerCase().includes(q)));

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <div className="d-flex gap-2 flex-wrap flex-grow-1">
          <div className="fw-search">
            <i className="fas fa-search"></i>
            <input className="fw-input" placeholder="Search name, email or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className="fw-input inline" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by role">
            <option value="ALL">All roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
        <button className="fw-btn fw-btn-primary" onClick={() => open(null)}>
          <i className="fas fa-user-plus"></i> Add user
        </button>
      </div>

      {users.length === 0 ? (
        <EmptyState icon="fa-user-slash" title="No users match your search" />
      ) : (
        <div className="fw-table-wrap">
          <table className="fw-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.id === currentUser?.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-person">
                        <Avatar user={u} />
                        <div>
                          <div className="fw-strong">{fullName(u)} {isMe && <span className="fw-badge blue ms-1">You</span>}</div>
                          <div className="fw-muted fw-small">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.phone || <span className="fw-muted">—</span>}</td>
                    <td>
                      <select className="fw-input inline" value={u.role} disabled={isMe}
                        onChange={(e) => changeRole(u, e.target.value)} aria-label={`Role for ${fullName(u)}`}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="fw-muted">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="fw-actions justify-content-end">
                        <button className="fw-btn fw-btn-light fw-icon-btn" title="Edit" onClick={() => open(u)}>
                          <i className="fas fa-pen"></i>
                        </button>
                        <button className="fw-btn fw-btn-danger fw-icon-btn" title="Delete" disabled={isMe} onClick={() => remove(u)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? 'Add user' : `Edit ${fullName(editing)}`}
          onClose={() => setEditing(null)}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          {error && <div className="fw-alert">{error}</div>}
          <div className="fw-form-grid">
            <div className="fw-field">
              <label htmlFor="u-first">First name</label>
              <input id="u-first" className="fw-input" name="firstName" value={form.firstName} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="u-last">Last name</label>
              <input id="u-last" className="fw-input" name="lastName" value={form.lastName} onChange={set} required />
            </div>
            <div className="fw-field full">
              <label htmlFor="u-email">Email</label>
              <input id="u-email" className="fw-input" name="email" type="email" value={form.email} onChange={set} required />
            </div>
            <div className="fw-field">
              <label htmlFor="u-phone">Phone</label>
              <input id="u-phone" className="fw-input" name="phone" type="tel" value={form.phone} onChange={set} />
            </div>
            <div className="fw-field">
              <label htmlFor="u-role">Role</label>
              <select id="u-role" className="fw-input" name="role" value={form.role} onChange={set}
                disabled={editing !== 'new' && editing.id === currentUser?.id}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="fw-field full">
              <label htmlFor="u-pass">{editing === 'new' ? 'Password' : 'New password (leave blank to keep current)'}</label>
              <input id="u-pass" className="fw-input" name="password" type="password" minLength={8} autoComplete="new-password"
                value={form.password} onChange={set} required={editing === 'new'} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersTab;
