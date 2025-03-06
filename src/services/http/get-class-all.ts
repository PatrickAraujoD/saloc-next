'use server'
import { api } from '../api'

export async function getClassAll(data: any) {
  const response = await api.post('/class/list', data)
  return response.data
}
