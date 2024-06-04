import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TableInfo } from './components/table-info'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ListarTurmas() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/login')

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TableInfo />
      <Footer />
    </div>
  )
}
