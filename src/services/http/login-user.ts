'use server'
import { api } from '../api'

type Props = {
  email?: string
  password?: string
}

export async function loginUser({ email, password }: Props) {
  const response = await api.post('/user/login', {
    email,
    password,
  })
  return response
}
