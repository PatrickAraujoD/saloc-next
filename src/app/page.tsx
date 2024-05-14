import { Main } from '@/components/main'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from './api/auth/[...nextauth]/route'

export default async function Home() {
  const session = await getServerSession(nextAuthConfig)

  console.log(session)
  if (!session) return redirect('/login')

  return <Main />
}
