'use server'
import { api } from '../api'

type Props = {
  nameCourse: string
  token?: string
}

export async function createCourse({ nameCourse, token }: Props) {
  await api.post(
    '/course/register',
    {
      nameCourse,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
