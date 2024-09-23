'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { api } from '@/services/api'
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

    try {
      await api.post(
        '/course/register',
        {
          nameCourse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMessage('Curso registrado com sucesso')
      setNameCourse('')
      setIsError(false)
    } catch (error) {
      setMessage('Falha ao tentar registrar o curso')
      setIsError(true)
    }

    setLoading(false)
  }

  const isDisableButton = !nameCourse || loading

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
