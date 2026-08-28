import React from 'react'

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

export function KpiCard({ title, value, change, changeType = 'neutral', icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-medium ${
          changeType === 'positive' ? 'text-emerald-600' :
          changeType === 'negative' ? 'text-red-500' : 'text-slate-500'
        }`}>
          {change}
        </p>
      )}
    </div>
  )
}
