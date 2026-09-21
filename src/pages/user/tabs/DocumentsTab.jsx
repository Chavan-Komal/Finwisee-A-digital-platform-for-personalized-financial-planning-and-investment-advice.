import { useRef, useState } from 'react';
import { api } from '../../../api/client';
import { EmptyState, StatusBadge } from '../../../components/Dashboard/ui';
import { fileIcon, formatDateTime, formatFileSize } from '../../../utils/format';

const MAX_BYTES = 10 * 1024 * 1024;

const DocumentsTab = ({ data, reload, notify }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(0);
  const inputRef = useRef(null);

  const upload = async (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    const tooBig = files.filter((f) => f.size > MAX_BYTES);
    const ok = files.filter((f) => f.size <= MAX_BYTES);
    if (tooBig.length) notify(`${tooBig.map((f) => f.name).join(', ')} exceed the 10 MB limit`, 'error');

    let uploaded = 0;
    for (const file of ok) {
      setUploading(ok.length - uploaded);
      try {
        await api.upload('/documents', file);
        uploaded++;
      } catch (err) {
        notify(`${file.name}: ${err.message}`, 'error');
      }
    }
    setUploading(0);
    if (uploaded) {
      await reload('documents');
      notify(`${uploaded} document${uploaded > 1 ? 's' : ''} uploaded`);
    }
  };

  const download = async (doc) => {
    try {
      await api.download(`/documents/${doc.id}/download`, doc.fileName);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (doc) => {
    if (!window.confirm(`Delete ${doc.fileName}?`)) return;
    try {
      await api.del(`/documents/${doc.id}`);
      await reload('documents');
      notify('Document deleted');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <>
      <div className="fw-card">
        <div
          className={`fw-dropzone ${dragging ? 'dragging' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
        >
          <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
          <h4 className="fw-strong fs-6 mb-0">{uploading ? `Uploading ${uploading} file(s)...` : 'Drop files here or click to browse'}</h4>
          <p className="fw-muted fw-small">Bank statements, tax returns, policies, payslips — up to 10 MB each</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
            onChange={(e) => { upload(e.target.files); e.target.value = ''; }}
          />
        </div>
      </div>

      <div className="fw-card">
        <div className="fw-card-header"><h3>Your documents ({data.documents.length})</h3></div>
        {data.documents.length === 0 ? (
          <EmptyState icon="fa-folder-open" title="No documents uploaded" text="Share documents so your advisor can review them." />
        ) : (
          <div className="fw-list">
            {data.documents.map((doc) => (
              <div className="fw-list-item" key={doc.id}>
                <div className="fw-file-icon"><i className={`fas ${fileIcon(doc.fileName)}`}></i></div>
                <div className="fw-list-main">
                  <p className="fw-list-title">{doc.fileName}</p>
                  <p className="fw-list-sub">{formatFileSize(doc.fileSize)} · Uploaded {formatDateTime(doc.uploadDate)}</p>
                  {doc.reviewNotes && <p className="fw-list-sub"><i className="fas fa-comment-dots me-1"></i>Advisor: {doc.reviewNotes}</p>}
                </div>
                <StatusBadge status={doc.status} />
                <div className="fw-actions">
                  <button className="fw-btn fw-btn-light fw-icon-btn" title="Download" onClick={() => download(doc)}>
                    <i className="fas fa-download"></i>
                  </button>
                  <button className="fw-btn fw-btn-danger fw-icon-btn" title="Delete" onClick={() => remove(doc)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentsTab;
