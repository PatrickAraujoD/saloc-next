'use server'
import { api } from '../api'

export async function getClass(
  idClass: number,
  token: string,
  schedule: string,
) {
  try {
    const response = await api.get(`class/${idClass}/${schedule}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
