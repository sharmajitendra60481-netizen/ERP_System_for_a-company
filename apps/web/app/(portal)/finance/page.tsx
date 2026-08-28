'use client'

import { useState } from 'react'
import { DollarSign, Plus, TrendingUp, TrendingDown, CreditCard, Receipt, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface Transaction {
  id: string
  date: string
  description: string
  category: 'RAW_MATERIAL_PURCHASE' | 'DISTRIBUTOR_SALES' | 'PLANT_UTILITIES' | 'GST_TAX_PAYMENT'
  type: 'INCOME' | 'EXPENSE'
  amount: number
  reference: string
}

export default function FinancePage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-901', date: '2026-08-20', description: 'Crude Soyabean Oil Shipment Inward (50,000L)', category: 'RAW_MATERIAL_PURCHASE', type: 'EXPENSE', amount: 5200000, reference: 'PO-2026-0012' },
    { id: 'TXN-902', date: '2026-08-20', description: 'Distributor Invoice Collection - Gujarat Foods', category: 'DISTRIBUTOR_SALES', type: 'INCOME', amount: 7850000, reference: 'INV-2026-0045' },
    { id: 'TXN-903', date: '2026-08-19', description: 'Monthly Electricity & Boiler Fuel Bill', category: 'PLANT_UTILITIES', type: 'EXPENSE', amount: 450000, reference: 'UTIL-0826' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [txnToDelete, setTxnToDelete] = useState<Transaction | null>(null)
  const [newTxn, setNewTxn] = useState<Omit<Transaction, 'id' | 'date'>>({
    description: '',
    category: 'RAW_MATERIAL_PURCHASE',
    type: 'EXPENSE',
    amount: 150000,
    reference: 'REF-001',
  })

  const handleAddTxn = (e: React.FormEvent) => {
    e.preventDefault()
    const item: Transaction = {
      id: `TXN-${900 + transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...newTxn,
    }
    setTransactions([item, ...transactions])
    setShowAddModal(false)
  }

  const handleDeleteTxn = () => {
    if (!txnToDelete) return
    setTransactions(transactions.filter((t) => t.id !== txnToDelete.id))
    setTxnToDelete(null)
  }

  const totalIncome = transactions.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpense

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Banker Green Finance Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Finance & General Ledger Accounting</h1>
          <p className="text-green-100 text-sm mt-1">
            Real-time cashflow analytics, revenue from edible oil dispatches, raw material expenditure, and GST reconciliation.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-green-900 hover:bg-green-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Ledger Record
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Sales Inflow</p>
            <p className="text-2xl font-bold text-emerald-700">₹{totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Purchases Outflow</p>
            <p className="text-2xl font-bold text-red-700">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Net Operating Surplus</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>₹{netProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-green-600" /> General Ledger Accounting Transactions
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Txn ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description & Reference</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Amount (₹)</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-green-700">{t.id}</td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{t.date}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{t.description}</p>
                  <p className="text-xs text-slate-500 font-mono">Ref: {t.reference}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold text-right ${t.type === 'INCOME' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {t.type === 'INCOME' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setTxnToDelete(t)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Add General Ledger Entry</h2>
            <form onSubmit={handleAddTxn} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Description</label>
                <input required placeholder="e.g. Soyabean Crushing Electricity Charges" value={newTxn.description} onChange={(e) => setNewTxn({ ...newTxn, description: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Type</label>
                  <select value={newTxn.type} onChange={(e) => setNewTxn({ ...newTxn, type: e.target.value as any })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="INCOME">INCOME (+)</option>
                    <option value="EXPENSE">EXPENSE (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Amount (₹)</label>
                  <input type="number" required value={newTxn.amount} onChange={(e) => setNewTxn({ ...newTxn, amount: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Reference Voucher / PO / INV No</label>
                <input required value={newTxn.reference} onChange={(e) => setNewTxn({ ...newTxn, reference: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!txnToDelete}
        title="Delete Ledger Entry"
        description="Do you really want to delete this financial ledger transaction?"
        itemName={txnToDelete ? `${txnToDelete.id} (${txnToDelete.description})` : undefined}
        confirmLabel="Yes, Delete Entry"
        onConfirm={handleDeleteTxn}
        onCancel={() => setTxnToDelete(null)}
      />
    </div>
  )
}
