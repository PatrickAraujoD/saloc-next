'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Toast } from '@/components/toast'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'
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
  useAutoClearMessage({ setMessage, message })

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
      {message && <Toast message={message} isError={isError} />}
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
