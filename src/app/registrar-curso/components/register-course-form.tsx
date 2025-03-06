'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Toast } from '@/components/toast'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'
import { createCourse } from '@/services/http'
import { SessionProps } from '@/types'
import { ChangeEvent, FormEvent, useState } from 'react'

interface RegisterCourseFormProps {
  session: SessionProps
}

export function RegisterCourseForm({ session }: RegisterCourseFormProps) {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')
  const [nameCourse, setNameCourse] = useState('')
  const token = session.token
  useAutoClearMessage({ setMessage, message })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await registerCourse(token, nameCourse)
  }

  function captureNameCourse(event: ChangeEvent<HTMLInputElement>) {
    const newNameCourse = event.target.value.toUpperCase()
    setNameCourse(newNameCourse)
  }

  async function registerCourse(token: string, nameCourse: string) {
    setLoading(true)

    const response = await createCourse({
      nameCourse,
      token,
    })
    if (!response.error) {
      setMessage('Curso registrado com sucesso')
      setNameCourse('')
      setIsError(false)
    } else {
      setMessage(response.error)
      setIsError(true)
    }

    setLoading(false)
  }

  const isDisableButton = !nameCourse || loading

  return (
    <main className="flex-grow flex flex-col items-center">
      {message && <Toast message={message} isError={isError} />}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-blue-950 p-10 m-auto w-80 h-96 rounded-md flex flex-col items-center"
      >
        <h1 className="uppercase font-bold text-xl mb-14">Cadastrar Curso</h1>
        <Input
          nameLabel="curso"
          type="text"
          name="course"
          placeholder="digite o nome do curso"
          onChange={captureNameCourse}
        />
        <Button
          isButtonDisabled={isDisableButton}
          title="registrar"
          className="mt-14"
          isLoading={loading}
        />
      </form>
    </main>
  )
}
