const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = 'finsight_token';

// Auth is a Bearer token in localStorage, not a cookie: the frontend and
// backend live on different domains, and mobile Safari/Chrome increasingly
// block cross-site cookies outright, which made login silently fail to
// persist on phones while working fine on desktop. A token the client
// attaches itself on every request has no such restriction.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage may be unavailable (private browsing); session just won't persist across reloads.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to do if we couldn't read it in the first place.
  }
}

function authHeaders(hasBody) {
  const headers = {};
  if (hasBody) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Thin wrapper around fetch for talking to the Express backend: always
// attaches the bearer token, always sends/parses JSON, and throws with the
// backend's error message so callers can show it directly on a form.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(Boolean(body)),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

// CSV export isn't JSON, so it gets its own helper that triggers a browser
// download instead of returning parsed data. Still needs the bearer token —
// this is a real fetch (not a plain <a href> to the API), so the header
// attaches normally.
export async function downloadExport(path, filename) {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders(false) });
  if (!res.ok) {
    throw new Error('Failed to export expenses.');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
