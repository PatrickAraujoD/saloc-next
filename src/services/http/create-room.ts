'use server'
import { AxiosError } from 'axios'
import { api } from '../api'
import { Room } from '@/types'

type Props = {
  number: string
  capacity: number
  block: string
  floor: string
  building: string
  token?: string
}

export async function createRoom({
  number,
  capacity,
  block,
  floor,
  building,
  token,
}: Props): Promise<any> {
  try {
    const response = await api.post(
      '/room/register',
      {
        number,
        capacity,
        block,
        floor,
        building,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data.room as Room
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.error ||
        'Falha ao tentar registrar a solicitação'
      return { error: errorMessage }
    }
  }
}
