import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, Modal } from '../../../components/Dashboard/ui';
import { formatDateTime, fullName } from '../../../utils/format';

const MessagesTab = ({ data, reload, notify, intent, clearIntent }) => {
  const [box, setBox] = useState('inbox');
  const [expanded, setExpanded] = useState(null);
  const [compose, setCompose] = useState(null); // { toUserId, subject, message }
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const openCompose = (draft = {}) => {
    setError('');
    setCompose({ toUserId: null, subject: '', message: '', ...draft });
  };

  useEffect(() => {
    if (intent === 'compose') {
      openCompose();
      clearIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  const toggle = async (message) => {
    setExpanded(expanded === message.id ? null : message.id);
    if (box === 'inbox' && !message.isRead) {
      try {
        await api.put(`/messages/${message.id}/read`);
        await reload('inbox');
      } catch (err) {
        notify(err.message, 'error');
      }
    }
  };

  const send = async () => {
    setSending(true);
    setError('');
    try {
      await api.post('/messages', compose);
      await reload('sent');
      setCompose(null);
      setBox('sent');
      notify('Message sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const messages = box === 'inbox' ? data.inbox : data.sent;
  const unread = data.inbox.filter((m) => !m.isRead).length;

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <div className="fw-tabs">
          <button className={`fw-tab ${box === 'inbox' ? 'active' : ''}`} onClick={() => setBox('inbox')}>
            Inbox {unread > 0 && `(${unread})`}
          </button>
          <button className={`fw-tab ${box === 'sent' ? 'active' : ''}`} onClick={() => setBox('sent')}>Sent</button>
        </div>
        <button className="fw-btn fw-btn-primary" onClick={() => openCompose()}>
          <i className="fas fa-pen"></i> New message
        </button>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon="fa-inbox"
          title={box === 'inbox' ? 'No messages yet' : 'You have not sent any messages'}
          text="Ask our advisors anything about your finances."
        />
      ) : (
        messages.map((m) => {
          const open = expanded === m.id;
          const other = box === 'inbox' ? m.fromUser : m.toUser;
          return (
            <div key={m.id} className={`fw-message ${box === 'inbox' && !m.isRead ? 'unread' : ''}`} onClick={() => toggle(m)}>
              <div className="fw-message-head">
                <span className="fw-strong">{m.subject}</span>
                <span className="fw-muted fw-small">{formatDateTime(m.createdAt)}</span>
              </div>
              <div className="fw-muted fw-small">
                {box === 'inbox' ? 'From' : 'To'}: {other?.role === 'ADMIN' ? `${fullName(other)} (Finwise advisor)` : fullName(other)}
              </div>
              <p className={`fw-message-body ${open ? '' : 'clamped'}`}>{m.message}</p>
              {open && box === 'inbox' && (
                <div className="fw-actions mt-3">
                  <button
                    className="fw-btn fw-btn-light fw-btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCompose({ toUserId: m.fromUser.id, subject: m.subject.startsWith('Re:') ? m.subject : `Re: ${m.subject}` });
                    }}
                  >
                    <i className="fas fa-reply"></i> Reply
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {compose && (
        <Modal
          title={compose.toUserId ? 'Reply' : 'Message an advisor'}
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
              <label htmlFor="m-subject">Subject</label>
              <input id="m-subject" className="fw-input" value={compose.subject} maxLength={255} required
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })} />
            </div>
            <div className="fw-field full">
              <label htmlFor="m-body">Message</label>
              <textarea id="m-body" className="fw-input" rows="6" value={compose.message} maxLength={5000} required
                onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MessagesTab;
