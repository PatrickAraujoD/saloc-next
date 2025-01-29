'use server'
import { api } from '../api'

type Props = {
  idClass?: number | null
  schedule?: string
  token?: string
}

export async function getScheduleRequestByIdClass({
  idClass,
  schedule,
  token,
}: Props) {
  const response = await api.post(
    `/schedule/list/request/${idClass}`,
    {
      schedule,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}
