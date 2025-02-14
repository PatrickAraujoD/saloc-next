'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { sendEmail } from '@/services/http'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react'
import { IoClose } from 'react-icons/io5'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpenPoupSendEmail, setIsOpenPoupSendEmail] = useState(false)
  const [messageSendEmail, setMessageSendEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  function handleOpenPoupSendEmail() {
    setIsOpenPoupSendEmail(true)
  }

  async function handleSubmitEmailRecoverPassword(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    const message = await sendEmail({
      email,
    })
    if (!message.error) {
      setMessageSendEmail(message)
      setIsError(false)
    } else {
      setMessageSendEmail(message.error)
      setIsError(true)
    }
    setEmail('')
    setIsLoading(false)
    setIsOpenPoupSendEmail(false)
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError('Credencias inválidas.')
      return
    }

    router.replace('/home')
    window.location.reload()
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 relative">
      {isOpenPoupSendEmail && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmitEmailRecoverPassword}
            className="relative bg-white p-6 rounded shadow-lg xl:w-96 flex flex-col items-center justify-center"
          >
            <button
              className="absolute right-3 top-3"
              onClick={() => setIsOpenPoupSendEmail(false)}
            >
              <IoClose width={30} className="text-red-700" />
            </button>
            <h2 className="text-blue-950 font-bold mb-4 text-center uppercase">
              Recuperar Senha
            </h2>
            <Input
              name="email"
              type="email"
              nameLabel="email"
              placeholder="informe seu email"
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              isButtonDisabled={false}
              title="Enviar"
              isLoading={isLoading && isOpenPoupSendEmail}
              className="mt-10"
            />
          </form>
        </div>
      )}
      {messageSendEmail && (
        <div className="text-xl uppercase font-bold mb-6 gap-4 flex justify-between items-center mt-2">
          <p
            className={`text-lg ${isError ? 'text-red-700' : 'text-blue-950'}`}
          >
            {messageSendEmail}
          </p>
          <Button
            isButtonDisabled={false}
            title="x"
            type="button"
            className={`flex items-center justify-center border-2 px-2 rounded-lg   hover:bg-white transition-colors w-7 h-7 text-xs ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'} `}
            onClick={() => setMessageSendEmail('')}
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:w-96 items-center justify-center p-6 sm:p-10 rounded-xl border-2 border-blue-950"
      >
        <h1 className="text-blue-950 uppercase font-bold text-2xl mb-4">
          Login
        </h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Input
          nameLabel="Email"
          name="email"
          type="email"
          placeholder="Digite seu email"
          onChange={handleChange}
          value={email}
          required
        />

        <Input
          nameLabel="Senha"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          minLength={8}
          maxLength={15}
          onChange={handleChange}
          value={password}
          required
        />
        <button
          type="button"
          className="text-blue-400 text-sm w-full text-left mt-2 underline decoration-1"
          onClick={handleOpenPoupSendEmail}
        >
          esqueceu sua senha?
        </button>

        <Button
          type="submit"
          title="Entrar"
          isButtonDisabled={isLoading}
          isLoading={!isOpenPoupSendEmail && isLoading}
          className="mt-6"
        />
      </form>
    </main>
  )
}
