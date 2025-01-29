'use client'

import { ClassroomList } from '@/components/classroom-list'
import { getClassesWithAndWithoutRooms } from '@/services/http'
import { SessionProps } from '@/types'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface TableInfo {
  session: SessionProps
}

export function TableInfo({ session }: TableInfo) {
  const router = useRouter()
  const params = useSearchParams()
  const valueCourse = params.get('curso')
  const period = params.get('periodo')
  const [list, setList] = useState({
    with_rooms: [],
    without_rooms: [],
  })
  const [loadingTable, setLoadingTable] = useState<boolean>(true)
  const token = session.token

  if (!period || !valueCourse || period === 'null' || valueCourse === 'null') {
    router.push('/')
  }

  useEffect(() => {
    async function fetchClass() {
      setLoadingTable(true)
      try {
        const classes = await getClassesWithAndWithoutRooms({
          valueCourse,
          period,
          token,
        })

        setList(classes)
      } catch (error) {
        console.error('Failed to fetch classes:', error)
      }
      setLoadingTable(false)
    }
    fetchClass()
  }, [token, period, valueCourse])

  return (
    <main className="flex-grow py-10 px-2 xl:px-16">
      <section>
        <h2 className="uppercase font-semibold mb-4">turmas sem salas</h2>
        <ClassroomList
          loadingTable={loadingTable}
          action={true}
          classList={list.without_rooms}
          session={session}
        />
      </section>
      <section>
        <h2 className="uppercase font-semibold mb-4">turmas com salas</h2>
        <ClassroomList
          loadingTable={loadingTable}
          action={true}
          classList={list.with_rooms}
          session={session}
        />
      </section>
    </main>
  )
}
