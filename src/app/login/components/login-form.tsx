import { Input } from '@/components/input'
import { ChangeEvent, FormEvent, useState } from 'react'

export function LoginForm() {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  function handleVerifyCompletedEmailInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    event.target.setCustomValidity('')

    const newValueEmail = event.target.value
    setEmailValue(newValueEmail)
  }

  function handleVerifyCompletedPasswordInput(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    event.target.setCustomValidity('')

    const newPasswordValue = event.target.value
    setPasswordValue(newPasswordValue)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
          value={emailValue}
          required
        />

        <Input
          nameLabel="senha"
          name="password"
          placeholder="digite sua senha"
          minLength={8}
          maxLength={15}
          onChange={handleVerifyCompletedPasswordInput}
          value={passwordValue}
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
