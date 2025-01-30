'use server'
import { api } from '../api'

export async function getClassAll(data: any) {
  console.log('estou aqui')
  const response = await api.post('/class/list', data)
  console.log(response)
  return response.data
}
