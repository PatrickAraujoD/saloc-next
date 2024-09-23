import { Room } from '@/types'
import { api } from '../api'

export async function getRooms(
  token: string,
  idPeriod?: number,
  schedule?: string,
) {
  try {
    let response

    if (idPeriod && schedule) {
      response = await api.post(
        `/room/list_not_allocate/${idPeriod}`,
        {
          schedule,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
    } else {
      response = await api.get('/room/list_all', {
        headers: { Authorization: `Bearer ${token}` },
      })
    }

    console.log(response.data)

    const rooms = response.data.map((room: Room) => ({
      ...room,
      type: 'room',
    }))

    return rooms
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
}
