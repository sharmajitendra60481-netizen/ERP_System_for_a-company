'use client'

import { useState } from 'react'
import { BarChart3, Download, Printer, FileText, Calendar, Filter } from 'lucide-react'

interface ERPReport {
  id: string
  name: string
  category: 'PRODUCTION' | 'FINANCE' | 'QUALITY' | 'SALES'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  lastGenerated: string
}

export default function ReportsPage() {
  const [reports] = useState<ERPReport[]>([
    { id: 'REP-01', name: 'Daily Edible Oil Crushing & Refinery Yield Report', category: 'PRODUCTION', frequency: 'DAILY', lastGenerated: 'Today 18:00' },
    { id: 'REP-02', name: 'FSSAI Quality Lab Sample Audit Compliance Summary', category: 'QUALITY', frequency: 'WEEKLY', lastGenerated: 'Yesterday' },
    { id: 'REP-03', name: 'Monthly GST Output Tax & Distributor Billing Ledger', category: 'FINANCE', frequency: 'MONTHLY', lastGenerated: '2026-08-01' },
    { id: 'REP-04', name: 'Distributor Dispatch Volume & Revenue Summary', category: 'SALES', frequency: 'DAILY', lastGenerated: 'Today 19:30' },
  ])

  const handleRunReport = (name: string) => {
    alert(`Generating live ERP report for "${name}". Downloading CSV dataset...`)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            BI Purple Reports Generator
          </span>
          <h1 className="text-2xl font-bold mt-1">Enterprise ERP Reports & Business Intelligence</h1>
          <p className="text-purple-100 text-sm mt-1">
            Generate and export daily refining yields, FSSAI compliance summaries, and GST tax ledger reports.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                {r.frequency}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-purple-600 font-semibold">{r.id}</span>
              <h3 className="font-bold text-slate-900 text-base mt-1">{r.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Last Generated: {r.lastGenerated}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleRunReport(r.name)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Export CSV / Excel
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center gap-1"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
