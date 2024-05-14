import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { LoginForm } from './components/login-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/lib/auth'

export default async function Login() {
  const session = await getServerSession(nextAuthConfig)
  if (session) {
    return redirect('/')
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <LoginForm />
      <Footer />
    </div>
  )
}
