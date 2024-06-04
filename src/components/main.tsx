'use client'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { ClassroomList } from './classroom-list'

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
    <main className="px-6 md:px-20 flex-grow">
      <Button
        isButtonDisabled={false}
        title="sair"
        type="button"
        onClick={logout}
        className="mt-10 w-32"
      />
      <form action="" className="mb-10">
        <Select
          name="course"
          nameLabel="curso"
          onChange={captureValueCourse}
          options={['--', 'ciência da computação', 'engenharia quimica']}
        />
        <Select
          name="period"
          nameLabel="periodo"
          onChange={captureValuePeriod}
          options={['--', '2024.2', '2035.1']}
        />
        <Select
          name="teacher"
          nameLabel="docente"
          options={['--', 'geraldo braz júnior', 'carlos de sales soares neto']}
        />
        <Select
          name="discipline"
          nameLabel="disciplina"
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
      <ClassroomList />
    </main>
  )
}
