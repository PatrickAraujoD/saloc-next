'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { api } from '@/services/api'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IoInformationCircleSharp } from 'react-icons/io5'

export function RecoverPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

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
    setIsLoading(true)
    setIsError(false)

    if (password !== confirmationPassword) {
      setMessageForm('As senhas devem ser iguais.')
      return
    } else {
      setMessageForm('')
    }

    try {
      await api.post('/user/recover/password', {
        password,
        confirmationPassword,
      })
      setMessage('Senha atualizada com sucesso!')
      setIsError(false)
    } catch (error) {
      setMessage('Não foi possível atualizar a senha')
      setIsError(true)
    }
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
      {message && (
        <div className="text-xl uppercase font-bold mb-6 gap-4 flex justify-between items-center mt-10">
          <p className={`${isError ? 'text-red-700' : 'text-blue-950'}`}>
            {message}
          </p>
          <Button
            isButtonDisabled={false}
            title="x"
            type="button"
            className={`flex items-center justify-center border-2 px-2 rounded-lg   hover:bg-white transition-colors w-9 h-9 ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'} `}
            onClick={() => setMessage('')}
          />
        </div>
      )}

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
          <div className="flex lowercase text-red-700 items-center gap-1 mb-4">
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
