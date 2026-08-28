import { useAuthStore } from '@/stores/authStore'

// Keep browser requests same-origin. The Next.js route handler forwards them to
// API_URL, which makes local development and Render deployment use the same code.
const API_BASE = '/api'

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().user?.token
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || `Request failed with status ${res.status}`)
  }

  return res.json()
}
