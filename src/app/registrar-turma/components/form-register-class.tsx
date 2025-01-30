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

  const token = session.token

  const handleProfessoresChange = (
    selectedOptions: MultiValue<ProfessorOption>,
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value)
    console.log(selectedValues)
    setSelectedProfessores(selectedValues)
  }

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   const formData = new FormData(e.target as HTMLFormElement)
  //   const event = e.target as HTMLFormElement
  //   console.log(event)
  //   console.log(formData)

  //   // formData.append('teachers', selectedProfessores.join(','))

  //   try {
  //     // const response = await api.post('/classe/register', formData, {
  //     //   headers: { Authorization: 'Bearer ' + token },
  //     // })

  //     // setMessage(response.data.message)
  //     // setIsError(false)
  //     console.log(formData)
  //   } catch (error: any) {
  //     setMessage(
  //       `Não foi possível salvar a turma: ${error.response?.data?.error}`,
  //     )
  //     setIsError(true)
  //   }
  //   setIsLoading(false)
  // }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.target as HTMLFormElement)

    const data = Object.fromEntries(formData.entries())

    try {
      const response = await createClass({
        data: formData,
        token,
      })

      setMessage(response)
      setIsError(false)
    } catch (error: any) {
      setMessage(error.response.data.error)
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
      {message && (
        <div className="text-xl uppercase font-bold mb-4 gap-4 flex justify-between items-center mt-10">
          <p className={`${isError ? 'text-red-700' : 'text-blue-950'}`}>
            {message}
          </p>
          <Button
            isButtonDisabled={false}
            title="x"
            type="button"
            className={`flex items-center justify-center border-2 px-2 rounded-lg hover:bg-white transition-colors w-9 h-9 ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'}`}
            onClick={() => setMessage('')}
          />
        </div>
      )}
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
