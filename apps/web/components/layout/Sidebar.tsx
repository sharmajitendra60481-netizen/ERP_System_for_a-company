'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, ShoppingCart, Package, Warehouse, Factory, ShieldCheck,
  Truck, DollarSign, UserCheck, CreditCard, Wrench, Settings, FileText, Bell, BarChart3,
  PieChart, Building2, Droplets, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Module } from '@/types'

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  allowedModules: Module[]
}

interface NavItem {
  module: Module
  label: string
  href: string
  icon: React.ElementType
  color: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

// Module Color Mapping - Gives every portal a distinct color identity!
const MODULE_COLORS: Record<Module, string> = {
  [Module.DASHBOARD]: '#f59e0b',      // Warm Amber
  [Module.CRM]: '#14b8a6',            // Teal
  [Module.SALES]: '#f43f5e',          // Coral Rose
  [Module.PROCUREMENT]: '#10b981',    // Emerald Green
  [Module.INVENTORY]: '#8b5cf6',      // Royal Purple
  [Module.WAREHOUSE]: '#f97316',      // Burnt Orange
  [Module.PRODUCTION]: '#0284c7',     // Sky Ocean Blue
  [Module.QUALITY]: '#84cc16',        // Lime Green
  [Module.LOGISTICS]: '#6366f1',      // Indigo
  [Module.FINANCE]: '#16a34a',        // Cash Green
  [Module.HR]: '#ec4899',             // Pink
  [Module.PAYROLL]: '#06b6d4',        // Cyan Ice
  [Module.ASSETS]: '#64748b',         // Steel Slate
  [Module.MAINTENANCE]: '#ef4444',    // Industrial Red
  [Module.DOCUMENTS]: '#3b82f6',      // Sapphire Blue
  [Module.NOTIFICATIONS]: '#eab308',   // Alert Gold
  [Module.REPORTS]: '#a855f7',        // BI Purple
  [Module.ANALYTICS]: '#0d9488',      // Turquoise
  [Module.ADMINISTRATION]: '#e11d48',  // Ruby Crimson
  [Module.SETTINGS]: '#71717a',       // Neutral Zinc
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      { module: Module.DASHBOARD, label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: MODULE_COLORS[Module.DASHBOARD] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { module: Module.CRM, label: 'CRM Leads', href: '/crm', icon: Users, color: MODULE_COLORS[Module.CRM] },
      { module: Module.SALES, label: 'Sales & Orders', href: '/sales', icon: ShoppingCart, color: MODULE_COLORS[Module.SALES] },
      { module: Module.PROCUREMENT, label: 'Procurement', href: '/procurement', icon: Package, color: MODULE_COLORS[Module.PROCUREMENT] },
      { module: Module.INVENTORY, label: 'Inventory SKU', href: '/inventory', icon: Package, color: MODULE_COLORS[Module.INVENTORY] },
      { module: Module.WAREHOUSE, label: 'Warehouse Bins', href: '/warehouse', icon: Warehouse, color: MODULE_COLORS[Module.WAREHOUSE] },
      { module: Module.PRODUCTION, label: 'Refinery Tanks', href: '/production', icon: Factory, color: MODULE_COLORS[Module.PRODUCTION] },
      { module: Module.QUALITY, label: 'Quality Control', href: '/quality', icon: ShieldCheck, color: MODULE_COLORS[Module.QUALITY] },
      { module: Module.LOGISTICS, label: 'Dispatch Fleet', href: '/logistics', icon: Truck, color: MODULE_COLORS[Module.LOGISTICS] },
    ],
  },
  {
    label: 'Finance & HR',
    items: [
      { module: Module.FINANCE, label: 'Finance Ledgers', href: '/finance', icon: DollarSign, color: MODULE_COLORS[Module.FINANCE] },
      { module: Module.HR, label: 'HR Staffing', href: '/hr', icon: UserCheck, color: MODULE_COLORS[Module.HR] },
      { module: Module.PAYROLL, label: 'Payroll Slips', href: '/payroll', icon: CreditCard, color: MODULE_COLORS[Module.PAYROLL] },
      { module: Module.ASSETS, label: 'Plant Machinery', href: '/assets', icon: Building2, color: MODULE_COLORS[Module.ASSETS] },
      { module: Module.MAINTENANCE, label: 'Maintenance', href: '/maintenance', icon: Wrench, color: MODULE_COLORS[Module.MAINTENANCE] },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { module: Module.DOCUMENTS, label: 'FSSAI Vault', href: '/documents', icon: FileText, color: MODULE_COLORS[Module.DOCUMENTS] },
      { module: Module.NOTIFICATIONS, label: 'System Alerts', href: '/notifications', icon: Bell, color: MODULE_COLORS[Module.NOTIFICATIONS] },
      { module: Module.REPORTS, label: 'ERP Reports', href: '/reports', icon: BarChart3, color: MODULE_COLORS[Module.REPORTS] },
      { module: Module.ANALYTICS, label: 'AI Forecaster', href: '/analytics', icon: PieChart, color: MODULE_COLORS[Module.ANALYTICS] },
    ],
  },
  {
    label: 'System',
    items: [
      { module: Module.ADMINISTRATION, label: 'Administration', href: '/administration', icon: Building2, color: MODULE_COLORS[Module.ADMINISTRATION] },
      { module: Module.SETTINGS, label: 'Settings', href: '/settings', icon: Settings, color: MODULE_COLORS[Module.SETTINGS] },
    ],
  },
]

export default function Sidebar({ collapsed, onToggle, allowedModules }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const isAllowed = (module: Module) =>
    allowedModules.includes(module)

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 ease-in-out shrink-0"
      style={{
        width: collapsed ? '72px' : '240px',
        background: 'linear-gradient(180deg, #050c1a 0%, #0a1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 px-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          <Image src="/oilerp-mark.svg" alt="OilERP" width={36} height={36} priority />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-base leading-none">OIL</span>
              <span style={{ color: '#f59e0b' }} className="font-bold text-base leading-none">ERP</span>
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>
              Edible Oil Processing
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 px-2">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => isAllowed(item.module))
          if (visibleItems.length === 0) return null

          return (
            <div key={section.label}>
              {!collapsed && (
                <p className="sidebar-section-label text-slate-500 text-[10px] uppercase font-bold tracking-wider px-3 mt-3 mb-1">
                  {section.label}
                </p>
              )}
              {collapsed && (
                <div className="my-2 mx-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                      active
                        ? 'text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                    )}
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${item.color}25 0%, ${item.color}10 100%)`
                        : undefined,
                      borderLeft: active ? `3px solid ${item.color}` : '3px solid transparent',
                      justifyContent: collapsed ? 'center' : undefined,
                      paddingLeft: collapsed ? '0.875rem' : undefined,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: active ? item.color : `${item.color}18`,
                        color: active ? '#ffffff' : item.color,
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <><ChevronLeft className="w-4 h-4" /><span>Collapse Sidebar</span></>
          )}
        </button>
      </div>
    </aside>
  )
}
