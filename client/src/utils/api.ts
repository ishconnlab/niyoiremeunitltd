const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

// An empty API URL uses the same-origin Vercel rewrite in production and the
// Vite proxy in development. This keeps cookies and API routes on one origin.
export const API_URL = configuredApiUrl?.replace(/\/$/, '') ?? '';

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data as T;
}
