'use server'
import { api } from '../api'

type Props = {
  idClass: string | string[]
  idPeriod: number
  token?: string
}

export async function allocateRooms({ idClass, idPeriod, token }: Props) {
  const response = await api.get(
    `/room/allocate_rooms/${Number(idClass)}/${idPeriod}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return response.data
}
