'use server'
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
}
