import { Main } from '@/components/main'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'
import { getCourses, listPeriod, listTeacher } from '@/services/http'

export default async function Home() {
  const session = await getServerSession(nextAuthConfig)

  const periods = await listPeriod()
  let courses = []
  let teachers = []
  if (!session || !session.user.sector?.course) {
    ;[courses, teachers] = await Promise.all([getCourses(), listTeacher()])
  }

  return (
    <Main
      session={session}
      periods={periods}
      courses={courses}
      teachers={teachers}
    />
  )
}
