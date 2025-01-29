'use server'
import { api } from '../api'

type Props = {
  valueCourse: string | null
  period: string | null
  token?: string
}

export async function getClassesWithAndWithoutRooms({
  valueCourse,
  period,
  token,
}: Props) {
  const classes = await api.post(
    '/class/list/with_and_without_rooms',
    {
      valueCourse,
      period,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return classes.data
}
