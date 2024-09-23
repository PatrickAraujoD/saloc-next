import { Main } from '@/components/main'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(nextAuthConfig)

  return <Main session={session} />
}
