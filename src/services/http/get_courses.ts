import { api } from '../api'

export async function getCourses() {
  try {
    const response = await api.get(`/course/list`)
    return response.data
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}
