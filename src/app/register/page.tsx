import { nextAuthConfig } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { RegisterForm } from './components/register-form'

export default async function Register() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/')

  if (session && !session.user.isAdmin) redirect('/')

  return <RegisterForm session={session} />
}
