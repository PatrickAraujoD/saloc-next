'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

type Props = {
  idClass: string | string[]
  idPeriod: number
  token?: string
}

export async function allocateRooms({ idClass, idPeriod, token }: Props) {
  try {
    const response = await api.get(
      `/room/allocate_rooms/${Number(idClass)}/${idPeriod}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.message || 'Falha ao alocar sala'
      return { error: errorMessage }
    }
  }
}
