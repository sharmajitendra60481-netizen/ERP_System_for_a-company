import { create } from 'zustand'
import { type MockUser, getSession, saveSession, clearSession, ROLE_MODULES } from '@/lib/auth'
import { Module, UserRole } from '@/types'

interface AuthStore {
  user: MockUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>
  logout: () => void
  initAuth: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  initAuth: () => {
    const session = getSession()
    if (session && session.user) {
      set({ user: session.user, isAuthenticated: true })
    }
  },

  login: async (email: string, password: string, rememberMe: boolean) => {
    set({ isLoading: true, error: null })
    try {
      // Use Next.js API proxy — avoids CORS issues entirely
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      })

      const data = await response.json()

      if (response.ok && data && data.user) {
        const role = (data.user.role || UserRole.SUPER_ADMIN) as UserRole
        const userObj: MockUser = {
          id: data.user.id || '1',
          email: data.user.email || email,
          name: data.user.name || 'User',
          role,
          companyId: data.user.companyId || 'company-1',
          companyName: data.user.companyName || 'Apex Edible Oils & Foods Pvt Ltd',
          department: data.user.department || 'Executive Management',
          modules: ROLE_MODULES[role] || Object.values(Module),
          token: data.accessToken,
        }
        saveSession(userObj, rememberMe)
        set({ user: userObj, isAuthenticated: true, isLoading: false })
        return true
      }

      const errorMsg = data?.message || 'Invalid email or password'
      set({ error: Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg, isLoading: false })
      return false

    } catch (err) {
      console.error('[AuthStore] Login error:', err)
      set({ error: 'Cannot connect to server. Please refresh and try again.', isLoading: false })
      return false
    }
  },

  logout: () => {
    clearSession()
    set({ user: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),
}))
