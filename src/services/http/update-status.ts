'use server'
import { api } from '../api'

type UpdateStatusProps = {
  idRequest: number
  token?: string
}

export async function updateStatus({ idRequest, token }: UpdateStatusProps) {
  await api.post(
    '/request/update_status',
    {
      id: idRequest,
      status: 'aceita',
    },
    { headers: { Authorization: 'Bearer ' + token } },
  )
}
