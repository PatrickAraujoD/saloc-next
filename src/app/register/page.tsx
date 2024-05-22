'use client'
import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { ChangeEvent } from 'react'

export default function Register() {
  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 md:p-0">
        <form className="w-96 border-blue-950 border-2 p-10 rounded-lg">
          <h1 className="text-center uppercase mb-10 font-bold text-xl text-blue-950">
            registrar usuário
          </h1>
          <Input
            name="name"
            nameLabel="nome"
            placeholder="digite seu nome"
            required
          />
          <Input
            name="email"
            nameLabel="email"
            placeholder="digite seu email"
            required
          />
          <Input
            name="password"
            nameLabel="senha"
            placeholder="digite sua senha"
            required
          />
          <Select
            options={['CCET', 'PAULO FREIRE', 'DEINF', 'DEMAT', 'COCOM']}
            nameLabel="setor"
            name="sector"
            className="mb-6 text-gray-400 px-2"
            onChange={onChange}
          />
          <Button type="submit" title="registrar" isButtonDisabled={false} />
        </form>
      </main>
      <Footer />
    </div>
  )
}
