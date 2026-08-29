'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { Camera, Save, Lock, Mail, User, Building, Briefcase, Calendar, LogOut, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatar, setAvatar] = useState<string>('')
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Generate avatar from user initials
    const initials = `${formData.firstName[0] || 'U'}${formData.lastName[0] || 'U'}`
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F']
    const colorIndex = user.id.charCodeAt(0) % colors.length
    const bgColor = colors[colorIndex]
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=200&bold=true`
    setAvatar(avatarUrl)

    // Fetch audit logs
    fetchAuditLogs()
  }, [user, router, formData.firstName, formData.lastName])

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/audit')
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.slice(0, 10)) // Last 10 logs
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
        // Refresh auth state
        if (user) {
          useAuthStore.setState({
            user: {
              ...user,
              name: `${formData.firstName} ${formData.lastName}`,
            },
          })
        }
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setIsChangingPassword(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  const roleLabels = {
    SUPER_ADMIN: 'Super Administrator',
    FINANCE_MANAGER: 'Finance Manager',
    PRODUCTION_MANAGER: 'Production Manager',
    WAREHOUSE_OPERATOR: 'Warehouse Operator',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 md:px-8 pt-8 pb-6 flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                <Image
                  src={avatar}
                  alt={user.name || 'User'}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <button className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {user.name || 'User'}
              </h1>
              <p className="text-amber-600 font-semibold text-lg mt-1">
                {roleLabels[user.role as keyof typeof roleLabels] || user.role}
              </p>
              <p className="text-slate-600 text-sm mt-2">{user.email}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="px-6 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div
              className={`mx-6 mb-6 p-4 rounded-lg flex gap-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="border-t border-slate-200 px-6 md:px-8 py-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {isChangingPassword && (
            <div className="border-t border-slate-200 px-6 md:px-8 py-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* Account Details */}
          <div className="border-t border-slate-200 px-6 md:px-8 py-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Email Address</p>
                  <p className="text-slate-900 font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Briefcase className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Role</p>
                  <p className="text-slate-900 font-medium">
                    {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Building className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Company</p>
                  <p className="text-slate-900 font-medium">{user.companyName || 'Apex Edible Oils & Foods Pvt Ltd'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Member Since</p>
                  <p className="text-slate-900 font-medium">August 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {auditLogs.length > 0 && (
            <div className="border-t border-slate-200 px-6 md:px-8 py-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">{log.action || 'System Activity'}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(log.createdAt || new Date()).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
