'use client'

import Sidebar from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated && !isLoading) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        allowedModules={user?.modules || []} 
      />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
