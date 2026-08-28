// ============================================================
// OilERP — Shared Types
// ============================================================

// ----------------------------------------------------------
// ENUMS
// ----------------------------------------------------------

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  DIRECTOR = 'DIRECTOR',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_EXECUTIVE = 'SALES_EXECUTIVE',
  PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
  PROCUREMENT_EXECUTIVE = 'PROCUREMENT_EXECUTIVE',
  PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
  PRODUCTION_SUPERVISOR = 'PRODUCTION_SUPERVISOR',
  QUALITY_MANAGER = 'QUALITY_MANAGER',
  QUALITY_EXECUTIVE = 'QUALITY_EXECUTIVE',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  WAREHOUSE_OPERATOR = 'WAREHOUSE_OPERATOR',
  HR_MANAGER = 'HR_MANAGER',
  HR_EXECUTIVE = 'HR_EXECUTIVE',
  MAINTENANCE_MANAGER = 'MAINTENANCE_MANAGER',
  MAINTENANCE_TECHNICIAN = 'MAINTENANCE_TECHNICIAN',
  LOGISTICS_MANAGER = 'LOGISTICS_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  AUDITOR = 'AUDITOR',
}

export enum Module {
  DASHBOARD = 'dashboard',
  CRM = 'crm',
  SALES = 'sales',
  PROCUREMENT = 'procurement',
  INVENTORY = 'inventory',
  WAREHOUSE = 'warehouse',
  PRODUCTION = 'production',
  QUALITY = 'quality',
  LOGISTICS = 'logistics',
  FINANCE = 'finance',
  HR = 'hr',
  PAYROLL = 'payroll',
  ASSETS = 'assets',
  MAINTENANCE = 'maintenance',
  DOCUMENTS = 'documents',
  NOTIFICATIONS = 'notifications',
  REPORTS = 'reports',
  ANALYTICS = 'analytics',
  ADMINISTRATION = 'administration',
  SETTINGS = 'settings',
}

export enum PermissionAction {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  CANCEL = 'cancel',
  EXPORT = 'export',
}

export enum QCStatus {
  PENDING = 'pending',
  PASS = 'pass',
  FAIL = 'fail',
  QUARANTINE = 'quarantine',
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

// ----------------------------------------------------------
// AUTH
// ----------------------------------------------------------

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  permissions: string[]
  companyId: string
  branchId?: string
  departmentId?: string
}

export interface AuthTokenPayload {
  sub: string
  email: string
  role: UserRole
  companyId: string
  iat: number
  exp: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresAt: number
}

// ----------------------------------------------------------
// API
// ----------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ----------------------------------------------------------
// ORGANIZATION
// ----------------------------------------------------------

export interface Company {
  id: string
  name: string
  code: string
  gstin?: string
  pan?: string
  address?: string
  logo?: string
  currency: string
  timezone: string
  createdAt: string
}

export interface Branch {
  id: string
  companyId: string
  name: string
  code: string
  address?: string
  isHeadOffice: boolean
}

export interface Department {
  id: string
  companyId: string
  name: string
  code: string
  managerId?: string
}

// ----------------------------------------------------------
// MASTER DATA
// ----------------------------------------------------------

export interface Product {
  id: string
  code: string
  name: string
  category: string
  unit: string
  hsn?: string
  taxRate?: number
  minStock?: number
  isActive: boolean
}

export interface Customer {
  id: string
  code: string
  name: string
  gstin?: string
  pan?: string
  email?: string
  phone?: string
  address?: string
  creditLimit: number
  paymentTerms: number
  outstanding: number
  isActive: boolean
}

export interface Supplier {
  id: string
  code: string
  name: string
  gstin?: string
  pan?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms: number
  isActive: boolean
}

// ----------------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------------

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

// ----------------------------------------------------------
// AUDIT
// ----------------------------------------------------------

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  resourceId?: string
  resourceType?: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}
