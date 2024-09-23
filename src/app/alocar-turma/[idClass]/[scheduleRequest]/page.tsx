import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'
import { AllocateClasse } from './components/allocate-classe'

export default async function AlocarTurmas() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/')

  return <AllocateClasse session={session} />
}
