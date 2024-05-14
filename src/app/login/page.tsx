import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { LoginForm } from './components/login-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '../api/auth/[...nextauth]/route'

export default async function Login() {
  const session = await getServerSession(nextAuthConfig)
  console.log(session)
  if (session) {
    console.log(session)
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
