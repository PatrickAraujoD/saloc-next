/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select'
import { Button } from '@/components/button'
import { Select as SelectDiscipline } from '@/components/select'
import { Input } from '@/components/input'
import { api } from '@/services/api'
import { SessionProps } from '@/types'
import { listDiscipline, listPeriod, listTeacher } from '@/services/http'

interface ProfessorOption {
  value: string
  label: string
}

interface FormRegisterClassProps {
  session: SessionProps
}

export function FormRegisterClass({ session }: FormRegisterClassProps) {
  const [selectedProfessores, setSelectedProfessores] = useState<string[]>([])
  const [quantityStudy, setQuantityStudy] = useState<string>('')
  const [classNumber, setClassNumber] = useState<string>('')
  const [schedule, setSchedule] = useState<string>('')
  const [discipline, setDiscipline] = useState<number>(0)
  const [period, setPeriod] = useState<number>(0)
  const [listPeriods, setListPeriods] = useState<[]>([])
  const [listTeachers, setListTeachers] = useState<[]>([])
  const [listDisciplines, setListDisciplines] = useState<[]>([])
  const [message, setMessage] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [isloading, setIsLoading] = useState<boolean>(false)
  const token = session.token
  const idCourse = session?.user.sector.course

  const handleProfessoresChange = (
    selectedOptions: MultiValue<ProfessorOption>,
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value)
    setSelectedProfessores(selectedValues)
  }

  function handleCaptureQuantityStudy(event: ChangeEvent<HTMLInputElement>) {
    setQuantityStudy(event.target.value)
  }

  function handleCaptureSchedule(event: ChangeEvent<HTMLInputElement>) {
    setSchedule(event.target.value.toUpperCase())
  }

  function handleCaptureClassNumber(event: ChangeEvent<HTMLInputElement>) {
    setClassNumber(event.target.value)
  }

  function handleCaptureDiscipline(event: ChangeEvent<HTMLSelectElement>) {
    const newDiscipline = Number(event.target.value)
    setDiscipline(newDiscipline)
  }

  function handleCapturePeriod(event: ChangeEvent<HTMLSelectElement>) {
    const newPeriod = Number(event.target.value)
    setPeriod(newPeriod)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault()

    console.log(schedule)

    const classData = {
      teachers: selectedProfessores,
      classNumber,
      schedule,
      quantityStudy,
      discipline,
      period,
    }

    try {
      const response = await api.post('/classe/register', classData, {
        headers: { Authorization: 'Bearer ' + token },
      })

      console.log(response.data)

      setMessage(response.data.message)
      setIsError(false)
    } catch (error: any) {
      setMessage(
        `Não foi possível salvar a turma: ${error.response.data.error}`,
      )
      setIsError(true)
    }
    setIsLoading(false)
  }

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

  useEffect(() => {
    async function dataInitial() {
      const courseId = Number(idCourse)
      const [period, teachers, disciplines] = await Promise.all([
        listPeriod(),
        listTeacher(),
        listDiscipline(courseId),
      ])

      const formattedTeachers = teachers.map((teacher: any) => ({
        value: teacher.id,
        label: teacher.name,
      }))

      setListPeriods(period)
      setListTeachers(formattedTeachers)
      setListDisciplines(disciplines)
    }

    dataInitial()
  }, [idCourse])

  const isButtonDisabled =
    selectedProfessores.length === 0 &&
    schedule === '' &&
    quantityStudy === '' &&
    discipline === 0 &&
    period === 0

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
            className={`flex items-center justify-center border-2 px-2 rounded-lg   hover:bg-white transition-colors w-9 h-9 ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'} `}
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
        <div className="mb-4">
          <SelectDiscipline
            options={listDisciplines}
            nameLabel="disciplina"
            onChange={handleCaptureDiscipline}
          />
        </div>
        <SelectDiscipline
          options={listPeriods}
          nameLabel="periodo"
          onChange={handleCapturePeriod}
        />
        <Input
          nameLabel="quantidade de alunos"
          type="number"
          onChange={handleCaptureQuantityStudy}
        />
        <Input
          nameLabel="número da turma"
          type="text"
          onChange={handleCaptureClassNumber}
        />
        <Input
          nameLabel="horário"
          type="text"
          onChange={handleCaptureSchedule}
        />

        <div className="mb-4">
          <label className="font-bold text-blue-950 uppercase">
            Professores
          </label>
          <Select
            isMulti
            options={listTeachers}
            onChange={handleProfessoresChange}
            styles={customStyles}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="--"
          />
        </div>

        <Button
          isButtonDisabled={isButtonDisabled}
          title="Enviar"
          className="mt-4 w-full"
          isLoading={isloading}
        />
      </form>
    </main>
  )
}
