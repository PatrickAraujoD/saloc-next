'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

interface Body {
  name: string
  email: string
  password: string
  sectorId: number
}

export async function createUser(token: string, body: Body) {
  try {
    const response = await api.post('/user/register', body, {
      headers: { Authorization: 'Bearer ' + token },
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.message || 'Ocorreu um erro desconhecido'
      console.log(errorMessage)
      return { error: errorMessage }
    }
  }
}
