'use client'

import { useState } from 'react'
import { Building2, Plus, Wrench, CheckCircle, Shield, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface MachineAsset {
  id: string
  assetName: string
  modelNo: string
  location: string
  category: 'REFINING_COLUMN' | 'PACKAGING_LINE' | 'BOILER_UTILITY' | 'STORAGE_SILO'
  valuation: number
  status: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED'
}

export default function AssetsPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [assets, setAssets] = useState<MachineAsset[]>([
    { id: 'AST-101', assetName: 'High-Vacuum Deodorizer Tower (500TPD)', modelNo: 'DEO-TURBO-500', location: 'Refinery Section 1', category: 'REFINING_COLUMN', valuation: 12500000, status: 'OPERATIONAL' },
    { id: 'AST-102', assetName: 'Automatic 15L Tin Filling & Sealing Line', modelNo: 'FILL-AUTO-15L', location: 'Packing Shed B', category: 'PACKAGING_LINE', valuation: 4500000, status: 'OPERATIONAL' },
    { id: 'AST-103', assetName: 'Thermal Fluid Husk-Fired Boiler (10 Ton)', modelNo: 'BOILER-TF-10T', location: 'Utility Powerhouse', category: 'BOILER_UTILITY', valuation: 8500000, status: 'MAINTENANCE_REQUIRED' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<MachineAsset | null>(null)
  const [newAsset, setNewAsset] = useState<Omit<MachineAsset, 'id'>>({
    assetName: '',
    modelNo: 'MOD-2026-X',
    location: 'Refinery Section 2',
    category: 'REFINING_COLUMN',
    valuation: 3500000,
    status: 'OPERATIONAL',
  })

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault()
    const item: MachineAsset = {
      id: `AST-${100 + assets.length + 1}`,
      ...newAsset,
    }
    setAssets([...assets, item])
    setShowAddModal(false)
  }

  const handleDeleteAsset = () => {
    if (!assetToDelete) return
    setAssets(assets.filter((a) => a.id !== assetToDelete.id))
    setAssetToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Steel Slate Plant Assets Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Refinery Plant Machinery & Capital Assets</h1>
          <p className="text-slate-200 text-sm mt-1">
            Track oil refining towers, automated tin filling lines, thermal boilers, and plant asset valuations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Register Machine Asset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl"><Building2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Machinery Valuation</p>
            <p className="text-2xl font-bold text-slate-900">₹{assets.reduce((sum, a) => sum + a.valuation, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Operational Units</p>
            <p className="text-2xl font-bold text-emerald-700">{assets.filter((a) => a.status === 'OPERATIONAL').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Wrench className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Under Maintenance</p>
            <p className="text-2xl font-bold text-amber-700">{assets.filter((a) => a.status === 'MAINTENANCE_REQUIRED').length}</p>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-600" /> Refinery Plant Machinery Catalog
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Asset ID</th>
              <th className="px-6 py-3">Machine / Asset Name</th>
              <th className="px-6 py-3">Model No & Location</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Asset Value (₹)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {assets.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-slate-700">{a.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{a.assetName}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{a.modelNo}</p>
                  <p className="text-xs text-slate-500">{a.location}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border">
                    {a.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono">₹{a.valuation.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${a.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setAssetToDelete(a)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Register Plant Machine Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Asset / Machine Name</label>
                <input required placeholder="e.g. Bleaching Earth Filter Press" value={newAsset.assetName} onChange={(e) => setNewAsset({ ...newAsset, assetName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Model No</label>
                  <input required value={newAsset.modelNo} onChange={(e) => setNewAsset({ ...newAsset, modelNo: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Plant Location</label>
                  <input required value={newAsset.location} onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Asset Valuation (₹)</label>
                <input type="number" required value={newAsset.valuation} onChange={(e) => setNewAsset({ ...newAsset, valuation: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!assetToDelete}
        title="Delete Machine Asset"
        description="Do you really want to delete this plant machinery record?"
        itemName={assetToDelete ? `${assetToDelete.assetName} (${assetToDelete.id})` : undefined}
        confirmLabel="Yes, Delete Asset"
        onConfirm={handleDeleteAsset}
        onCancel={() => setAssetToDelete(null)}
      />
    </div>
  )
}
