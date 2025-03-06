'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Toast } from '@/components/toast'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'
import { recoverUserPassword } from '@/services/http'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'
import { IoInformationCircleSharp } from 'react-icons/io5'

export function RecoverPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useAutoClearMessage({ message, setMessage })

  const query = new URLSearchParams(window.location.search)
  const tokenValue = query.get('token')

  const router = useRouter()

  function capturePassowrd(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  function captureConfirmationPassowrd(event: ChangeEvent<HTMLInputElement>) {
    setConfirmationPassword(event.target.value)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsError(false)

    if (password !== confirmationPassword) {
      setMessageForm('As senhas devem ser iguais.')
      return
    } else {
      setMessageForm('')
    }
    setIsLoading(true)

    const isRecoverPassword = await recoverUserPassword({
      token: tokenValue,
      password,
      confirmationPassword,
    })

    if (isRecoverPassword) {
      setMessage('Senha atualizada com sucesso!')
      setIsError(false)
    } else {
      setMessage('Não foi possível atualizar a senha')
      setIsError(true)
    }
    setIsLoading(false)
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4">
      {(!tokenValue || tokenValue.length < 50) && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-96 w-full">
            <p className="mb-6">
              Token inválido. Você será redirecionado para a página inicial.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-950 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {message && <Toast message={message} isError={isError} />}

      <form
        className="w-full sm:w-80 border-blue-950 border-2 p-10 rounded-lg flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-lg uppercase mb-5 font-bold sm:text-xl text-blue-950">
          Insira a nova senha
        </h1>
        <Input
          nameLabel="nova senha"
          type="password"
          onChange={capturePassowrd}
          required
        />
        <Input
          nameLabel="confirmar senha"
          type="password"
          onChange={captureConfirmationPassowrd}
          required
        />
        {messageForm && (
          <div className="flex lowercase mt-4 text-sm text-red-700 items-center gap-1">
            <IoInformationCircleSharp size={18} />
            {messageForm}
          </div>
        )}
        <Button
          isButtonDisabled={false}
          title="enviar"
          isLoading={isLoading}
          type="submit"
          className="mt-6 w-full"
        />
      </form>
    </main>
  )
}
