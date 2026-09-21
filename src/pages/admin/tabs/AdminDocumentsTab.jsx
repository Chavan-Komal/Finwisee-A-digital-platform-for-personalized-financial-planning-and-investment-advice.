import { useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, Modal, StatusBadge } from '../../../components/Dashboard/ui';
import { fileIcon, formatDateTime, formatFileSize, fullName, humanize } from '../../../utils/format';

const STATUSES = ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'];

const AdminDocumentsTab = ({ data, reload, notify }) => {
  const [filter, setFilter] = useState('PENDING');
  const [reviewing, setReviewing] = useState(null);
  const [form, setForm] = useState({ status: 'APPROVED', reviewNotes: '' });
  const [saving, setSaving] = useState(false);

  const open = (doc) => {
    setReviewing(doc);
    setForm({ status: doc.status === 'PENDING' ? 'APPROVED' : doc.status, reviewNotes: doc.reviewNotes ?? '' });
  };

  const save = async () => {
    setSaving(true);
    try {
      const params = new URLSearchParams({ status: form.status, reviewNotes: form.reviewNotes });
      await api.put(`/documents/${reviewing.id}/status?${params}`);
      await reload('documents');
      setReviewing(null);
      notify('Review saved');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const download = async (doc) => {
    try {
      await api.download(`/documents/${doc.id}/download`, doc.fileName);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const documents = data.documents.filter((d) => filter === 'ALL' || d.status === filter);

  return (
    <div className="fw-card">
      <div className="fw-card-header">
        <div className="fw-tabs">
          {[...STATUSES, 'ALL'].map((s) => (
            <button key={s} className={`fw-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {humanize(s)} ({s === 'ALL' ? data.documents.length : data.documents.filter((d) => d.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {documents.length === 0 ? (
        <EmptyState icon="fa-folder-open" title="No documents in this view" />
      ) : (
        <div className="fw-table-wrap">
          <table className="fw-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Client</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="fw-person">
                      <div className="fw-file-icon"><i className={`fas ${fileIcon(d.fileName)}`}></i></div>
                      <div>
                        <div className="fw-strong">{d.fileName}</div>
                        <div className="fw-muted fw-small">{formatFileSize(d.fileSize)}</div>
                      </div>
                    </div>
                  </td>
                  <td>{fullName(d.user)}<div className="fw-muted fw-small">{d.user?.email}</div></td>
                  <td className="fw-muted">{formatDateTime(d.uploadDate)}</td>
                  <td>
                    <StatusBadge status={d.status} />
                    {d.reviewNotes && <div className="fw-muted fw-small mt-1">{d.reviewNotes}</div>}
                  </td>
                  <td>
                    <div className="fw-actions justify-content-end">
                      <button className="fw-btn fw-btn-light fw-icon-btn" title="Download" onClick={() => download(d)}>
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="fw-btn fw-btn-light fw-btn-sm" onClick={() => open(d)}>Review</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewing && (
        <Modal
          title={`Review ${reviewing.fileName}`}
          onClose={() => setReviewing(null)}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="fw-btn fw-btn-light" onClick={() => download(reviewing)}>
                <i className="fas fa-download"></i> Download
              </button>
              <button type="submit" className="fw-btn fw-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save review'}</button>
            </>
          }
        >
          <div className="fw-form-grid">
            <div className="fw-field full">
              <label htmlFor="d-status">Decision</label>
              <select id="d-status" className="fw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
              </select>
            </div>
            <div className="fw-field full">
              <label htmlFor="d-notes">Notes for the client</label>
              <textarea id="d-notes" className="fw-input" rows="4" value={form.reviewNotes}
                placeholder="e.g. Thanks — please also upload last year's Form 16"
                onChange={(e) => setForm({ ...form, reviewNotes: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDocumentsTab;
