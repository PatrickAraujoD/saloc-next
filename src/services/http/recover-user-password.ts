'use server'
import { api } from '../api'

type Props = {
  token?: string | null
  password: string
  confirmationPassword: string
}

export async function recoverUserPassword({
  token,
  password,
  confirmationPassword,
}: Props) {
  try {
    await api.post('/user/reset_password', {
      token,
      password,
      confirmationPassword,
    })
    return true
  } catch (error) {
    return false
  }
}
