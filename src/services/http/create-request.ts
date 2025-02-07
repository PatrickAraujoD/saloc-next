'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

type CreateRequest = {
  destination: number
  schedule: string
  origin?: number
  idClass?: number
  token?: string
}

export async function createRequest({
  destination,
  schedule,
  origin,
  idClass,
  token,
}: CreateRequest) {
  try {
    const response = await api.post(
      '/request/create',
      {
        destination,
        schedule,
        origin,
        idClass,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      },
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.error ||
        'Falha ao tentar registrar a solicitação'
      return { error: errorMessage }
    }
  }
}
