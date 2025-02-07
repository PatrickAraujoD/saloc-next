'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

export async function deleteAlocacao(id: number, token: string) {
  try {
    const response = await api.post(
      `/room/allocate/delete`,
      {
        id,
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
        error?.response?.data?.error || 'Ocorreu um erro desconhecido'
      return { error: errorMessage }
    }
  }
}
