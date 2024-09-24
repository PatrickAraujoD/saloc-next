'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, SyntheticEvent, useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
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
    <main className="flex-grow flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-xl border-2 border-blue-950"
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

        <Button
          type="submit"
          title="Entrar"
          isButtonDisabled={isLoading}
          isLoading={isLoading}
        />
      </form>
    </main>
  )
}
