// Small fetch wrapper for the Finwise Spring Boot API.
// In development Vite proxies /api to the backend (see vite.config.js);
// for a separately hosted backend set VITE_API_URL, e.g. https://api.example.com
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const UNAUTHORIZED_EVENT = 'finwise:unauthorized';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const isForm = body instanceof FormData;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // response had no JSON body
    }
    // An expired/invalid session: let AuthContext log the user out
    if (res.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new ApiError(message, res.status);
  }
  return res;
}

async function json(path, options) {
  const res = await request(path, options);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (path) => json(path),
  post: (path, body) => json(path, { method: 'POST', body }),
  put: (path, body) => json(path, { method: 'PUT', body }),
  del: (path) => json(path, { method: 'DELETE' }),
  upload: (path, file) => {
    const form = new FormData();
    form.append('file', file);
    return json(path, { method: 'POST', body: form });
  },
  /** Downloads an authenticated file and saves it with the given name. */
  download: async (path, fileName) => {
    const res = await request(path);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
