import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { nextAuthConfig } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { RegisterForm } from './components/register-form'

export default async function Register() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/login')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <RegisterForm />
      <Footer />
    </div>
  )
}
