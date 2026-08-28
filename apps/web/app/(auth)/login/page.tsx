import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login — OilERP Enterprise Management System',
  description: 'Sign in to OilERP to manage your industrial operations.',
}

export default function LoginPage() {
  return <LoginForm />
}
