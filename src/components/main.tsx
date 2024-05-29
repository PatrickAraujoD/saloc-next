'use client'
import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Select } from '@/components/select'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { Table } from './table'

export function Main() {
  const [nameCourse, setNameCourse] = useState('--')
  const [period, setPeriod] = useState('--')
  const router = useRouter()

  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/login')
  }

  function captureValueCourse(event: ChangeEvent<HTMLSelectElement>) {
    setNameCourse(event.target.value)
  }

  function captureValuePeriod(event: ChangeEvent<HTMLSelectElement>) {
    setPeriod(event.target.value)
  }

  const isButtonDisabled = nameCourse === '--' || period === '--'

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <button onClick={logout}>sair</button>
      </div>
      <main className="px-6 md:px-20 flex-grow">
        <form action="" className="mb-10">
          <Select
            name="course"
            nameLabel="curso"
            className="px-4"
            onChange={captureValueCourse}
            options={['--', 'ciência da computação', 'engenharia quimica']}
          />
          <Select
            name="period"
            nameLabel="periodo"
            className="px-4"
            onChange={captureValuePeriod}
            options={['--', '2024.2', '2035.1']}
          />
          <Select
            name="teacher"
            nameLabel="docente"
            className="px-4"
            options={[
              '--',
              'geraldo braz júnior',
              'carlos de sales soares neto',
            ]}
          />
          <Select
            name="discipline"
            nameLabel="disciplina"
            className="px-4"
            options={[
              '--',
              'estrutura de dados I',
              'linguagem de programação II',
            ]}
          />
          <Button
            isButtonDisabled={isButtonDisabled}
            name="consultar"
            type="submit"
            title="consultar"
            className={`w-full bg-blue-950 h-10 text-white uppercase font-bold mt-4 rounded-md hover:bg-blue-950 hover:ease-in duration-200 ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          />
        </form>
        <Table />
      </main>
      <Footer />
    </div>
  )
}
