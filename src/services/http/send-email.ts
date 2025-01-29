'use server'
import { api } from '../api'

type SendEmailProps = {
  email: string
}
export async function sendEmail({ email }: SendEmailProps) {
  const response = await api.post('/user/send/email', {
    email,
  })
  return response.data.message
}
