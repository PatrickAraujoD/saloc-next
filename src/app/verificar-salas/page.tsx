import { getServerSession } from 'next-auth'
import { TableInfoRooms } from './components/table-info-rooms'
import { nextAuthConfig } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function VerifyRooms() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) {
    return redirect('/')
  }

  return (
    <main className="flex-grow px-20 py-10">
      <h1 className="uppercase font-bold text-xl">adicionar sala</h1>
      <TableInfoRooms session={session} />
    </main>
  )
}
