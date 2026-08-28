'use client'

import { useState } from 'react'
import { CreditCard, Plus, DollarSign, Download, CheckCircle, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface PaySlip {
  id: string
  employeeName: string
  month: string
  baseSalary: number
  shiftIncentive: number
  taxDeductions: number
  netPay: number
  status: 'PAID' | 'PROCESSING'
}

export default function PayrollPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [slips, setSlips] = useState<PaySlip[]>([
    { id: 'PAY-2026-0801', employeeName: 'Jitendra Singh', month: 'August 2026', baseSalary: 120000, shiftIncentive: 15000, taxDeductions: 12000, netPay: 123000, status: 'PAID' },
    { id: 'PAY-2026-0802', employeeName: 'Rajesh Kumar', month: 'August 2026', baseSalary: 65000, shiftIncentive: 8000, taxDeductions: 5000, netPay: 68000, status: 'PAID' },
    { id: 'PAY-2026-0803', employeeName: 'Suresh Yadav', month: 'August 2026', baseSalary: 45000, shiftIncentive: 6000, taxDeductions: 3000, netPay: 48000, status: 'PROCESSING' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [slipToDelete, setSlipToDelete] = useState<PaySlip | null>(null)
  const [newSlip, setNewSlip] = useState<Omit<PaySlip, 'id' | 'netPay'>>({
    employeeName: '',
    month: 'August 2026',
    baseSalary: 55000,
    shiftIncentive: 5000,
    taxDeductions: 4000,
    status: 'PAID',
  })

  const handleAddSlip = (e: React.FormEvent) => {
    e.preventDefault()
    const net = newSlip.baseSalary + newSlip.shiftIncentive - newSlip.taxDeductions
    const item: PaySlip = {
      id: `PAY-2026-${800 + slips.length + 1}`,
      netPay: net,
      ...newSlip,
    }
    setSlips([item, ...slips])
    setShowAddModal(false)
  }

  const handleDeleteSlip = () => {
    if (!slipToDelete) return
    setSlips(slips.filter((s) => s.id !== slipToDelete.id))
    setSlipToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Cyan Ice Payroll & Compensation
          </span>
          <h1 className="text-2xl font-bold mt-1">Salary Payroll & Staff Disbursements</h1>
          <p className="text-cyan-100 text-sm mt-1">
            Automated monthly salary disbursement, refinery night-shift incentives, PF/TDS tax deductions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-cyan-900 hover:bg-cyan-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Generate Pay Slip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><CreditCard className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Monthly Payroll</p>
            <p className="text-2xl font-bold text-slate-900">₹{slips.reduce((sum, s) => sum + s.netPay, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Disbursed Slips</p>
            <p className="text-2xl font-bold text-emerald-700">{slips.filter((s) => s.status === 'PAID').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Shift Bonuses Total</p>
            <p className="text-2xl font-bold text-amber-700">₹{slips.reduce((sum, s) => sum + s.shiftIncentive, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Pay Slips Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-600" /> Disbursed Salary Slips Directory
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Slip ID</th>
              <th className="px-6 py-3">Employee Name</th>
              <th className="px-6 py-3">Base Salary</th>
              <th className="px-6 py-3">Shift Incentive</th>
              <th className="px-6 py-3">Deductions</th>
              <th className="px-6 py-3">Net Pay (₹)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {slips.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-cyan-700">{s.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{s.employeeName}</td>
                <td className="px-6 py-4 text-slate-600 font-mono">₹{s.baseSalary.toLocaleString()}</td>
                <td className="px-6 py-4 text-emerald-700 font-mono">+₹{s.shiftIncentive.toLocaleString()}</td>
                <td className="px-6 py-4 text-red-700 font-mono">-₹{s.taxDeductions.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono">₹{s.netPay.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => alert(`Downloading salary slip preview for ${s.employeeName}`)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg flex items-center gap-1 font-semibold">
                    <Download className="w-3.5 h-3.5" /> Slip
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => setSlipToDelete(s)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Generate Salary Pay Slip</h2>
            <form onSubmit={handleAddSlip} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Employee Name</label>
                <input required placeholder="e.g. Rajesh Kumar" value={newSlip.employeeName} onChange={(e) => setNewSlip({ ...newSlip, employeeName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Base Salary (₹)</label>
                  <input type="number" required value={newSlip.baseSalary} onChange={(e) => setNewSlip({ ...newSlip, baseSalary: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Shift Bonus (₹)</label>
                  <input type="number" required value={newSlip.shiftIncentive} onChange={(e) => setNewSlip({ ...newSlip, shiftIncentive: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Tax & PF Deductions (₹)</label>
                <input type="number" required value={newSlip.taxDeductions} onChange={(e) => setNewSlip({ ...newSlip, taxDeductions: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700">Generate Slip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!slipToDelete}
        title="Delete Salary Slip Record"
        description="Do you really want to delete this salary disbursement record?"
        itemName={slipToDelete ? `${slipToDelete.id} (${slipToDelete.employeeName})` : undefined}
        confirmLabel="Yes, Delete Slip"
        onConfirm={handleDeleteSlip}
        onCancel={() => setSlipToDelete(null)}
      />
    </div>
  )
}
