'use server'
import { api } from '../api'

type RequestAcceptAllProps = {
  token?: string
  requests: number[]
}

export async function requestAcceptAll({
  token,
  requests,
}: RequestAcceptAllProps) {
  try {
    const response = await api.post(
      '/request/accept_all',
      {
        requests,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      },
    )
    return response.data
  } catch (error) {
    return { error: 'Ocorreu algum erro no momento de aceitar as solicitações' }
  }
}
