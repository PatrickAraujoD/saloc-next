'use server'
import { api } from '../api'

export async function listDiscipline(id: number) {
  try {
    const response = await api.get(`/discipline/list/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
