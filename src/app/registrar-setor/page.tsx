import { getServerSession } from 'next-auth'
import { RegisterCourseForm } from './components/register-setor-form'
import { nextAuthConfig } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function registerCourse() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/home')

  if (session && !session.user.isAdmin) redirect('/home')

  return <RegisterCourseForm session={session} />
}
