'use server'
import axios from 'axios'
import { api } from '../api'

export async function deleteRoom(id: number, token: string) {
  try {
    const response = await api.get(`room/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message }
    }
  }
}
