'use server'
import { AxiosError } from 'axios'
import { api } from '../api'

type SendEmailProps = {
  email: string
}
export async function sendEmail({ email }: SendEmailProps) {
  try {
    const response = await api.post('/user/send/email', {
      email,
    })
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data.error ||
        'Não foi possível enviar o email de recuperação.'
      return { error: errorMessage }
    }
  }
}
