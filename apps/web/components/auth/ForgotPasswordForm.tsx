'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, Droplets, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f8fafc, #eff6ff)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-slate-900 font-bold text-xl">OIL</span>
            <span style={{ color: '#f59e0b' }} className="font-bold text-xl">ERP</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#d1fae5' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                We&apos;ve sent a password reset link to<br />
                <span className="font-medium text-slate-700">{getValues('email')}</span>
              </p>
              <Link href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#2563eb' }}>
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Forgot password?</h2>
                <p className="text-sm text-slate-500">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register('email')}
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all outline-none',
                        'text-slate-900 placeholder-slate-400',
                        errors.email
                          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white',
                      )}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <button
                  id="send-reset-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : 'Send Reset Link'}
                </button>

                <Link href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
