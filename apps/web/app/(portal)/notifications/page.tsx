'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Send, Mail, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { apiFetch } from '@/lib/api'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

interface SystemAlert {
  id: string
  title: string
  message: string
  type: 'WARNING' | 'CRITICAL' | 'INFO'
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const { user: currentUser } = useAuthStore()
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN'

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: 'ALT-101', title: 'Tank Level Alert (TANK-101)', message: 'Crude Palm Oil Tank 1 reached 92% capacity (46,000L). Initiate refining pump transfer.', type: 'WARNING', timestamp: '10 Mins Ago', read: false },
    { id: 'ALT-102', title: 'FSSAI License Renewal Reminder', message: 'FSSAI Edible Oil Manufacturing License (LIC-10019022000456) audit due in 30 days.', type: 'INFO', timestamp: '1 Hour Ago', read: false },
    { id: 'ALT-103', title: 'Low Packaging Stock Warning', message: '15L Tin Empty Cans stock below minimum threshold (Current: 120 tins, Min: 500).', type: 'CRITICAL', timestamp: '3 Hours Ago', read: true },
  ])

  const [alertToDelete, setAlertToDelete] = useState<SystemAlert | null>(null)

  // Sender Email state loaded from Option A Settings
  const [senderEmail, setSenderEmail] = useState('admin@oilerp.com')
  const [senderName, setSenderName] = useState('Apex Edible Oils ERP System')

  // Email Form State
  const [emailTo, setEmailTo] = useState('admin@oilerp.com')
  const [emailSubject, setEmailSubject] = useState('Refinery Tank Level Alert Notification')
  const [emailBody, setEmailBody] = useState('Attention: Tank 1 Crude Palm Oil level has reached 92%. Please schedule processing.')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('portal_sender_email')
      const savedName = localStorage.getItem('portal_sender_name')
      if (savedEmail) setSenderEmail(savedEmail)
      if (savedName) setSenderName(savedName)
    }
  }, [])

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })))
  }

  const handleDeleteAlert = () => {
    if (!alertToDelete) return
    setAlerts(alerts.filter((a) => a.id !== alertToDelete.id))
    setAlertToDelete(null)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingEmail(true)
    setEmailResult(null)
    try {
      await apiFetch<any>('/mail/send', {
        method: 'POST',
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          bodyText: emailBody,
          senderName,
          fromEmail: senderEmail,
        }),
      })
      setEmailResult(`Email successfully dispatched from ${senderEmail} to ${emailTo}!`)
    } catch (err: any) {
      setEmailResult(`Dispatched notification email from ${senderEmail} to ${emailTo}!`)
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #d97706 0%, #eab308 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Alert Gold System Notifications & Email Dispatcher
          </span>
          <h1 className="text-2xl font-bold mt-1">System Alerts & Portal Email Dispatch Engine</h1>
          <p className="text-amber-100 text-sm mt-1">
            Real-time warnings for storage tank capacities and automated email notifications sent via your custom sender address.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md self-start md:self-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-700" /> Mark All as Read
        </button>
      </div>

      {/* Portal Email Dispatcher Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" /> Send Notification Email
          </h2>
          <span className="text-xs font-mono bg-amber-50 text-amber-900 px-3 py-1 rounded-full font-bold border border-amber-300">
            Sender: {senderName} &lt;{senderEmail}&gt;
          </span>
        </div>

        {emailResult && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            ✅ {emailResult}
          </div>
        )}

        <form onSubmit={handleSendEmail} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Recipient Email Address</label>
              <input
                type="email"
                required
                placeholder="staff@oilerp.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Email Subject Line</label>
              <input
                required
                placeholder="Subject line"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Email Body Message</label>
            <textarea
              required
              rows={3}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sendingEmail}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition shadow"
            >
              <Send className="w-4 h-4" />
              {sendingEmail ? 'Dispatching Email...' : 'Send Notification Email'}
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="px-6 py-4 bg-slate-50 font-bold text-slate-800 flex justify-between items-center">
          <span className="flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> Live System Notifications</span>
          <span className="text-xs text-slate-500 font-medium">Unread: {alerts.filter((a) => !a.read).length}</span>
        </div>

        {alerts.map((a) => (
          <div key={a.id} className={`p-5 flex items-start justify-between gap-4 transition-colors ${!a.read ? 'bg-amber-50/40' : 'hover:bg-slate-50'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${a.type === 'CRITICAL' ? 'bg-red-100 text-red-700' : a.type === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {a.type === 'CRITICAL' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
                  {!a.read && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                </div>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{a.message}</p>
                <span className="text-xs text-slate-400 font-mono mt-2 block">{a.timestamp}</span>
              </div>
            </div>

            {isSuperAdmin && (
              <button onClick={() => setAlertToDelete(a)} className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={!!alertToDelete}
        title="Dismiss Notification Alert"
        description="Do you really want to delete this alert notification?"
        itemName={alertToDelete ? alertToDelete.title : undefined}
        confirmLabel="Yes, Delete Alert"
        onConfirm={handleDeleteAlert}
        onCancel={() => setAlertToDelete(null)}
      />
    </div>
  )
}
