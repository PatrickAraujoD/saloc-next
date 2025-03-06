'use client'
import { FormEvent, useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'
import { Button } from '@/components/button'
import { Select as SelectDiscipline } from '@/components/select'
import { Input } from '@/components/input'
import { SessionProps } from '@/types'
import {
  listPeriod,
  listTeacher,
  getCourses,
  listDiscipline,
  createClass,
} from '@/services/http'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'
import { Toast } from '@/components/toast'

interface ProfessorOption {
  value: string
  label: string
}

interface FormRegisterClassProps {
  session: SessionProps
}

export function FormRegisterClass({ session }: FormRegisterClassProps) {
  const [selectedProfessores, setSelectedProfessores] = useState<string[]>([])
  const [listPeriods, setListPeriods] = useState<[]>([])
  const [listCourses, setListCourses] = useState<[]>([])
  const [listTeachers, setListTeachers] = useState<[]>([])
  const [listDisciplines, setListDisciplines] = useState<[]>([])
  const [message, setMessage] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [course, setCourse] = useState<number>(0)
  const [discipline, setDiscipline] = useState<number>(0)
  useAutoClearMessage({ setMessage, message })

  const token = session.token

  const handleProfessoresChange = (
    selectedOptions: MultiValue<ProfessorOption>,
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value)
    setSelectedProfessores(selectedValues)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    const dataSend = {
      ...data,
      teachers: selectedProfessores,
    }

    const response = await createClass({
      data: dataSend,
      token,
    })

    if (!response.error) {
      setMessage(response)
      setIsError(false)
    } else {
      setMessage(response.error)
      setIsError(true)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    async function dataInitial() {
      const [period, teachers, courses] = await Promise.all([
        listPeriod(),
        listTeacher(),
        getCourses(),
      ])

      const formattedTeachers = teachers.map((teacher: any) => ({
        value: teacher.id,
        label: teacher.name,
      }))

      setListPeriods(period)
      setListTeachers(formattedTeachers)
      setListCourses(courses)
    }

    dataInitial()
  }, [])

  useEffect(() => {
    async function getDisciplines() {
      if (course > 0) {
        const disciplines = await listDiscipline(course)
        setListDisciplines(disciplines)
      }
    }

    getDisciplines()
  }, [course])

  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: '2px solid #082f49',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#082f49',
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#e0f2fe',
      color: '#082f49',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#082f49',
      fontSize: '0.875rem',
    }),
  }

  const isButtonDisabled = !selectedProfessores.length

  return (
    <main className="py-10 flex-1 flex flex-col items-center justify-center">
      {message && <Toast message={message} isError={isError} />}
      <form
        className="w-96 border-2 border-blue-950 p-10 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="uppercase font-bold text-blue-950 text-center">
          Registrar Turma
        </h1>

        <SelectDiscipline
          options={listCourses}
          nameLabel="Cursos"
          name="id_course"
          onChange={(e) => setCourse(Number(e.target.value))}
        />

        <SelectDiscipline
          options={listDisciplines}
          nameLabel="Disciplina"
          name="id_discipline"
          onChange={(e) => setDiscipline(Number(e.target.value))}
          showInput={true}
        />

        {discipline === -1 && (
          <div>
            <Input name="name" nameLabel="disciplina" type="text" />
            <Input name="code" nameLabel="código" type="text" />
            <Input name="departament" nameLabel="departamento" type="text" />
            <Input name="period" nameLabel="período" type="text" />
          </div>
        )}

        <SelectDiscipline
          options={listPeriods}
          nameLabel="semestre"
          name="semester"
        />

        <Input
          name="quantityStudy"
          nameLabel="Quantidade de Alunos"
          type="number"
        />
        <Input name="classNumber" nameLabel="Número da Turma" type="text" />
        <Input name="schedule" nameLabel="Horário" type="text" />

        <div className="mt-4">
          <label className="font-semibold text-blue-950 uppercase">
            Professores
          </label>
          <Select
            isMulti
            options={listTeachers}
            onChange={handleProfessoresChange}
            styles={customStyles}
            name="teachers"
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="--"
          />
        </div>

        <Button
          isButtonDisabled={isButtonDisabled}
          title="Enviar"
          className="mt-4 w-full"
          isLoading={isLoading}
          type="submit"
        />
      </form>
    </main>
  )
}
