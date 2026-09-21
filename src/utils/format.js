const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatCurrency = (value) => inr.format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return '—';
  // LocalDate strings ("2026-09-17") have no timezone; parse them as local dates
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

/** "15:00:00" -> "3:00 PM" */
export const formatTime = (value) => {
  if (!value) return '';
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/** "EMERGENCY_FUND" -> "Emergency Fund" */
export const humanize = (value) =>
  (value || '').toLowerCase().split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const fullName = (user) => (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '');

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const fileIcon = (name = '') => {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'fa-file-pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'fa-file-excel';
  if (['doc', 'docx'].includes(ext)) return 'fa-file-word';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'fa-file-image';
  return 'fa-file-alt';
};
