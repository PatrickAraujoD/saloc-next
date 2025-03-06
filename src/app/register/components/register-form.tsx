'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { createUser, getSectores } from '@/services/http'
import { SessionProps } from '@/types'
import { IoInformationCircleSharp } from 'react-icons/io5'
import { FormEvent, useEffect, useState } from 'react'
import { Toast } from '@/components/toast'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'

interface RegisterFormProps {
  session: SessionProps
}

export function RegisterForm({ session }: RegisterFormProps) {
  const [listSectors, setListSectores] = useState()
  const [message, setMessage] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [isError, setIsError] = useState(false)
  const token = session?.token

  async function registerUser(event: FormEvent) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const sectorId = Number(formData.get('sector') as string)
    useAutoClearMessage({ setMessage, message })

    if (password !== confirmPassword) {
      setMessageForm('As senhas devem ser iguais.')
      return
    } else {
      setMessageForm('')
    }

    const body = {
      name,
      email,
      password,
      sectorId,
      confirmPassword,
    }

    const response = await createUser(token, body)
    if (!response.error) {
      setMessage(response.message)
      setIsError(false)
    } else {
      setMessage(response.error)
      setIsError(true)
    }
  }

  useEffect(() => {
    async function fetchPeriods() {
      const response = await getSectores(token)

      setListSectores(response)
    }
    fetchPeriods()
  }, [token])

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4">
      {message && <Toast message={message} isError={isError} />}
      <form
        className="w-full sm:w-96  border-blue-950 border-2 p-10 rounded-lg"
        onSubmit={registerUser}
      >
        <h1 className="text-center text-lg uppercase mb-10 font-bold sm:text-xl text-blue-950">
          registrar usuário
        </h1>
        <Input
          name="name"
          nameLabel="nome"
          type="text"
          placeholder="digite seu nome"
          required
        />
        <Input
          name="email"
          nameLabel="email"
          type="email"
          placeholder="digite seu email"
          required
        />
        <Input
          name="password"
          nameLabel="senha"
          type="password"
          placeholder="digite sua senha"
          required
        />
        <Input
          name="confirmPassword"
          nameLabel="confirmar senha"
          placeholder="reinsira sua senha"
          type="password"
          required
        />
        <Select
          options={listSectors}
          nameLabel="setor"
          name="sector"
          className="mb-6"
        />
        {messageForm && (
          <div className="flex lowercase text-red-700 items-center gap-1 mb-4">
            <IoInformationCircleSharp size={18} />
            {messageForm}
          </div>
        )}
        <Button type="submit" title="registrar" isButtonDisabled={false} />
      </form>
    </main>
  )
}
