'use client'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { ChangeEvent, useEffect, useState } from 'react'
import { ClassroomList } from './classroom-list'
import {
  getCourses,
  listDiscipline,
  listTeacher,
  listPeriod,
} from '@/services/http'
import { api } from '@/services/api'
import { SessionProps, Teacher } from '@/types/index'
import usePdfGenerator from '@/hooks/use-pdf-generator'
import Menu from '@/app/home/components/menu'

interface Course {
  id: number
  name: string
}

interface Period {
  id: number
  period: string
}

interface MainProps {
  session: SessionProps | null
  periods: Period[]
  courses?: Course[]
  teachers?: Teacher[]
}

export function Main({ session, periods, courses, teachers }: MainProps) {
  const { tableRef, generatePdfReport, selectCourseRef, selectSemesterRef } =
    usePdfGenerator()
  const [valueCourse, setValueCourse] = useState<number | null>(null)
  const [period, setPeriod] = useState<number | null>(null)
  const [teacherId, setTeacherId] = useState<number | null>(null)
  const [disciplineId, setDisciplineId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingButtonSigaa, setIsLoadingButtonSigaa] = useState(false)
  const [isLoadingAllocateAutomatic, setIsLoadingAllocateAutomatic] =
    useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [listDisciplines, setListDisciplines] = useState([])
  const [listclass, setListClass] = useState([])
  const token = session?.token

  function captureValueCourse(event: ChangeEvent<HTMLSelectElement>) {
    const courseId = Number(event.target.value)
    if (courseId) {
      setValueCourse(Number(event.target.value))
    } else {
      setValueCourse(null)
    }
  }

  function captureValuePeriod(event: ChangeEvent<HTMLSelectElement>) {
    const perioId = Number(event.target.value)
    if (perioId) {
      setPeriod(Number(event.target.value))
    } else {
      setPeriod(null)
    }
  }

  function captureValueTeacherId(event: ChangeEvent<HTMLSelectElement>) {
    const teacherId = Number(event.target.value)
    if (teacherId > 0) {
      setTeacherId(Number(event.target.value))
    } else {
      setTeacherId(null)
    }
  }

  function captureValueDisciplineId(event: ChangeEvent<HTMLSelectElement>) {
    const disciplineId = Number(event.target.value)
    if (disciplineId > 0) {
      setDisciplineId(Number(event.target.value))
    } else {
      setDisciplineId(null)
    }
  }

  async function fetchDiscipline(id: number) {
    try {
      const disciplines = await listDiscipline(id)
      setListDisciplines(disciplines)
      setIsError(false)
    } catch (error) {
      setMessage('servidor offline')
      setIsError(true)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    setIsLoading(true)
    event.preventDefault()
    let body
    if (!session || !session.user.sector?.course) {
      let idSector: number | null = null
      if (session) {
        idSector = session.user.sector?.id
      }

      if (idSector) {
        body = {
          valueCourse,
          period,
          teacher: teacherId,
          discipline: disciplineId,
          idSector,
        }
      } else {
        body = {
          valueCourse,
          period,
          teacher: teacherId,
          discipline: disciplineId,
        }
      }
    } else {
      const course = session.user.sector.course
      body = {
        valueCourse: course,
        period,
      }
    }

    try {
      const response = await api.post('/class/list', body)
      setListClass(response.data)
    } catch (error) {
      setMessage('servidor offline')
      setIsError(true)
    }

    setIsLoading(false)
  }

  async function importDataSigaa() {
    setIsLoadingButtonSigaa(true)
    try {
      await api.post(
        'class/import_sigaa',
        {
          id_period: period,
        },
        {
          headers: { Authorization: 'Bearer ' + token },
        },
      )
      setMessage('Dados carregados com sucesso!')
      setIsError(false)
    } catch (error) {
      setMessage('Falha ao importar dados do sigaa')
      setIsError(true)
    }

    setIsLoadingButtonSigaa(false)
  }

  async function allocationAutomatic() {
    setIsLoadingAllocateAutomatic(true)
    try {
      const idSector = session?.user.sector?.id
      const response = await api.post(
        'class/allocate/automatic',
        {
          id_period: period,
          id_sector: idSector,
        },
        {
          headers: { Authorization: 'Bearer ' + token },
        },
      )
      setMessage(response.data.message)
      setIsError(false)
    } catch (error) {
      setMessage('Falha ao importar dados do sigaa')
      setIsError(true)
    }

    setIsLoadingAllocateAutomatic(false)
  }

  useEffect(() => {
    if (valueCourse) {
      fetchDiscipline(valueCourse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueCourse])

  const isButtonDisabled = valueCourse === 0 || period === 0 || isLoading

  return (
    <main className="px-6 md:px-20 flex-grow">
      {message && (
        <div className="text-xl uppercase font-bold mb-4 flex justify-between items-center mt-10">
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
      <Menu
        generatePdfReport={generatePdfReport}
        isButtonDisabled={isButtonDisabled}
        period={period}
        session={session}
        valueCourse={valueCourse}
      />

      <form className="mb-10" onSubmit={handleSubmit}>
        <Select
          name="period"
          nameLabel="periodo"
          onChange={captureValuePeriod}
          options={periods}
          selectRef={selectSemesterRef}
        />
        {(!session || !session.user.sector || !session.user.sector.course) && (
          <div>
            <Select
              name="course"
              nameLabel="curso"
              onChange={captureValueCourse}
              options={courses}
              selectRef={selectCourseRef}
            />
            <Select
              name="teacher"
              nameLabel="docente"
              options={teachers}
              onChange={captureValueTeacherId}
            />
            <Select
              name="discipline"
              nameLabel="disciplina"
              options={listDisciplines}
              onChange={captureValueDisciplineId}
            />
          </div>
        )}

        <div className="flex items-center mt-4 gap-4 flex-wrap w-full justify-between sm:justify-start">
          <Button
            isButtonDisabled={isButtonDisabled}
            name="consultar"
            type="submit"
            title="consultar"
            isLoading={isLoading}
            className={`h-14 xl:h-12 w-20 md:w-48 uppercase ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          />
          {session && session.user.sector && (
            <Button
              title="alocar automático"
              type="button"
              onClick={allocationAutomatic}
              isLoading={isLoadingAllocateAutomatic}
              isButtonDisabled={isLoadingAllocateAutomatic}
              className="h-14 xl:h-12 w-20 md:w-48"
            />
          )}
          {session && session.user.sector?.course && (
            <Button
              isButtonDisabled={isLoadingButtonSigaa}
              title="importar do sigaa"
              type="button"
              isLoading={isLoadingButtonSigaa}
              onClick={importDataSigaa}
              className="h-14 xl:h-12 w-20 md:w-48"
            />
          )}
        </div>
      </form>
      <ClassroomList
        classList={listclass}
        tableRef={tableRef}
        session={session}
        loadingTable={false}
      />
    </main>
  )
}
