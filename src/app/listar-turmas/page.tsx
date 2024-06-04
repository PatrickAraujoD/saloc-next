import { TableInfo } from './components/table-info'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ListarTurmas() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/login')

  return <TableInfo />
}
