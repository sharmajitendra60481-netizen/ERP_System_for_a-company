'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { Plus, Truck, Package, FileText, Trash2 } from 'lucide-react'

export default function ProcurementPage() {
  const { user: currentUser } = useAuthStore()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [newSupplier, setNewSupplier] = useState({ code: '', name: '', gstin: '', email: '', phone: '' })

  // Deletion modal state
  const [supplierToDelete, setSupplierToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const loadData = async () => {
    setLoading(true)
    try {
      const [suppData, poData] = await Promise.all([
        apiFetch<any[]>('/procurement/suppliers').catch(() => []),
        apiFetch<any[]>('/procurement/purchase-orders').catch(() => []),
      ])
      setSuppliers(suppData)
      setPurchaseOrders(poData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/procurement/suppliers', {
        method: 'POST',
        body: JSON.stringify(newSupplier),
      })
      setShowAddSupplier(false)
      setNewSupplier({ code: '', name: '', gstin: '', email: '', phone: '' })
      loadData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return
    setIsDeleting(true)
    try {
      await apiFetch(`/procurement/suppliers/${supplierToDelete.id}`, {
        method: 'DELETE',
      })
      setSupplierToDelete(null)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete supplier record')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement & Raw Materials</h1>
          <p className="text-slate-500 text-sm">Manage raw material suppliers, purchase orders, and inward deliveries.</p>
        </div>
        <button
          onClick={() => setShowAddSupplier(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Suppliers</p>
            <p className="text-2xl font-bold text-slate-900">{suppliers.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Purchase Orders</p>
            <p className="text-2xl font-bold text-slate-900">{purchaseOrders.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Spend</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Supplier Directory
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No suppliers found. Click "Add Supplier" to create your first vendor record.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Supplier Name</th>
                <th className="px-6 py-3">GSTIN</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-blue-600">{s.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{s.gstin || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{s.email || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{s.phone || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    {isSuperAdmin && (
                      <button
                        onClick={() => setSupplierToDelete(s)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
                        title="Delete supplier record"
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

      {/* Modal: Add Supplier */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add New Supplier</h2>
            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Supplier Code</label>
                <input
                  required
                  placeholder="e.g. SUP-001"
                  value={newSupplier.code}
                  onChange={(e) => setNewSupplier({ ...newSupplier, code: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Supplier Name</label>
                <input
                  required
                  placeholder="e.g. Gujarat Crude Traders Ltd"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">GSTIN</label>
                <input
                  placeholder="24AAAAA0000A1Z5"
                  value={newSupplier.gstin}
                  onChange={(e) => setNewSupplier({ ...newSupplier, gstin: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email</label>
                  <input
                    type="email"
                    placeholder="contact@vendor.com"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone</label>
                  <input
                    placeholder="+91 9876543210"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Supplier Record Deletion */}
      <ConfirmDeleteModal
        isOpen={!!supplierToDelete}
        title="Delete Supplier Record"
        description="Do you really want to delete this supplier record? All associated purchase data will be permanently removed."
        itemName={supplierToDelete ? `${supplierToDelete.name} (${supplierToDelete.code})` : undefined}
        confirmLabel="Yes, Delete Supplier"
        isDeleting={isDeleting}
        onConfirm={handleDeleteSupplier}
        onCancel={() => setSupplierToDelete(null)}
      />
    </div>
  )
}
