'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

type Props = {
  nameCourse: string
  token?: string
}

export async function createCourse({ nameCourse, token }: Props) {
  try {
    const response = await api.post(
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
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.message || 'Falha ao tentar registrar o curso'
      return { error: errorMessage }
    }
  }
}
