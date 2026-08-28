'use client'

import { useState } from 'react'
import { Truck, Plus, MapPin, CheckCircle, Clock, Navigation, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface Shipment {
  id: string
  truckNumber: string
  driverName: string
  destination: string
  cargo: string
  volumeLiters: number
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED'
  eta: string
}

export default function LogisticsPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [shipments, setShipments] = useState<Shipment[]>([
    { id: 'DISP-801', truckNumber: 'GJ-01-AX-9988 (30KL Tanker)', driverName: 'Suresh Parmar', destination: 'Apex Retail Depot, Vadodara', cargo: 'Refined Soyabean Oil (Bulk)', volumeLiters: 30000, status: 'IN_TRANSIT', eta: '2 Hours' },
    { id: 'DISP-802', truckNumber: 'MH-04-BT-1122 (20KL Tanker)', driverName: 'Ramesh Sawant', destination: 'Mumbai Supermart Hub', cargo: 'Kachi Ghani Mustard Oil Tins', volumeLiters: 20000, status: 'DISPATCHED', eta: '6 Hours' },
    { id: 'DISP-803', truckNumber: 'DL-01-CC-4455 (35KL Tanker)', driverName: 'Gurdeep Singh', destination: 'Delhi NCR Wholesale Terminal', cargo: 'Refined Sunflower Oil (Bulk)', volumeLiters: 35000, status: 'DELIVERED', eta: 'Arrived' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null)
  const [newShipment, setNewShipment] = useState<Omit<Shipment, 'id'>>({
    truckNumber: 'GJ-06-XX-5544 (25KL Tanker)',
    driverName: 'Vikram Patel',
    destination: 'Surat Distribution Depot',
    cargo: '15L Tin Packaged Soyabean',
    volumeLiters: 25000,
    status: 'DISPATCHED',
    eta: '4 Hours',
  })

  const handleAddShipment = (e: React.FormEvent) => {
    e.preventDefault()
    const item: Shipment = {
      id: `DISP-${800 + shipments.length + 1}`,
      ...newShipment,
    }
    setShipments([item, ...shipments])
    setShowAddModal(false)
  }

  const handleDeleteShipment = () => {
    if (!shipmentToDelete) return
    setShipments(shipments.filter((s) => s.id !== shipmentToDelete.id))
    setShipmentToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Indigo Dispatch & Fleet Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Oil Tanker Fleet & Delivery Telemetry</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Real-time GPS tracking for bulk edible oil tankers, logistics dispatch, and distributor deliveries.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Dispatch Tanker
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Truck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Tankers</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Navigation className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">In Transit</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter((s) => s.status === 'IN_TRANSIT').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Delivered Today</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter((s) => s.status === 'DELIVERED').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Volume Dispatched</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.reduce((sum, s) => sum + s.volumeLiters, 0).toLocaleString()} L</p>
          </div>
        </div>
      </div>

      {/* Shipment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-600" /> Active Oil Tanker Dispatch Movements
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Dispatch ID</th>
              <th className="px-6 py-3">Tanker & Driver</th>
              <th className="px-6 py-3">Destination Terminal</th>
              <th className="px-6 py-3">Oil Cargo</th>
              <th className="px-6 py-3">Volume</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-indigo-700">{s.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{s.truckNumber}</p>
                  <p className="text-xs text-slate-500">Driver: {s.driverName}</p>
                </td>
                <td className="px-6 py-4 text-slate-700">{s.destination}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{s.cargo}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{s.volumeLiters.toLocaleString()} L</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : s.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    {s.status} (ETA: {s.eta})
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setShipmentToDelete(s)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Dispatch New Oil Tanker</h2>
            <form onSubmit={handleAddShipment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Truck Reg & Capacity</label>
                <input required value={newShipment.truckNumber} onChange={(e) => setNewShipment({ ...newShipment, truckNumber: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Driver Name</label>
                <input required value={newShipment.driverName} onChange={(e) => setNewShipment({ ...newShipment, driverName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Destination Terminal / Customer</label>
                <input required value={newShipment.destination} onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Oil Cargo</label>
                <input required value={newShipment.cargo} onChange={(e) => setNewShipment({ ...newShipment, cargo: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Volume (Liters)</label>
                  <input type="number" required value={newShipment.volumeLiters} onChange={(e) => setNewShipment({ ...newShipment, volumeLiters: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Estimated ETA</label>
                  <input required value={newShipment.eta} onChange={(e) => setNewShipment({ ...newShipment, eta: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Confirm Dispatch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!shipmentToDelete}
        title="Delete Tanker Dispatch Record"
        description="Do you really want to delete this dispatch record?"
        itemName={shipmentToDelete ? `${shipmentToDelete.id} (${shipmentToDelete.truckNumber})` : undefined}
        confirmLabel="Yes, Delete Dispatch"
        onConfirm={handleDeleteShipment}
        onCancel={() => setShipmentToDelete(null)}
      />
    </div>
  )
}
