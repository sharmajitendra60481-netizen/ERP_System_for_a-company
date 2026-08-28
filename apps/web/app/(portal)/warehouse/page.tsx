'use client'

import { useState } from 'react'
import { Warehouse, Plus, Layers, PackageCheck, AlertCircle, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface BinLocation {
  id: string
  zone: string
  binCode: string
  capacityTins: number
  storedQty: number
  productStored: string
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'EMPTY'
}

export default function WarehousePage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [bins, setBins] = useState<BinLocation[]>([
    { id: 'BIN-A1', zone: 'Zone A (Finished Goods)', binCode: 'A1-P01', capacityTins: 2000, storedQty: 1850, productStored: '15L Tin Refined Soyabean Oil', status: 'NEAR_CAPACITY' },
    { id: 'BIN-A2', zone: 'Zone A (Finished Goods)', binCode: 'A1-P02', capacityTins: 2000, storedQty: 1200, productStored: '1L Pouch Fortune Soyabean Pack', status: 'OPTIMAL' },
    { id: 'BIN-B1', zone: 'Zone B (Bulk Storage)', binCode: 'B1-P01', capacityTins: 5000, storedQty: 4200, productStored: '15L Tin Kachi Ghani Mustard Oil', status: 'OPTIMAL' },
    { id: 'BIN-C1', zone: 'Zone C (Packaging Material)', binCode: 'C1-P01', capacityTins: 10000, storedQty: 0, productStored: 'Empty Tin Cans & Pouch Rolls', status: 'EMPTY' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [binToDelete, setBinToDelete] = useState<BinLocation | null>(null)
  const [newBin, setNewBin] = useState<Omit<BinLocation, 'id'>>({
    zone: 'Zone A (Finished Goods)',
    binCode: '',
    capacityTins: 2500,
    storedQty: 500,
    productStored: '15L Tin Edible Oil',
    status: 'OPTIMAL',
  })

  const handleAddBin = (e: React.FormEvent) => {
    e.preventDefault()
    const item: BinLocation = {
      id: `BIN-${bins.length + 1}`,
      ...newBin,
    }
    setBins([...bins, item])
    setShowAddModal(false)
    setNewBin({ zone: 'Zone A (Finished Goods)', binCode: '', capacityTins: 2500, storedQty: 500, productStored: '15L Tin Edible Oil', status: 'OPTIMAL' })
  }

  const handleDeleteBin = () => {
    if (!binToDelete) return
    setBins(bins.filter((b) => b.id !== binToDelete.id))
    setBinToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Burnt Orange Warehouse Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Warehouse Bin & Pallet Racking Telemetry</h1>
          <p className="text-orange-100 text-sm mt-1">
            Monitor packaged edible oil pallet racking, storage bin utilization, and warehouse stack capacity.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-orange-900 hover:bg-orange-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Storage Bin
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Warehouse className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Bins</p>
            <p className="text-2xl font-bold text-slate-900">{bins.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><PackageCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Stored Quantity</p>
            <p className="text-2xl font-bold text-slate-900">{bins.reduce((sum, b) => sum + b.storedQty, 0).toLocaleString()} Units</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Layers className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Capacity</p>
            <p className="text-2xl font-bold text-slate-900">{bins.reduce((sum, b) => sum + b.capacityTins, 0).toLocaleString()} Units</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Near Capacity</p>
            <p className="text-2xl font-bold text-slate-900">{bins.filter((b) => b.status === 'NEAR_CAPACITY').length}</p>
          </div>
        </div>
      </div>

      {/* Grid of Bins */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-orange-600" /> Active Racking Bins Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bins.map((bin) => {
            const pct = Math.round((bin.storedQty / bin.capacityTins) * 100)
            return (
              <div key={bin.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                      {bin.binCode}
                    </span>
                    <h3 className="font-bold text-slate-900 mt-1">{bin.productStored}</h3>
                    <p className="text-xs text-slate-500">{bin.zone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bin.status === 'NEAR_CAPACITY' ? 'bg-amber-100 text-amber-800' : bin.status === 'EMPTY' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {bin.status}
                    </span>
                    {isSuperAdmin && (
                      <button
                        onClick={() => setBinToDelete(bin)}
                        className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded"
                        title="Delete Bin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Stored: {bin.storedQty.toLocaleString()} / {bin.capacityTins.toLocaleString()}</span>
                    <span>{pct}% Capacity</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal: Add Bin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add Warehouse Storage Bin</h2>
            <form onSubmit={handleAddBin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Bin Location Code</label>
                <input required placeholder="e.g. A3-P05" value={newBin.binCode} onChange={(e) => setNewBin({ ...newBin, binCode: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Warehouse Zone</label>
                <input required placeholder="e.g. Zone A (Finished Goods)" value={newBin.zone} onChange={(e) => setNewBin({ ...newBin, zone: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Product Stored</label>
                <input required placeholder="e.g. 15L Tin Refined Soyabean" value={newBin.productStored} onChange={(e) => setNewBin({ ...newBin, productStored: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Capacity (Units)</label>
                  <input type="number" required value={newBin.capacityTins} onChange={(e) => setNewBin({ ...newBin, capacityTins: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Current Stock</label>
                  <input type="number" required value={newBin.storedQty} onChange={(e) => setNewBin({ ...newBin, storedQty: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700">Save Bin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!binToDelete}
        title="Delete Warehouse Storage Bin"
        description="Do you really want to delete this warehouse bin location?"
        itemName={binToDelete ? `${binToDelete.binCode} (${binToDelete.productStored})` : undefined}
        confirmLabel="Yes, Delete Bin"
        onConfirm={handleDeleteBin}
        onCancel={() => setBinToDelete(null)}
      />
    </div>
  )
}
