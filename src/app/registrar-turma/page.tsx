import { nextAuthConfig } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FormRegisterClass } from './components/form-register-class'
import { redirect } from 'next/navigation'

export default async function RegistrarTurma() {
  const session = await getServerSession(nextAuthConfig)

  if (!session || !session.user.sector.course) redirect('/')

  return <FormRegisterClass session={session} />
}
