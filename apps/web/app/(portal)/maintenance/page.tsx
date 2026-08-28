'use client'

import { useState } from 'react'
import { Wrench, Plus, AlertOctagon, CheckCircle2, Clock, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface WorkOrder {
  id: string
  equipmentName: string
  issueDescription: string
  priority: 'EMERGENCY' | 'HIGH' | 'ROUTINE'
  assignedTechnician: string
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
  scheduledDate: string
}

export default function MaintenancePage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [orders, setOrders] = useState<WorkOrder[]>([
    { id: 'WO-501', equipmentName: 'Refinery Neutralizer Pump #2', issueDescription: 'Mechanical seal leakage & pressure drop', priority: 'EMERGENCY', assignedTechnician: 'Ramesh Tech Lead', status: 'IN_PROGRESS', scheduledDate: '2026-08-20' },
    { id: 'WO-502', equipmentName: 'Packaging Line Pouch Cutter', issueDescription: 'Routine blade replacement & lubrication', priority: 'ROUTINE', assignedTechnician: 'Suresh Fitter', status: 'COMPLETED', scheduledDate: '2026-08-19' },
    { id: 'WO-503', equipmentName: 'Boiler Husk Feed Conveyor', issueDescription: 'Chain tension calibration required', priority: 'HIGH', assignedTechnician: 'Vikram Mechanic', status: 'OPEN', scheduledDate: '2026-08-21' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<WorkOrder | null>(null)
  const [newOrder, setNewOrder] = useState<Omit<WorkOrder, 'id'>>({
    equipmentName: 'Deodorizer Vacuum Pump',
    issueDescription: 'Oil filter replacement',
    priority: 'HIGH',
    assignedTechnician: 'Ramesh Tech Lead',
    status: 'OPEN',
    scheduledDate: '2026-08-21',
  })

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const item: WorkOrder = {
      id: `WO-${500 + orders.length + 1}`,
      ...newOrder,
    }
    setOrders([item, ...orders])
    setShowAddModal(false)
  }

  const handleDeleteOrder = () => {
    if (!orderToDelete) return
    setOrders(orders.filter((o) => o.id !== orderToDelete.id))
    setOrderToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Industrial Red Maintenance Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Refinery Equipment Maintenance & Repairs</h1>
          <p className="text-red-100 text-sm mt-1">
            Preventive maintenance scheduling, emergency work orders, and plant downtime minimization.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-red-900 hover:bg-red-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Work Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Wrench className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Work Orders</p>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-xl"><AlertOctagon className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Emergency Repairs</p>
            <p className="text-2xl font-bold text-red-700">{orders.filter((o) => o.priority === 'EMERGENCY').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-amber-700">{orders.filter((o) => o.status === 'IN_PROGRESS').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-emerald-700">{orders.filter((o) => o.status === 'COMPLETED').length}</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-red-600" /> Active Maintenance Work Orders
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Equipment / Machine</th>
              <th className="px-6 py-3">Issue Description</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Technician</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-red-700">{o.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{o.equipmentName}</td>
                <td className="px-6 py-4 text-slate-700">{o.issueDescription}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${o.priority === 'EMERGENCY' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-700'}`}>
                    {o.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-800 font-medium">{o.assignedTechnician}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${o.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : o.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setOrderToDelete(o)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Create Work Order</h2>
            <form onSubmit={handleAddOrder} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Equipment / Machine Name</label>
                <input required value={newOrder.equipmentName} onChange={(e) => setNewOrder({ ...newOrder, equipmentName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Issue / Failure Description</label>
                <input required value={newOrder.issueDescription} onChange={(e) => setNewOrder({ ...newOrder, issueDescription: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Priority Level</label>
                  <select value={newOrder.priority} onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value as any })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="ROUTINE">ROUTINE</option>
                    <option value="HIGH">HIGH</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Assigned Technician</label>
                  <input required value={newOrder.assignedTechnician} onChange={(e) => setNewOrder({ ...newOrder, assignedTechnician: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Save Work Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!orderToDelete}
        title="Delete Work Order"
        description="Do you really want to delete this maintenance work order?"
        itemName={orderToDelete ? `${orderToDelete.id} (${orderToDelete.equipmentName})` : undefined}
        confirmLabel="Yes, Delete Order"
        onConfirm={handleDeleteOrder}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  )
}
