'use client'

import { useState } from 'react'
import { UserCheck, Plus, Users, Calendar, Award, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface StaffMember {
  id: string
  name: string
  designation: string
  department: string
  shift: 'MORNING_SHIFT_A' | 'EVENING_SHIFT_B' | 'NIGHT_SHIFT_C'
  attendanceStatus: 'PRESENT' | 'ON_LEAVE'
  joiningDate: string
}

export default function HRPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'EMP-101', name: 'Jitendra Singh', designation: 'General Manager Plant Ops', department: 'Executive Administration', shift: 'MORNING_SHIFT_A', attendanceStatus: 'PRESENT', joiningDate: '2022-01-15' },
    { id: 'EMP-102', name: 'Rajesh Kumar', designation: 'Refinery Shift Manager', department: 'Edible Oil Refining', shift: 'MORNING_SHIFT_A', attendanceStatus: 'PRESENT', joiningDate: '2023-03-10' },
    { id: 'EMP-103', name: 'Suresh Yadav', designation: 'Warehouse Packing Lead', department: 'Warehouse & Shipping', shift: 'EVENING_SHIFT_B', attendanceStatus: 'PRESENT', joiningDate: '2023-06-20' },
    { id: 'EMP-104', name: 'Dr. Anita Roy', designation: 'FSSAI Quality Chemist', department: 'Quality Assurance Lab', shift: 'MORNING_SHIFT_A', attendanceStatus: 'ON_LEAVE', joiningDate: '2024-02-01' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null)
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, 'id'>>({
    name: '',
    designation: 'Refinery Operator',
    department: 'Edible Oil Refining',
    shift: 'MORNING_SHIFT_A',
    attendanceStatus: 'PRESENT',
    joiningDate: '2026-08-20',
  })

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    const item: StaffMember = {
      id: `EMP-${100 + staffList.length + 1}`,
      ...newStaff,
    }
    setStaffList([...staffList, item])
    setShowAddModal(false)
  }

  const handleDeleteStaff = () => {
    if (!staffToDelete) return
    setStaffList(staffList.filter((s) => s.id !== staffToDelete.id))
    setStaffToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #c026d3 0%, #ec4899 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Fuchsia HR Staffing Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Human Resources & Refinery Shift Rosters</h1>
          <p className="text-pink-100 text-sm mt-1">
            Manage plant personnel, refinery shift duty rosters (Shift A/B/C), and daily staff attendance.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-pink-900 hover:bg-pink-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Register Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold text-slate-900">{staffList.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><UserCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Present Today</p>
            <p className="text-2xl font-bold text-emerald-700">{staffList.filter((s) => s.attendanceStatus === 'PRESENT').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">On Leave</p>
            <p className="text-2xl font-bold text-amber-700">{staffList.filter((s) => s.attendanceStatus === 'ON_LEAVE').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Award className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Shifts Running</p>
            <p className="text-2xl font-bold text-slate-900">3 Shifts 24/7</p>
          </div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-pink-600" /> Plant Personnel & Staff Directory
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Emp ID</th>
              <th className="px-6 py-3">Staff Name</th>
              <th className="px-6 py-3">Designation & Dept</th>
              <th className="px-6 py-3">Roster Shift</th>
              <th className="px-6 py-3">Today Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-pink-700">{s.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{s.designation}</p>
                  <p className="text-xs text-slate-500">{s.department}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border">
                    {s.shift}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.attendanceStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.attendanceStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setStaffToDelete(s)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Register Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Full Name</label>
                <input required placeholder="e.g. Anil Sharma" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Designation</label>
                  <input required value={newStaff.designation} onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Department</label>
                  <input required value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Refinery Shift Roster</label>
                <select value={newStaff.shift} onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value as any })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
                  <option value="MORNING_SHIFT_A">MORNING_SHIFT_A (06:00 - 14:00)</option>
                  <option value="EVENING_SHIFT_B">EVENING_SHIFT_B (14:00 - 22:00)</option>
                  <option value="NIGHT_SHIFT_C">NIGHT_SHIFT_C (22:00 - 06:00)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!staffToDelete}
        title="Delete Staff Record"
        description="Do you really want to delete this employee record from HR?"
        itemName={staffToDelete ? `${staffToDelete.name} (${staffToDelete.id})` : undefined}
        confirmLabel="Yes, Delete Staff"
        onConfirm={handleDeleteStaff}
        onCancel={() => setStaffToDelete(null)}
      />
    </div>
  )
}
