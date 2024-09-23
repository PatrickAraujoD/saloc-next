import { api } from '../api'

export async function getSectores(token: string) {
  try {
    const response = await api.get(`/sector/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
