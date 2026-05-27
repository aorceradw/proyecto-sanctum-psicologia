const STORAGE_KEY = 'sanctum_auth';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''); // Remove trailing slash

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Ensure single slash between API_BASE and path
  const baseUrl = API_BASE ? `${API_BASE}/` : '';
  return `${baseUrl}${path.replace(/^\//, '')}`;
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(buildUrl(path), { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || 'Error en la solicitud');
  }
  return res.json() as Promise<T>;
}
