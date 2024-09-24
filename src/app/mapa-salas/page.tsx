import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CheckRooms } from './components/check-rooms'

export default async function MapaSalas() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/home')

  return <CheckRooms session={session} />
}
