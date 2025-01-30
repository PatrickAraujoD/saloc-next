'use server'
import { api } from '../api'

type Props = {
  roomId: number
  periodId: number
  token?: string
}

export async function getRoomAllocateClass({ roomId, periodId, token }: Props) {
  const response = await api.get(
    `/room/allocate_classes/${roomId}/${periodId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}
