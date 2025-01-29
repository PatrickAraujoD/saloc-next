'use server'
import { api } from '../api'

export async function listTeacher() {
  try {
    const response = await api.get(`teacher/list`)
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
