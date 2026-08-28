'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Shield, Database, Mail, Building, Key, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Apex Edible Oils & Foods Pvt Ltd',
    fssaiLicense: '10019022000456',
    gstin: '24AAAAA0000A1Z5',
    gstRatePct: 5,

    // Custom Portal Email Sender Configuration
    senderName: 'Apex Edible Oils ERP System',
    senderEmail: 'admin@oilerp.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpUser: 'admin@oilerp.com',
    smtpPass: '',

    emailAlerts: true,
    autoBackupDaily: true,
  })

  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('portal_sender_email')
      const savedName = localStorage.getItem('portal_sender_name')
      if (savedEmail || savedName) {
        setSettings((prev) => ({
          ...prev,
          senderEmail: savedEmail || prev.senderEmail,
          senderName: savedName || prev.senderName,
        }))
      }
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal_sender_email', settings.senderEmail)
      localStorage.setItem('portal_sender_name', settings.senderName)
    }
    setSavedMessage(`Portal Email Identity saved! All notifications will now be sent from "${settings.senderName} <${settings.senderEmail}>"`)
    setTimeout(() => setSavedMessage(''), 5000)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #3f3f46 0%, #71717a 100%)' }}
      >
        <div>
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Zinc System Settings Portal
          </span>
          <h1 className="text-2xl font-bold mt-1">Company ERP Configuration & Custom Email Sender</h1>
          <p className="text-zinc-200 text-sm mt-1">
            Configure your custom email address to send ERP notification emails to team members and distributors.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Custom Email Identity Section */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-zinc-600" /> Option A: Custom Portal Sender Email Configuration
          </h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed font-medium">
            💡 <strong>Option A Active:</strong> Type your existing email address below (e.g. <code>yourname@gmail.com</code> or <code>sales@yourcompany.com</code>). Every email notification dispatched by this system will use your specified email as the sender!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Official Sender Name</label>
              <input
                required
                placeholder="e.g. Apex Edible Oils ERP"
                value={settings.senderName}
                onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Your Existing Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com or sales@oilerp.com"
                value={settings.senderEmail}
                onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-blue-300 bg-blue-50/50 rounded-lg text-sm font-bold text-blue-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">SMTP Host Server (Optional)</label>
              <input
                placeholder="e.g. smtp.gmail.com"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono text-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">SMTP Password / App Password (Optional)</label>
              <input
                type="password"
                placeholder="App Password for Gmail / Mail server"
                value={settings.smtpPass}
                onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Company & FSSAI Identification */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
            <Building className="w-5 h-5 text-zinc-600" /> Company & FSSAI Identification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Company Name</label>
              <input required value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">FSSAI Central License Number</label>
              <input required value={settings.fssaiLicense} onChange={(e) => setSettings({ ...settings, fssaiLicense: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">GSTIN Registration</label>
              <input required value={settings.gstin} onChange={(e) => setSettings({ ...settings, gstin: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Edible Oil GST Rate (%)</label>
              <input type="number" required value={settings.gstRatePct} onChange={(e) => setSettings({ ...settings, gstRatePct: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h2 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-600" /> Database & System Preferences
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.emailAlerts} onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })} className="w-4 h-4 rounded text-zinc-700" />
              <span className="text-sm text-slate-700 font-medium">Enable real-time email alerts for Tank Overflows & Low Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.autoBackupDaily} onChange={(e) => setSettings({ ...settings, autoBackupDaily: e.target.checked })} className="w-4 h-4 rounded text-zinc-700" />
              <span className="text-sm text-slate-700 font-medium">Enable daily automatic Supabase database snapshot backups</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button type="submit" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md">
            <Save className="w-4 h-4" /> Save System Settings (Option A)
          </button>
        </div>
      </form>
    </div>
  )
}
