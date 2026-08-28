// ============================================================
// Mock Authentication — Phase 1 only
// Replace with real API calls in Phase 2
// ============================================================

import { UserRole, Module } from '@/types'

export interface MockUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  companyId: string
  companyName: string
  department: string
  modules: Module[]
  token?: string
}

// Define which modules each role can access
export const ROLE_MODULES: Record<string, Module[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Module),

  [UserRole.FINANCE_MANAGER]: [
    Module.DASHBOARD,
    Module.SALES,
    Module.PROCUREMENT,
    Module.FINANCE,
    Module.REPORTS,
    Module.ANALYTICS,
    Module.NOTIFICATIONS,
    Module.SETTINGS,
  ],

  [UserRole.PRODUCTION_MANAGER]: [
    Module.DASHBOARD,
    Module.INVENTORY,
    Module.WAREHOUSE,
    Module.PRODUCTION,
    Module.QUALITY,
    Module.MAINTENANCE,
    Module.REPORTS,
    Module.NOTIFICATIONS,
    Module.SETTINGS,
  ],

  [UserRole.WAREHOUSE_OPERATOR]: [
    Module.DASHBOARD,
    Module.INVENTORY,
    Module.WAREHOUSE,
    Module.NOTIFICATIONS,
  ],
}

// Mock user database — Phase 1
export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@oilerp.com',
    name: 'Jitendra Singh',
    role: UserRole.SUPER_ADMIN,
    companyId: 'company-1',
    companyName: 'Apex Edible Oils & Foods Pvt Ltd',
    department: 'Administration',
    modules: ROLE_MODULES[UserRole.SUPER_ADMIN],
  },
  {
    id: '2',
    email: 'finance@oilerp.com',
    name: 'Priya Sharma',
    role: UserRole.FINANCE_MANAGER,
    companyId: 'company-1',
    companyName: 'Apex Edible Oils & Foods Pvt Ltd',
    department: 'Finance',
    modules: ROLE_MODULES[UserRole.FINANCE_MANAGER],
  },
  {
    id: '3',
    email: 'production@oilerp.com',
    name: 'Rajesh Kumar',
    role: UserRole.PRODUCTION_MANAGER,
    companyId: 'company-1',
    companyName: 'Apex Edible Oils & Foods Pvt Ltd',
    department: 'Food Processing',
    modules: ROLE_MODULES[UserRole.PRODUCTION_MANAGER],
  },
  {
    id: '4',
    email: 'warehouse@oilerp.com',
    name: 'Suresh Yadav',
    role: UserRole.WAREHOUSE_OPERATOR,
    companyId: 'company-1',
    companyName: 'Apex Edible Oils & Foods Pvt Ltd',
    department: 'Warehouse & Packaging',
    modules: ROLE_MODULES[UserRole.WAREHOUSE_OPERATOR],
  },
]

// Passwords — Phase 1 mock only (NOT secure — replaced by Argon2 in Phase 2)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@oilerp.com': 'Admin@123',
  'finance@oilerp.com': 'Finance@123',
  'production@oilerp.com': 'Prod@123',
  'warehouse@oilerp.com': 'Ware@123',
}

export const SESSION_KEY = 'oilerp_session'

export interface MockSession {
  user: MockUser
  loginAt: number
  expiresAt: number
}

export function mockLogin(
  email: string,
  password: string,
): { success: true; user: MockUser } | { success: false; error: string } {
  const expectedPassword = MOCK_PASSWORDS[email.toLowerCase()]
  if (!expectedPassword) {
    return { success: false, error: 'Invalid email or password.' }
  }
  if (expectedPassword !== password) {
    return { success: false, error: 'Invalid email or password.' }
  }
  const user = MOCK_USERS.find((u) => u.email === email.toLowerCase())!
  return { success: true, user }
}

export function saveSession(user: MockUser, rememberMe: boolean): void {
  const session: MockSession = {
    user,
    loginAt: Date.now(),
    expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): MockSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const session: MockSession = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
