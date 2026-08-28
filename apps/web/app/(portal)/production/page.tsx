'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { Plus, Database, Factory, Trash2 } from 'lucide-react'

export default function ProductionPage() {
  const { user: currentUser } = useAuthStore()
  const [tanks, setTanks] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTank, setShowAddTank] = useState(false)
  const [newTank, setNewTank] = useState({ tankNumber: '', capacityLiters: 50000, oilType: 'Crude Palm Oil' })

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<{ type: 'tank' | 'batch'; data: any } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const loadData = async () => {
    setLoading(true)
    try {
      const [tData, bData] = await Promise.all([
        apiFetch<any[]>('/production/tanks').catch(() => []),
        apiFetch<any[]>('/production/batches').catch(() => []),
      ])
      setTanks(tData)
      setBatches(bData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateTank = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/production/tanks', {
        method: 'POST',
        body: JSON.stringify({
          tankNumber: newTank.tankNumber,
          capacityLiters: Number(newTank.capacityLiters),
          oilType: newTank.oilType,
        }),
      })
      setShowAddTank(false)
      setNewTank({ tankNumber: '', capacityLiters: 50000, oilType: 'Crude Palm Oil' })
      loadData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      if (itemToDelete.type === 'tank') {
        await apiFetch(`/production/tanks/${itemToDelete.data.id}`, { method: 'DELETE' })
      } else {
        await apiFetch(`/production/batches/${itemToDelete.data.id}`, { method: 'DELETE' })
      }
      setItemToDelete(null)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete record')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Production & Storage Telemetry</h1>
          <p className="text-slate-500 text-sm">Monitor refining tanks, blending cycles, and production batch schedules.</p>
        </div>
        <button
          onClick={() => setShowAddTank(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add Storage Tank
        </button>
      </div>

      {/* Storage Tank Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" /> Storage Tank Telemetry
        </h2>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading tanks...</div>
        ) : tanks.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border text-center text-slate-400">
            No storage tanks configured. Click "Add Storage Tank" to initialize your refinery telemetry.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tanks.map((tank) => {
              const fillPercentage = Math.round((tank.currentLevelLiters / tank.capacityLiters) * 100)
              return (
                <div key={tank.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                        {tank.tankNumber}
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-2">{tank.oilType}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        {tank.status}
                      </span>
                      {isSuperAdmin && (
                        <button
                          onClick={() => setItemToDelete({ type: 'tank', data: tank })}
                          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition"
                          title="Delete Tank"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>Capacity: {tank.capacityLiters.toLocaleString()} L</span>
                      <span className="font-bold text-slate-900">{fillPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-500"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Production Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800 flex items-center gap-2">
          <Factory className="w-5 h-5 text-amber-500" /> Active Production Batches
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No active production batches scheduled.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Batch Number</th>
                <th className="px-6 py-3">Target Product</th>
                <th className="px-6 py-3">Planned Qty</th>
                <th className="px-6 py-3">Actual Qty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-amber-600">{b.batchNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{b.productName}</td>
                  <td className="px-6 py-4 text-slate-600">{b.plannedQty.toLocaleString()} L</td>
                  <td className="px-6 py-4 text-slate-600">{b.actualQty.toLocaleString()} L</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isSuperAdmin && (
                      <button
                        onClick={() => setItemToDelete({ type: 'batch', data: b })}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
                        title="Delete batch record"
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

      {/* Modal: Add Tank */}
      {showAddTank && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add Storage Tank</h2>
            <form onSubmit={handleCreateTank} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Tank Identifier</label>
                <input
                  required
                  placeholder="e.g. TANK-101"
                  value={newTank.tankNumber}
                  onChange={(e) => setNewTank({ ...newTank, tankNumber: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Capacity (Liters)</label>
                <input
                  type="number"
                  required
                  value={newTank.capacityLiters}
                  onChange={(e) => setNewTank({ ...newTank, capacityLiters: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Liquid / Oil Type</label>
                <input
                  required
                  value={newTank.oilType}
                  onChange={(e) => setNewTank({ ...newTank, oilType: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTank(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Save Tank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Tank / Batch Deletion */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        title={itemToDelete?.type === 'tank' ? 'Delete Storage Tank' : 'Delete Production Batch'}
        description={`Do you really want to delete this ${itemToDelete?.type === 'tank' ? 'tank telemetry record' : 'batch record'}?`}
        itemName={
          itemToDelete?.type === 'tank'
            ? `${itemToDelete.data.tankNumber} (${itemToDelete.data.oilType})`
            : itemToDelete
            ? `${itemToDelete.data.batchNumber} - ${itemToDelete.data.productName}`
            : undefined
        }
        confirmLabel={`Yes, Delete ${itemToDelete?.type === 'tank' ? 'Tank' : 'Batch'}`}
        isDeleting={isDeleting}
        onConfirm={handleDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  )
}
