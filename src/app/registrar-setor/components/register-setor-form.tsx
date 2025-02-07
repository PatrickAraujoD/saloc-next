'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { getCourses, createSector } from '@/services/http'
import { SessionProps } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

interface RegisterCourseFormProps {
  session: SessionProps
}

export function RegisterCourseForm({ session }: RegisterCourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const [nameSector, setNameSector] = useState('')
  const [nameCourse, setNameCourse] = useState(0)
  const [listCourse, setListCourse] = useState([])
  const token = session.token

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await registerCourse(token, nameSector)
  }

  function captureNameSector(event: ChangeEvent<HTMLInputElement>) {
    const newnameSector = event.target.value.toUpperCase()
    setNameSector(newnameSector)
  }

  function captureNameCourse(event: ChangeEvent<HTMLSelectElement>) {
    const course = Number(event.target.value)
    setNameCourse(course)
  }

  async function registerCourse(token: string, nameSector: string) {
    setLoading(true)

    const isCreateSector = await createSector({
      nameSector,
      course: nameCourse,
      token,
    })

    if (isCreateSector) {
      setMessage('Setor registrado com sucesso')
      setNameSector('')
      setIsError(false)
    } else {
      setMessage('Falha ao tentar registrar o setor')
      setIsError(true)
    }
    setLoading(false)
  }

  async function getDataInitial() {
    try {
      const response = await getCourses()
      setListCourse(response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDataInitial()
  }, [])

  const isDisableButton = !nameSector || loading

  return (
    <main className="flex-grow flex flex-col items-center">
      {message && (
        <div className="text-xl font-bold mb-4 flex justify-between items-center mt-4">
          <p className={`${isError ? 'text-red-700' : 'text-blue-950'}`}>
            {message}
          </p>
          <Button
            isButtonDisabled={false}
            title="x"
            type="button"
            className={`flex items-center justify-center border-2 px-2 rounded-lg ml-4 hover:bg-white transition-colors w-6 h-6 ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'} `}
            onClick={() => setMessage('')}
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-blue-950 p-10 m-auto w-80 h-96 rounded-md flex flex-col items-center"
      >
        <h1 className="uppercase font-bold text-xl mb-6">Cadastrar Curso</h1>
        <Input
          nameLabel="Setor"
          type="text"
          name="course"
          placeholder="digite o nome do setor"
          onChange={captureNameSector}
        />
        <Select
          nameLabel="Curso"
          options={listCourse}
          onChange={captureNameCourse}
          className="w-full"
        />
        <Button
          isButtonDisabled={isDisableButton}
          title="registrar"
          className="mt-6"
          isLoading={loading}
        />
      </form>
    </main>
  )
}
