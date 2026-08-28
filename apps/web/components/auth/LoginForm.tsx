'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, Droplets, Factory, BarChart3, ShieldCheck, Users, RotateCw, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  captchaInput: z.string().min(1, 'CAPTCHA verification code is required'),
  rememberMe: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

const features = [
  { icon: Factory, label: 'Manufacturing', sub: 'Excellence' },
  { icon: BarChart3, label: 'Real-time', sub: 'Analytics' },
  { icon: ShieldCheck, label: 'Secure &', sub: 'Reliable' },
  { icon: Users, label: 'Role-based', sub: 'Access' },
]

export default function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  
  // CAPTCHA Challenge State
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaError, setCaptchaError] = useState<string | null>(null)

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
    setCaptchaError(null)
  }, [])

  useEffect(() => {
    generateCaptcha()
  }, [generateCaptcha])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false, captchaInput: '' },
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleGoogleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (clientId) {
      const redirectUri = window.location.origin + '/login'
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=email%20profile`
      window.location.href = googleAuthUrl
    } else {
      // Perform seamless Google Account demo sign-in
      clearError()
      const success = await login('admin@oilerp.com', 'Admin@123', true)
      if (success) {
        router.replace('/dashboard')
      }
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    setCaptchaError(null)

    // Verify CAPTCHA
    if (data.captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError('Incorrect CAPTCHA code. Please re-enter the characters shown.')
      generateCaptcha()
      setValue('captchaInput', '')
      return
    }

    const success = await login(data.email, data.password, data.rememberMe)
    if (success) {
      router.replace('/dashboard')
    } else {
      generateCaptcha()
      setValue('captchaInput', '')
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050c1a 0%, #0a1628 40%, #0f1f3d 100%)',
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/oil-refinery-bg.jpg')" }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,12,26,0.5) 0%, rgba(5,12,26,0.2) 50%, rgba(5,12,26,0.85) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-xl">OIL</span>
                <span style={{ color: '#f59e0b' }} className="font-bold text-xl">
                  ERP
                </span>
              </div>
              <p className="text-xs" style={{ color: '#64748b' }}>
                Edible Oil Enterprise System
              </p>
            </div>
          </div>

          {/* Hero text */}
          <div>
            <p className="text-slate-400 text-base mb-3">Welcome to</p>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              <span style={{ color: '#f59e0b' }}>Oil Enterprise</span>
              <br />
              <span className="text-white">Management Portal</span>
            </h1>
            {/* Accent line */}
            <div className="w-14 h-1 rounded-full mb-6" style={{ background: '#f59e0b' }} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Refinery telemetry, FSSAI quality verification, distributor sales, and secure role-based access control.
            </p>
          </div>
        </div>

        {/* Feature badges */}
        <div className="relative z-10">
          <div className="grid grid-cols-4 gap-3">
            {features.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon className="w-6 h-6" style={{ color: '#f59e0b' }} />
                <div>
                  <p className="text-white text-xs font-medium leading-tight">{label}</p>
                  <p className="text-slate-400 text-xs leading-tight">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 text-xs mt-6">
            © 2026 Apex Edible Oils ERP System. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900">
              OIL <span style={{ color: '#f59e0b' }}>ERP</span>
            </span>
          </div>

          {/* Language selector */}
          <div className="flex justify-end mb-6">
            <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <span>🌐</span>
              <span>English</span>
              <span>▾</span>
            </button>
          </div>

          {/* Form header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-900">Login</h2>
            </div>
            <p className="text-slate-500 text-sm">Sign in with CAPTCHA verification to access portal</p>
          </div>

          {/* Error alert */}
          {(error || captchaError) && (
            <div
              className="mb-5 px-4 py-3 rounded-lg text-sm border font-semibold"
              style={{
                background: '#fef2f2',
                borderColor: '#fecaca',
                color: '#dc2626',
              }}
            >
              {captchaError || error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@oilerp.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all outline-none',
                    'text-slate-900 placeholder-slate-400',
                    errors.email
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:bg-white',
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-11 py-2.5 rounded-lg border text-sm transition-all outline-none',
                    'text-slate-900 placeholder-slate-400',
                    errors.password
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:bg-white',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* CAPTCHA Verification Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" /> Security CAPTCHA Verification
              </label>
              <div className="flex items-center gap-3">
                {/* Visual CAPTCHA Badge */}
                <div
                  className="px-4 py-2 rounded-lg font-mono font-extrabold text-lg tracking-widest select-none shadow-inner border flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: '#f59e0b',
                    letterSpacing: '0.25em',
                    textShadow: '0 0 8px rgba(245,158,11,0.5)',
                  }}
                >
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                  title="Refresh CAPTCHA Code"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
              <input
                {...register('captchaInput')}
                type="text"
                placeholder="Enter 6-character CAPTCHA"
                className={cn(
                  'w-full px-3 py-2 rounded-lg border text-sm uppercase font-mono tracking-wider outline-none',
                  errors.captchaInput ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                )}
              />
              {errors.captchaInput && (
                <p className="text-xs text-red-600">{errors.captchaInput.message}</p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white transition-all shadow-md',
                'flex items-center justify-center gap-2',
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-95 active:scale-[0.99]'
              )}
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying & Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to ERP Portal
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400 uppercase font-semibold">or</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
