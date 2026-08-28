import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — OilERP',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {children}
    </div>
  )
}
