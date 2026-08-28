'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { Building2, UserPlus, Users, Trash2, Shield } from 'lucide-react'

export default function AdministrationPage() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Deletion modal state
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'OilERP@123',
    role: 'PRODUCTION_MANAGER',
  })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<any[]>('/auth/users').catch(() => [])
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/auth/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      })
      setShowAddModal(false)
      setNewUser({ firstName: '', lastName: '', email: '', password: 'OilERP@123', role: 'PRODUCTION_MANAGER' })
      loadUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      await apiFetch(`/auth/users/${userToDelete.id}`, {
        method: 'DELETE',
      })
      setUserToDelete(null)
      loadUsers()
    } catch (err: any) {
      alert(err.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Crimson Administration Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">User Management & System Administration</h1>
          <p className="text-rose-100 text-sm mt-1">
            Add team members, assign company roles, and delete user accounts with Super Admin authority.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-rose-900 hover:bg-rose-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Tenant Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-rose-600" /> Active Company Tenant
        </h2>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <p className="text-sm font-bold text-slate-900">Apex Edible Oils & Foods Pvt Ltd</p>
          <p className="text-xs text-slate-500 font-mono">Domain: oilerp.com | Tenant ID: 056ee1df-31f2-4216-bcea-036f6d04db82</p>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800 flex justify-between items-center">
          <span className="flex items-center gap-2"><Users className="w-5 h-5 text-rose-600" /> Company User Accounts</span>
          <span className="text-xs text-slate-500 font-bold">Total Accounts: {users.length}</span>
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading user directory from Supabase...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No users found. Click "Add Team Member" to create new staff accounts.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Account Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id || currentUser?.email === u.email
                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.firstName} {u.lastName}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700">
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSuperAdmin && !isSelf && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </button>
                      )}
                      {isSelf && (
                        <span className="text-xs text-slate-400 font-medium italic">Current User</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add Team Member */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add New Team Member</h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">First Name</label>
                  <input
                    required
                    placeholder="John"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Last Name</label>
                  <input
                    required
                    placeholder="Doe"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@oilerp.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Initial Password</label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">ERP Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                  <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
                  <option value="PRODUCTION_MANAGER">PRODUCTION_MANAGER</option>
                  <option value="WAREHOUSE_OPERATOR">WAREHOUSE_OPERATOR</option>
                  <option value="HR_MANAGER">HR_MANAGER</option>
                  <option value="SALES_REP">SALES_REP</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for User Account Deletion */}
      <ConfirmDeleteModal
        isOpen={!!userToDelete}
        title="Delete User Account"
        description="Do you really want to delete this user account? The user will immediately lose access to the system."
        itemName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName} (${userToDelete.email})` : undefined}
        confirmLabel="Yes, Delete Account"
        isDeleting={isDeleting}
        onConfirm={handleDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  )
}
