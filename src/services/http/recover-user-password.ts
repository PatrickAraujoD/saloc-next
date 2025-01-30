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
  await api.post('/user/reset_password', {
    token,
    password,
    confirmationPassword,
  })
}
