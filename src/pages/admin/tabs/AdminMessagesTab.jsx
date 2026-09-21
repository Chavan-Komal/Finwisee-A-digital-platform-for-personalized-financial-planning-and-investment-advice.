import { useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, Modal } from '../../../components/Dashboard/ui';
import { formatDateTime, fullName } from '../../../utils/format';

const AdminMessagesTab = ({ data, reload, notify, currentUser }) => {
  const [box, setBox] = useState('received');
  const [expanded, setExpanded] = useState(null);
  const [compose, setCompose] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const received = data.messages.filter((m) => m.toUser?.id === currentUser?.id);
  const sent = data.messages.filter((m) => m.fromUser?.id === currentUser?.id);
  const lists = { received, sent, all: data.messages };
  const messages = lists[box];
  const unread = received.filter((m) => !m.isRead).length;
  const clients = data.users.filter((u) => u.id !== currentUser?.id);

  const toggle = async (m) => {
    setExpanded(expanded === m.id ? null : m.id);
    if (m.toUser?.id === currentUser?.id && !m.isRead) {
      try {
        await api.put(`/messages/${m.id}/read`);
        await reload('messages');
      } catch (err) {
        notify(err.message, 'error');
      }
    }
  };

  const openCompose = (draft = {}) => {
    setError('');
    setCompose({ toUserId: clients[0]?.id ?? '', subject: '', message: '', ...draft });
  };

  const send = async () => {
    setSending(true);
    setError('');
    try {
      await api.post('/messages', { ...compose, toUserId: Number(compose.toUserId) });
      await reload('messages');
      setCompose(null);
      notify('Message sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.del(`/messages/${m.id}`);
      await reload('messages');
      notify('Message deleted');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <div className="fw-tabs">
          <button className={`fw-tab ${box === 'received' ? 'active' : ''}`} onClick={() => setBox('received')}>
            Received {unread > 0 && `(${unread})`}
          </button>
          <button className={`fw-tab ${box === 'sent' ? 'active' : ''}`} onClick={() => setBox('sent')}>Sent</button>
          <button className={`fw-tab ${box === 'all' ? 'active' : ''}`} onClick={() => setBox('all')}>All</button>
        </div>
        <button className="fw-btn fw-btn-primary" onClick={() => openCompose()} disabled={clients.length === 0}>
          <i className="fas fa-pen"></i> New message
        </button>
      </div>

      {messages.length === 0 ? (
        <EmptyState icon="fa-inbox" title="No messages here" />
      ) : (
        messages.map((m) => {
          const open = expanded === m.id;
          const isUnread = m.toUser?.id === currentUser?.id && !m.isRead;
          const replyTo = m.fromUser?.id === currentUser?.id ? m.toUser : m.fromUser;
          return (
            <div key={m.id} className={`fw-message ${isUnread ? 'unread' : ''}`} onClick={() => toggle(m)}>
              <div className="fw-message-head">
                <span className="fw-strong">{m.subject}</span>
                <span className="fw-muted fw-small">{formatDateTime(m.createdAt)}</span>
              </div>
              <div className="fw-muted fw-small">
                {fullName(m.fromUser)} <i className="fas fa-arrow-right mx-1"></i> {fullName(m.toUser)}
              </div>
              <p className={`fw-message-body ${open ? '' : 'clamped'}`}>{m.message}</p>
              {open && (
                <div className="fw-actions mt-3" onClick={(e) => e.stopPropagation()}>
                  {replyTo && replyTo.id !== currentUser?.id && (
                    <button className="fw-btn fw-btn-light fw-btn-sm"
                      onClick={() => openCompose({ toUserId: replyTo.id, subject: m.subject.startsWith('Re:') ? m.subject : `Re: ${m.subject}` })}>
                      <i className="fas fa-reply"></i> Reply to {replyTo.firstName}
                    </button>
                  )}
                  <button className="fw-btn fw-btn-danger fw-btn-sm" onClick={() => remove(m)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {compose && (
        <Modal
          title="Send a message"
          onClose={() => setCompose(null)}
          onSubmit={send}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => setCompose(null)}>Cancel</button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={sending}>
                <i className="fas fa-paper-plane"></i> {sending ? 'Sending...' : 'Send'}
              </button>
            </>
          }
        >
          {error && <div className="fw-alert">{error}</div>}
          <div className="fw-form-grid">
            <div className="fw-field full">
              <label htmlFor="am-to">To</label>
              <select id="am-to" className="fw-input" value={compose.toUserId} required
                onChange={(e) => setCompose({ ...compose, toUserId: e.target.value })}>
                {clients.map((u) => <option key={u.id} value={u.id}>{fullName(u)} ({u.email})</option>)}
              </select>
            </div>
            <div className="fw-field full">
              <label htmlFor="am-subject">Subject</label>
              <input id="am-subject" className="fw-input" value={compose.subject} maxLength={255} required
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })} />
            </div>
            <div className="fw-field full">
              <label htmlFor="am-body">Message</label>
              <textarea id="am-body" className="fw-input" rows="6" value={compose.message} maxLength={5000} required
                onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminMessagesTab;
