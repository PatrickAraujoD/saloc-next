import { Main } from '@/components/main'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(nextAuthConfig)

  if (!session) return redirect('/login')

  return <Main />
}
