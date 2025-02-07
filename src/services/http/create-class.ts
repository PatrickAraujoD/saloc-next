'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

type Props = {
  data: any
  token?: string
}

export async function createClass({ data, token }: Props) {
  try {
    const response = await api.post('/class/register', data, {
      headers: { Authorization: 'Bearer ' + token },
    })
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.error || 'Não foi possível criar uma nova turma'
      return { error: errorMessage }
    }
  }
}
