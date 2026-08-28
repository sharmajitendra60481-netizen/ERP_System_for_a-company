'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, FlaskConical, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { apiFetch } from '@/lib/api'

interface LabTest {
  id: string
  batchNo: string
  oilType: string
  ffaPercentage: number // Free Fatty Acid (<0.10% passing)
  peroxideValue: number // (<2.0 meq/kg)
  moisturePct: number   // (<0.05%)
  status: 'PASSED' | 'PENDING' | 'REJECTED'
  testedBy: string
  timestamp: string
}

export default function QualityPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [tests, setTests] = useState<LabTest[]>([])

  const [showAddModal, setShowAddModal] = useState(false)
  const [testToDelete, setTestToDelete] = useState<LabTest | null>(null)
  const [newTest, setNewTest] = useState<Omit<LabTest, 'id' | 'timestamp'>>({
    batchNo: 'BATCH-2026-0004',
    oilType: 'Refined Sunflower Oil',
    ffaPercentage: 0.06,
    peroxideValue: 0.9,
    moisturePct: 0.02,
    status: 'PASSED',
    testedBy: currentUser?.name || 'QC Analyst',
  })

  const mapInspection = (item: any): LabTest => ({
    id: item.inspectionNo, batchNo: item.batchReference, oilType: item.productName,
    ffaPercentage: item.ffaPercentage, peroxideValue: item.peroxideValue, moisturePct: item.moisturePct,
    status: item.status, testedBy: 'Quality Control', timestamp: item.createdAt,
  })

  useEffect(() => {
    apiFetch<any[]>('/quality/inspections').then((items) => setTests(items.map(mapInspection))).catch(() => setTests([]))
  }, [])

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const inspection = await apiFetch<any>('/quality/inspections', {
        method: 'POST', body: JSON.stringify({ batchReference: newTest.batchNo, productName: newTest.oilType,
          ffaPercentage: newTest.ffaPercentage, peroxideValue: newTest.peroxideValue, moisturePct: newTest.moisturePct }),
      })
      setTests([mapInspection(inspection), ...tests])
      setShowAddModal(false)
    } catch (error: any) { alert(error.message || 'Unable to save quality inspection') }
  }

  const handleDeleteTest = () => {
    if (!testToDelete) return
    setTests(tests.filter((t) => t.id !== testToDelete.id))
    setTestToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #65a30d 0%, #84cc16 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Lime Green FSSAI Quality Lab
          </span>
          <h1 className="text-2xl font-bold mt-1">FSSAI Quality Assurance & Lab Testing</h1>
          <p className="text-lime-100 text-sm mt-1">
            Free Fatty Acid (FFA), Peroxide Value (PV), Moisture %, and Agmark compliance verification.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-lime-900 hover:bg-lime-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Log QC Sample
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-lime-50 text-lime-600 rounded-xl"><FlaskConical className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Lab Samples</p>
            <p className="text-2xl font-bold text-slate-900">{tests.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">FSSAI Passed</p>
            <p className="text-2xl font-bold text-slate-900">{tests.filter((t) => t.status === 'PASSED').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rejected Batches</p>
            <p className="text-2xl font-bold text-slate-900">{tests.filter((t) => t.status === 'REJECTED').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Compliance Rate</p>
            <p className="text-2xl font-bold text-slate-900">
              {Math.round((tests.filter((t) => t.status === 'PASSED').length / (tests.length || 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* QC Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-lime-600" /> FSSAI Edible Oil Sample Verification Logs
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-3">Sample ID</th>
              <th className="px-6 py-3">Batch / Tank Ref</th>
              <th className="px-6 py-3">Oil Type</th>
              <th className="px-6 py-3">FFA % (Limit &lt;0.10%)</th>
              <th className="px-6 py-3">PV (Limit &lt;2.0)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {tests.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-lime-700">{t.id}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{t.batchNo}</td>
                <td className="px-6 py-4 text-slate-700">{t.oilType}</td>
                <td className="px-6 py-4 font-mono font-semibold text-slate-800">{t.ffaPercentage}%</td>
                <td className="px-6 py-4 font-mono font-semibold text-slate-800">{t.peroxideValue} meq/kg</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${t.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {isSuperAdmin && (
                    <button onClick={() => setTestToDelete(t)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
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
            <h2 className="text-xl font-bold text-slate-900">Log FSSAI Quality Control Test</h2>
            <form onSubmit={handleAddTest} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Batch / Tank Reference</label>
                <input required value={newTest.batchNo} onChange={(e) => setNewTest({ ...newTest, batchNo: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Oil Type Description</label>
                <input required value={newTest.oilType} onChange={(e) => setNewTest({ ...newTest, oilType: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">FFA % (&lt;0.10%)</label>
                  <input type="number" step="0.01" required value={newTest.ffaPercentage} onChange={(e) => setNewTest({ ...newTest, ffaPercentage: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">PV (&lt;2.0 meq/kg)</label>
                  <input type="number" step="0.1" required value={newTest.peroxideValue} onChange={(e) => setNewTest({ ...newTest, peroxideValue: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">FSSAI Status</label>
                <select value={newTest.status} onChange={(e) => setNewTest({ ...newTest, status: e.target.value as any })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
                  <option value="PASSED">PASSED FSSAI COMPLIANCE</option>
                  <option value="REJECTED">REJECTED / OUT OF SPEC</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700">Save QC Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDeleteModal
        isOpen={!!testToDelete}
        title="Delete Quality Sample Record"
        description="Do you really want to delete this lab quality record?"
        itemName={testToDelete ? `${testToDelete.id} (${testToDelete.batchNo})` : undefined}
        confirmLabel="Yes, Delete Sample"
        onConfirm={handleDeleteTest}
        onCancel={() => setTestToDelete(null)}
      />
    </div>
  )
}
