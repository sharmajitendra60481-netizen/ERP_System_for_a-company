'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { Plus, Users, ShoppingBag, Receipt, Trash2 } from 'lucide-react'

export default function SalesPage() {
  const { user: currentUser } = useAuthStore()
  const [customers, setCustomers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ code: '', name: '', gstin: '', email: '', phone: '' })

  // Deletion modal state
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const loadData = async () => {
    setLoading(true)
    try {
      const [cData, oData] = await Promise.all([
        apiFetch<any[]>('/sales/customers').catch(() => []),
        apiFetch<any[]>('/sales/orders').catch(() => []),
      ])
      setCustomers(cData)
      setOrders(oData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/sales/customers', {
        method: 'POST',
        body: JSON.stringify(newCustomer),
      })
      setShowAddCustomer(false)
      setNewCustomer({ code: '', name: '', gstin: '', email: '', phone: '' })
      loadData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return
    setIsDeleting(true)
    try {
      await apiFetch(`/sales/customers/${customerToDelete.id}`, { method: 'DELETE' })
      setCustomerToDelete(null)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete customer record')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales & Customers</h1>
          <p className="text-slate-500 text-sm">Manage distributor accounts, sales orders, and dispatch tracking.</p>
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add Customer / Distributor
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Distributors / Customers</p>
            <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Sales Orders</p>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Customer & Distributor Directory
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No customers found. Click "Add Customer" to create your first account.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">GSTIN</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{c.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{c.gstin || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{c.email || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{c.phone || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    {isSuperAdmin && (
                      <button
                        onClick={() => setCustomerToDelete(c)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
                        title="Delete customer record"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add Customer */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add Customer / Distributor</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Customer Code</label>
                <input
                  required
                  placeholder="e.g. CUST-101"
                  value={newCustomer.code}
                  onChange={(e) => setNewCustomer({ ...newCustomer, code: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Customer / Firm Name</label>
                <input
                  required
                  placeholder="e.g. Apex Traders Pvt Ltd"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">GSTIN</label>
                <input
                  placeholder="24BBBBB0000B1Z5"
                  value={newCustomer.gstin}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gstin: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email</label>
                  <input
                    type="email"
                    placeholder="sales@firm.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone</label>
                  <input
                    placeholder="+91 9876543210"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Customer Deletion */}
      <ConfirmDeleteModal
        isOpen={!!customerToDelete}
        title="Delete Customer Record"
        description="Do you really want to delete this customer/distributor account?"
        itemName={customerToDelete ? `${customerToDelete.name} (${customerToDelete.code})` : undefined}
        confirmLabel="Yes, Delete Customer"
        isDeleting={isDeleting}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  )
}
