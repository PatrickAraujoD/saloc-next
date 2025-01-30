'use server'
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
}: Props) {
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
}
