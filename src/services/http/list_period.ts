'use server'
import { api } from '../api'

export async function listPeriod() {
  try {
    const response = await api.get(`period/list`)
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
