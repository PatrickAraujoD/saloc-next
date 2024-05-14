'use client'
import { Input } from '@/components/input'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, SyntheticEvent, useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  function handleVerifyCompletedEmailInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const newEmail = event.target.value
    setEmail(newEmail)
  }

  function handleVerifyCompletedPasswordInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const newPassword = event.target.value
    setPassword(newPassword)
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      console.log(result)
      return
    }

    return router.replace('/')
  }

  return (
    <main className="flex-grow flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-xl border-2 border-blue-950"
      >
        <h1 className="text-blue-950 uppercase font-bold text-2xl mb-4">
          login
        </h1>
        <Input
          nameLabel="email"
          name="email"
          placeholder="digite seu email"
          onChange={handleVerifyCompletedEmailInput}
          value={email}
          required
        />

        <Input
          nameLabel="senha"
          name="password"
          placeholder="digite sua senha"
          minLength={8}
          maxLength={15}
          onChange={handleVerifyCompletedPasswordInput}
          value={password}
          required
        />
        <button
          type="submit"
          className="bg-blue-950 w-full py-2 rounded-lg text-white font-bold uppercase"
        >
          entrar
        </button>
      </form>
    </main>
  )
}
