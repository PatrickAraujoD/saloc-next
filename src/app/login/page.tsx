'use client'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { LoginForm } from './components/login-form'

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <LoginForm />
      <Footer />
    </div>
  )
}
