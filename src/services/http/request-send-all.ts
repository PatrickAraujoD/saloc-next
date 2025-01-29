'use server'
import { api } from '../api'

type Class = {
  id: number
  schedule: string
}

type RequestSendAllProps = {
  destination: number
  classes: Class[]
  token?: string
}

export async function requestSendAll({
  destination,
  classes,
  token,
}: RequestSendAllProps) {
  await api.post(
    '/request/send_all',
    {
      destination,
      classes,
    },
    {
      headers: { Authorization: 'Bearer ' + token },
    },
  )
}
