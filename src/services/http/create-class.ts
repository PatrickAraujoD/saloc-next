'use server'
import { api } from '../api'

type Props = {
  data: FormData
  token?: string
}

export async function createClass({ data, token }: Props) {
  const response = await api.post('/class/register', data, {
    headers: { Authorization: 'Bearer ' + token },
  })
  return response.data.message
}
