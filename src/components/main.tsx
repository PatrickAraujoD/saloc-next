'use client'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { signOut } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { ClassroomList } from './classroom-list'
import {
  getCourses,
  listDiscipline,
  listTeacher,
  listPeriod,
} from '@/services/http'
import { api } from '@/services/api'
import { SessionProps } from '@/types/index'
import usePdfGenerator from '@/hooks/use-pdf-generator'

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
}

export function Main({ session }: MainProps) {
  const { tableRef, generatePdfReport, selectCourseRef, selectSemesterRef } =
    usePdfGenerator()
  const [valueCourse, setValueCourse] = useState<number | null>(null)
  const [period, setPeriod] = useState<number | null>(null)
  const [teacherId, setTeacherId] = useState<number | null>(null)
  const [disciplineId, setDisciplineId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingButtonSigaa, setIsLoadingButtonSigaa] = useState(false)
  const [listCourses, setListCourses] = useState<Course[]>([])
  const [listPeriods, setListPeriods] = useState<Period[]>([])
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [listTeachers, setListTeachers] = useState([])
  const [listDisciplines, setListDisciplines] = useState([])
  const [listclass, setListClass] = useState([])
  const router = useRouter()
  const token = session?.token

  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/')
    location.reload()
  }

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
    console.log(token)
    try {
      const disciplines = await listDiscipline(id)
      console.log(disciplines)
      setListDisciplines(disciplines)
      setIsError(false)
    } catch (error) {
      console.log(error)
      setMessage('servidor offline')
      setIsError(true)
    }
  }

  async function fetchInitialData() {
    const periods = await listPeriod()
    try {
      if (!session || !session.user.sector?.course) {
        const [newCourses, teachers] = await Promise.all([
          getCourses(),
          listTeacher(),
        ])

        setListCourses(newCourses)
        setListTeachers(teachers)
      }
      setListPeriods(periods)
      setIsError(false)
    } catch (error) {
      console.log(error)
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
          periodId: period,
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

  function redirectLogin() {
    router.push('/login')
  }

  function redirecAllocateRoom() {
    if (session?.user.course) {
      const course = session.user.course.id

      console.log('dsdjskjdksjdk')
      router.push(`/listar-turmas?curso=${course}&periodo=${period}`)
      return
    }

    router.push(`/listar-turmas?curso=${valueCourse}&periodo=${period}`)
  }

  function redirecCheckRooms() {
    router.push(`/verificar-salas`)
  }

  function redirecMapOfRooms() {
    router.push(`/mapa-salas`)
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (valueCourse) {
      fetchDiscipline(valueCourse)
    }

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
      <div className={`flex items-center mt-10 gap-4`}>
        <Button
          isButtonDisabled={isButtonDisabled}
          title="RELATÓRIO"
          type="button"
          className="sm:h-16 xl:h-12"
          onClick={() => {
            if (session?.user.course) {
              generatePdfReport('course', session?.user.course.name)
            } else {
              generatePdfReport('course')
            }
          }}
        />
        {session && session.user.sector && (
          <>
            <Button
              isButtonDisabled={isButtonDisabled}
              title="alocar turmas"
              type="button"
              onClick={redirecAllocateRoom}
              className="sm:h-16 xl:h-12 px-2"
            />
            <Button
              isButtonDisabled={false}
              title="mapa de sala"
              type="button"
              onClick={redirecMapOfRooms}
              className="sm:h-16 xl:h-12"
            />
            <Button
              isButtonDisabled={false}
              title="verificar salas"
              type="button"
              onClick={redirecCheckRooms}
              className="sm:h-16 xl:h-12 px-2"
            />
          </>
        )}
        {session && (
          <Button
            isButtonDisabled={false}
            title="sair"
            type="button"
            onClick={logout}
            className="sm:h-16 xl:h-12"
          />
        )}
        {session && session.user.isAdmin && (
          <>
            <Button
              isButtonDisabled={false}
              title="adicionar usuário"
              type="button"
              onClick={() => router.push(`/register`)}
              className="sm:h-16 xl:h-12"
            />
            <Button
              isButtonDisabled={false}
              title="adicionar curso"
              type="button"
              onClick={() => router.push(`/registrar-curso`)}
              className="sm:h-16 xl:h-12 px-2"
            />
            <Button
              isButtonDisabled={false}
              title="adicionar setor"
              type="button"
              onClick={() => router.push(`/registrar-setor`)}
              className="sm:h-16 xl:h-12 px-2"
            />
          </>
        )}
        {!session && (
          <Button
            isButtonDisabled={false}
            title="login"
            type="button"
            onClick={redirectLogin}
            className="sm:h-16 xl:h-12"
          />
        )}
      </div>
      <form className="mb-10" onSubmit={handleSubmit}>
        <Select
          name="period"
          nameLabel="periodo"
          onChange={captureValuePeriod}
          options={listPeriods}
          selectRef={selectSemesterRef}
        />
        {(!session || !session.user.sector || !session.user.sector.course) && (
          <div>
            <Select
              name="course"
              nameLabel="curso"
              onChange={captureValueCourse}
              options={listCourses}
              selectRef={selectCourseRef}
            />
            <Select
              name="teacher"
              nameLabel="docente"
              options={listTeachers}
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

        <div className="flex items-center mt-4 gap-4">
          <Button
            isButtonDisabled={isButtonDisabled}
            name="consultar"
            type="submit"
            title="consultar"
            isLoading={isLoading}
            className={`bg-blue-950 lg:h-16 xl:h-12 w-48 text-white uppercase font-bold rounded-md hover:bg-blue-950 hover:ease-in duration-200 ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          />
          {session && session.user.sector?.course && (
            <Button
              isButtonDisabled={isLoading}
              title="importar do sigaa"
              type="button"
              isLoading={isLoadingButtonSigaa}
              onClick={importDataSigaa}
              className="lg:h-16 xl:h-12 w-48"
            />
          )}
        </div>
      </form>
      <ClassroomList
        classList={listclass}
        tableRef={tableRef}
        session={session}
      />
    </main>
  )
}
