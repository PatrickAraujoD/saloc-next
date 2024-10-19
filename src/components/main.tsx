'use client'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import jsPDF from 'jspdf'
import autoTable, { UserOptions } from 'jspdf-autotable'
import { ChangeEvent, useEffect, useState } from 'react'
import { ClassComplet, ClassroomList } from './classroom-list'
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
  const [classesInProgress, setClassesInProgress] = useState<ClassComplet[]>([])
  const [classesNotSent, setClassesNotSent] = useState<ClassComplet[]>([])
  const [completedClasses, setCompletedClasses] = useState<ClassComplet[]>([])
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

    await handleUpdateTable()

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

  const handleUpdateTable = async () => {
    let body: any = {}

    const idSector = session?.user.sector?.id

    body = {
      valueCourse,
      period,
      teacher: teacherId,
      discipline: disciplineId,
    }

    if (idSector && !session?.user.sector.course) {
      body = {
        valueCourse,
        period,
        teacher: teacherId,
        discipline: disciplineId,
        idSector,
      }
    } else if (session?.user.sector?.course) {
      const course = session?.user.sector?.course
      body = {
        valueCourse: course,
        period,
      }
    }

    try {
      let response
      const isCourseUndefined = !session?.user.sector?.course
      const isAdmin = session?.user.isAdmin
      const hasNoSession = !session

      if (isCourseUndefined || isAdmin || hasNoSession) {
        response = await api.post('/class/list', body)
        setListClass(response.data)
      } else {
        response = await api.post('/request/progress', body, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setClassesInProgress(response.data.accepted_in_analysis)
        setClassesNotSent(response.data.not_in_requests)
        setCompletedClasses(response.data.allocated_classes)
      }
    } catch (error) {
      setMessage('Servidor offline')
      setIsError(true)
    }
  }

  const formatRoomBlock = (scheduleComplet: string) => {
    console.log(scheduleComplet)
    const [days] = scheduleComplet.split(/[MTN]/)
    if (days.length === 1) {
      const dayMapping: { [key: string]: string } = {
        '2': 'SEG',
        '3': 'TER',
        '4': 'QUA',
        '5': 'QUI',
        '6': 'SEX',
        '7': 'SAB',
      }

      return dayMapping[days] || 'N/A'
    }
    return null
  }

  const generatePDF = () => {
    const courseName = session?.user.course?.name
    const imagePath = '/logo-saloc.png'

    const options = {
      filename: `${courseName}`,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      jsPDFOptions: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'landscape' as const,
      },
    }

    // eslint-disable-next-line new-cap
    const doc = new jsPDF({
      unit: options.jsPDFOptions.unit,
      format: options.jsPDFOptions.format,
      orientation: options.jsPDFOptions.orientation,
    })

    doc.setFontSize(12)
    const styles: Partial<UserOptions['styles']> = {
      halign: 'center',
      valign: 'middle',
      cellPadding: 2,
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
      cellWidth: 'auto',
      overflow: 'linebreak',
    }
    const selectSemester = selectSemesterRef.current
    let semester = null
    if (selectSemester) {
      semester = selectSemester.options[selectSemester.selectedIndex].text
    }
    doc.setFont('helvetica', 'bold')

    if (courseName) {
      doc.text('CURSO: ' + courseName, 14, 16)
    }

    if (semester) {
      doc.text('PERIODO: ' + semester, 247.8, 16)
    }
    doc.setFont('helvetica', 'normal')
    const img = new Image()
    img.src = imagePath

    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const imgWidth = 50
      const imgHeight = (img.height / img.width) * imgWidth
      const x = pageWidth - imgWidth - options.margin.right - 4
      const y = pageHeight - imgHeight - options.margin.bottom + 9

      const onHeadTable = () => {
        return [
          [
            'PERIODO',
            'CÓDIGO',
            'NOME DISCIPLINA',
            'DEPARTAMENTO',
            'NUMERO DA TURMA',
            'HORÁRIO',
            'QUANTIDADE DE ALUNOS',
            'DOCENTE',
            'LOCAL',
          ],
        ]
      }

      const onBodyTable = (classe: ClassComplet[]) => {
        return classe.map((cls) => [
          cls.class.discipline.period
            ? cls.class.discipline.period.trim()
            : cls.class.discipline.period,
          cls.class.discipline.code
            ? cls.class.discipline.code.trim()
            : cls.class.discipline.code,
          cls.class.discipline.name
            ? cls.class.discipline.name.trim()
            : cls.class.discipline.name,
          cls.class.discipline.departament
            ? cls.class.discipline.departament.trim()
            : cls.class.discipline.departament,
          cls.class.numberOfClass
            ? cls.class.numberOfClass.trim()
            : cls.class.numberOfClass,
          cls.class.classSchedule
            ? cls.class.classSchedule.trim()
            : cls.class.classSchedule,
          cls.class.numberOfStudents
            ? String(cls.class.numberOfStudents).trim()
            : cls.class.numberOfStudents,
          cls.teacher.map((t) => t.name).join(' / '),
          cls.room
            .map((r) => {
              const room = r.room ?? {}
              const day = formatRoomBlock(r.schedule)
              const formattedRoomBlock =
                room.building === 'CCET'
                  ? `${'B' + room.block || ''}`
                  : room.block || ''

              if (day) {
                return `${day} - ${room.number || ''} - ${room.building || ''} - ${formattedRoomBlock}`
              } else {
                return `${room.number || ''} - ${room.building || ''} - ${formattedRoomBlock}`
              }
            })
            .join(' / '),
        ])
      }

      const renderTableOrMessage = (
        classList: ClassComplet[],
        title: string,
      ) => {
        doc.text(title, 14, 24)
        if (classList.length === 0) {
          doc.text('Nenhuma turma disponível', 14, 30)
          doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight)
        } else {
          autoTable(doc, {
            styles,
            head: onHeadTable(),
            body: onBodyTable(classList),
            startY: 30,
            didDrawPage: onDidDrawPage,
          })
        }
      }

      const onDidDrawPage = () => {
        doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight)
      }

      renderTableOrMessage(
        classesNotSent,
        'TURMAS QUE AINDA NÃO FORAM ENVIADAS',
      )
      doc.addPage()
      renderTableOrMessage(classesInProgress, 'TURMAS QUE ESTÃO EM PROGRESSO')
      doc.addPage()
      renderTableOrMessage(completedClasses, 'TURMAS FINALIZADAS')

      doc.save(`${options.filename}.pdf`)
    }
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
      {session?.user.sector.course ? (
        <Menu
          generatePdfClassSections={generatePDF}
          isButtonDisabled={isButtonDisabled}
          period={period}
          session={session}
          valueCourse={valueCourse}
        />
      ) : (
        <Menu
          generatePdfReport={generatePdfReport}
          isButtonDisabled={isButtonDisabled}
          period={period}
          session={session}
          valueCourse={valueCourse}
        />
      )}
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
      {session?.user.sector?.course ? (
        <div>
          <div>
            <h2 className="uppercase text-blue-950 font-bold text-lg">
              turmas que ainda não foram enviadas
            </h2>
            <ClassroomList
              classList={classesNotSent}
              showActions={true}
              updateTable={handleUpdateTable}
              tableRef={tableRef}
              session={session}
              loadingTable={false}
            />
          </div>
          <div>
            <h2 className="uppercase text-blue-950 font-bold text-lg">
              turmas que estão em progresso
            </h2>
            <ClassroomList
              classList={classesInProgress}
              tableRef={tableRef}
              updateTable={handleUpdateTable}
              session={session}
              loadingTable={false}
            />
          </div>
          <div>
            <h2 className="uppercase text-blue-950 font-bold text-lg">
              turmas finalizadas
            </h2>
            <ClassroomList
              classList={completedClasses}
              tableRef={tableRef}
              updateTable={handleUpdateTable}
              session={session}
              loadingTable={false}
            />
          </div>
        </div>
      ) : (
        <ClassroomList
          classList={listclass}
          showActions={true}
          updateTable={handleUpdateTable}
          tableRef={tableRef}
          session={session}
          loadingTable={false}
        />
      )}
    </main>
  )
}
