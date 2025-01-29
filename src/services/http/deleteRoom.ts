'use server'
import { api } from '../api'

export async function deleteRoom(id: number, token: string) {
  return api
    .get(`room/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => response.data)
}
