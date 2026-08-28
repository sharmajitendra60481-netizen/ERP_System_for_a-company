'use client'

import { useState } from 'react'
import { FileText, Plus, ShieldCheck, Download, Calendar, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface DocumentItem {
  id: string
  title: string
  category: 'FSSAI_LICENSE' | 'AGMARK_CERTIFICATE' | 'ISO_AUDIT' | 'TAX_GST'
  docNumber: string
  validUntil: string
  status: 'ACTIVE' | 'RENEWAL_REQUIRED'
}

export default function DocumentsPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [docs, setDocs] = useState<DocumentItem[]>([
    { id: 'DOC-101', title: 'FSSAI Central Edible Oil Manufacturing License', category: 'FSSAI_LICENSE', docNumber: 'LIC-10019022000456', validUntil: '2028-12-31', status: 'ACTIVE' },
    { id: 'DOC-102', title: 'AGMARK Grade A Quality Certification (Mustard & Soyabean)', category: 'AGMARK_CERTIFICATE', docNumber: 'AGM-2025-GUJ-88', validUntil: '2027-06-30', status: 'ACTIVE' },
    { id: 'DOC-103', title: 'ISO 22000 Food Safety Audit Report', category: 'ISO_AUDIT', docNumber: 'ISO-22000-2024-R2', validUntil: '2026-09-15', status: 'RENEWAL_REQUIRED' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null)
  const [newDoc, setNewDoc] = useState<Omit<DocumentItem, 'id'>>({
    title: '',
    category: 'FSSAI_LICENSE',
    docNumber: 'LIC-2026-X',
    validUntil: '2028-08-20',
    status: 'ACTIVE',
  })

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault()
    const item: DocumentItem = {
      id: `DOC-${100 + docs.length + 1}`,
      ...newDoc,
    }
    setDocs([...docs, item])
    setShowAddModal(false)
  }

  const handleDeleteDoc = () => {
    if (!docToDelete) return
    setDocs(docs.filter((d) => d.id !== docToDelete.id))
    setDocToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Sapphire FSSAI Document Vault
          </span>
          <h1 className="text-2xl font-bold mt-1">FSSAI License Vault & Compliance Certificates</h1>
          <p className="text-blue-100 text-sm mt-1">
            Central repository for FSSAI licenses, Agmark certificates, ISO 22000 food safety audits, and GST tax filings.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${doc.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {doc.status}
                </span>
                {isSuperAdmin && (
                  <button onClick={() => setDocToDelete(doc)} className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-blue-600 font-semibold">{doc.id}</span>
              <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">{doc.title}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Doc #: {doc.docNumber}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Valid Until: {doc.validUntil}</span>
              <button onClick={() => alert(`Downloading ${doc.title}`)} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Upload Compliance Document</h2>
            <form onSubmit={handleAddDoc} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Document Title</label>
                <input required placeholder="e.g. FSSAI Annual Inspection Report" value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Registration / License Number</label>
                <input required value={newDoc.docNumber} onChange={(e) => setNewDoc({ ...newDoc, docNumber: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Category</label>
                  <select value={newDoc.category} onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="FSSAI_LICENSE">FSSAI LICENSE</option>
                    <option value="AGMARK_CERTIFICATE">AGMARK</option>
                    <option value="ISO_AUDIT">ISO AUDIT</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Valid Until</label>
                  <input type="date" required value={newDoc.validUntil} onChange={(e) => setNewDoc({ ...newDoc, validUntil: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!docToDelete}
        title="Delete Compliance Document"
        description="Do you really want to delete this document from the vault?"
        itemName={docToDelete ? `${docToDelete.title} (${docToDelete.id})` : undefined}
        confirmLabel="Yes, Delete Document"
        onConfirm={handleDeleteDoc}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  )
}
