'use server'
import { api } from '../api'

interface Body {
  name: string
  email: string
  password: string
  sectorId: number
}

export async function createUser(token: string, body: Body) {
  const response = await api.post('/user/register', body, {
    headers: { Authorization: 'Bearer ' + token },
  })

  return response.data
}
