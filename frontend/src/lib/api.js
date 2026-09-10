const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Thin wrapper around fetch for talking to the Express backend: always
// sends the auth cookie, always sends/parses JSON, and throws with the
// backend's error message so callers can show it directly on a form.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

// CSV export isn't JSON, so it gets its own helper that triggers a browser
// download instead of returning parsed data.
export async function downloadExport(path, filename) {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include' });
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
