'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  description: string
  itemName?: string
  confirmLabel?: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  itemName,
  confirmLabel = 'Yes, Delete',
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Focus cancel button by default for safety
      setTimeout(() => cancelBtnRef.current?.focus(), 50)
      // Close on Escape
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#fff', animation: 'modal-pop 0.18s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #fee2e2, #fca5a5)' }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h2
                id="confirm-delete-title"
                className="text-lg font-bold"
                style={{ color: '#111827' }}
              >
                {title}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f3f4f6', margin: '0 24px' }} />

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
            {description}
          </p>
          {itemName && (
            <div
              className="mt-3 px-4 py-3 rounded-xl flex items-center gap-2"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <Trash2 className="w-4 h-4 flex-shrink-0" style={{ color: '#dc2626' }} />
              <span className="text-sm font-semibold truncate" style={{ color: '#991b1b' }}>
                {itemName}
              </span>
            </div>
          )}
          <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
            Are you absolutely sure you want to proceed?
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 px-6 pb-6"
        >
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all border"
            style={{
              color: '#374151',
              borderColor: '#e5e7eb',
              background: '#f9fafb',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all"
            style={{
              background: isDeleting
                ? '#fca5a5'
                : 'linear-gradient(135deg, #dc2626, #b91c1c)',
              opacity: isDeleting ? 0.8 : 1,
            }}
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modal-pop {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
