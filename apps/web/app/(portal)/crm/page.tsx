'use client'

import { useState } from 'react'
import { Users, UserPlus, PhoneCall, Building, Mail, Phone, MapPin, Trash2, Filter } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface Lead {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  region: string
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST'
  estimatedVolume: string
}

export default function CRMPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'LEAD-101',
      companyName: 'Gujarat Food Distributors Pvt Ltd',
      contactPerson: 'Ramesh Patel',
      email: 'ramesh@gujaratfoods.in',
      phone: '+91 98250 12345',
      region: 'Ahmedabad, Gujarat',
      status: 'QUALIFIED',
      estimatedVolume: '50,000 L / Month',
    },
    {
      id: 'LEAD-102',
      companyName: 'Maharastra Oil Mart & Retail',
      contactPerson: 'Sanjay Deshmukh',
      email: 'sanjay@oilmart.co.in',
      phone: '+91 94220 67890',
      region: 'Mumbai, Maharashtra',
      status: 'CONTACTED',
      estimatedVolume: '1,20,000 L / Month',
    },
    {
      id: 'LEAD-103',
      companyName: 'Northern Wholesale Consumer Goods',
      contactPerson: 'Vikram Singh',
      email: 'vikram@nwcg.com',
      phone: '+91 98110 43210',
      region: 'Delhi NCR',
      status: 'WON',
      estimatedVolume: '2,00,000 L / Month',
    },
  ])

  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null)
  const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    region: 'Gujarat',
    status: 'NEW',
    estimatedVolume: '25,000 L / Month',
  })

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault()
    const item: Lead = {
      id: `LEAD-${100 + leads.length + 1}`,
      ...newLead,
    }
    setLeads([item, ...leads])
    setShowAddModal(false)
    setNewLead({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      region: 'Gujarat',
      status: 'NEW',
      estimatedVolume: '25,000 L / Month',
    })
  }

  const handleDeleteLead = () => {
    if (!leadToDelete) return
    setLeads(leads.filter((l) => l.id !== leadToDelete.id))
    setLeadToDelete(null)
  }

  const filteredLeads = filterStatus === 'ALL' ? leads : leads.filter((l) => l.status === filterStatus)

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Teal CRM Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold">CRM & Distributor Lead Pipeline</h1>
          <p className="text-teal-100 text-sm mt-1">
            Track edible oil wholesale distributor inquiries, sales opportunities, and deal closure pipeline.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add Distributor Lead
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Leads</p>
            <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Deals Won</p>
            <p className="text-2xl font-bold text-slate-900">{leads.filter((l) => l.status === 'WON').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{leads.filter((l) => l.status === 'CONTACTED' || l.status === 'QUALIFIED').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Regions</p>
            <p className="text-2xl font-bold text-slate-900">3 States</p>
          </div>
        </div>
      </div>

      {/* Filter Bar & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Users className="w-5 h-5 text-teal-600" /> Distributor Lead Directory
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No leads matching selected filter.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-3">Lead ID</th>
                <th className="px-6 py-3">Company / Firm Name</th>
                <th className="px-6 py-3">Contact Person</th>
                <th className="px-6 py-3">Region</th>
                <th className="px-6 py-3">Est. Volume</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-medium text-teal-600">{l.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{l.companyName}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{l.contactPerson}</p>
                    <p className="text-xs text-slate-500">{l.email} | {l.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{l.region}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{l.estimatedVolume}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        l.status === 'WON'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'QUALIFIED'
                          ? 'bg-teal-100 text-teal-800'
                          : l.status === 'CONTACTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isSuperAdmin && (
                      <button
                        onClick={() => setLeadToDelete(l)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition"
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

      {/* Modal: Add Lead */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Register New Distributor Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Company / Firm Name</label>
                <input
                  required
                  placeholder="e.g. Royal Oil Wholesalers"
                  value={newLead.companyName}
                  onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Contact Person Name</label>
                <input
                  required
                  placeholder="e.g. Rajesh Shah"
                  value={newLead.contactPerson}
                  onChange={(e) => setNewLead({ ...newLead, contactPerson: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@royaloil.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                  <input
                    required
                    placeholder="+91 98765 43210"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Region / City</label>
                  <input
                    required
                    placeholder="e.g. Surat, Gujarat"
                    value={newLead.region}
                    onChange={(e) => setNewLead({ ...newLead, region: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Estimated Monthly Volume</label>
                  <input
                    required
                    placeholder="e.g. 50,000 L / Month"
                    value={newLead.estimatedVolume}
                    onChange={(e) => setNewLead({ ...newLead, estimatedVolume: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Initial Pipeline Stage</label>
                <select
                  value={newLead.status}
                  onChange={(e) => setNewLead({ ...newLead, status: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="NEW">NEW LEAD</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="WON">DEAL WON</option>
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
                  className="px-4 py-2 text-sm bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700"
                >
                  Save Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!leadToDelete}
        title="Delete Distributor Lead"
        description="Do you really want to delete this lead record from CRM?"
        itemName={leadToDelete ? `${leadToDelete.companyName} (${leadToDelete.contactPerson})` : undefined}
        confirmLabel="Yes, Delete Lead"
        onConfirm={handleDeleteLead}
        onCancel={() => setLeadToDelete(null)}
      />
    </div>
  )
}
