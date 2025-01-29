'use server'
import { api } from '../api'

export async function deleteAlocacao(id: number, token: string) {
  return api
    .post(
      `/room/allocate/delete`,
      {
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => response.data)
}
