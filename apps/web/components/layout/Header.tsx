'use client'

import { Bell, Search, LogOut } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="Search modules, tasks, or documents..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm placeholder:text-slate-400 text-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 ml-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>

        <div className="w-px h-6 bg-slate-200 hidden md:block"></div>

        {/* User Menu */}
        <div className="relative">
          <button 
            className={cn(
              "flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-all border outline-none",
              showUserMenu ? "border-slate-200 bg-slate-50 shadow-sm" : "border-transparent"
            )}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-900 leading-none mb-1">{user?.name || "User"}</div>
              <div className="text-[11px] font-medium text-slate-500 leading-none uppercase tracking-wider">{user?.role?.replace('_', ' ') || "Role"}</div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email}</p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
