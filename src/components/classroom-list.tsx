import { Class, Room, SessionProps, Teacher } from '@/types'
import { Td } from './td'
import { Th } from './th'
import { RefObject, useEffect, useState } from 'react'
import { Button } from './button'
import { api } from '@/services/api'
import { ConfirmationModal } from './confirmation-modal'
import { SendRequestModal } from './send-request-modal'
import { HiCheck } from 'react-icons/hi'
import { HiArchiveBoxXMark } from 'react-icons/hi2'

interface Request {
  destination: number
  id: number
  idClass: number
  origin: number
  schedule: string
  status: string
}

interface RoomList {
  room: Room
  schedule: string
}

interface ClassComplet {
  id: number
  class: Class
  teacher: Teacher[]
  room: RoomList[]
  request?: Request
}

interface TableProps {
  action?: boolean
  classList: ClassComplet[]
  tableRef?: RefObject<HTMLTableElement>
  session: SessionProps | null
  loadingTable: boolean
}

const headersTableKeys = [
  'periodo',
  'código',
  'nome da disciplina',
  'departamento',
  'numeroTurma',
  'horário',
  'quantidade de alunos',
  'docente',
  'local',
  'ações',
]

export function ClassroomList({
  action,
  classList = [],
  tableRef,
  loadingTable,
  session,
}: TableProps) {
  const [classes, setClasses] = useState<ClassComplet[]>(classList)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenSendRequest, setIsModalOpenSendRequest] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  )
  const [selectedClass, setSelectedClass] = useState<number | null>()
  const [message, setMessage] = useState('')
  const token = session?.token
  const origin = session?.user.sector?.id

  async function handleAcceptClass(idRequest: number) {
    await api.post(
      '/request/update_status',
      {
        id: idRequest,
        status: 'aceita',
      },
      { headers: { Authorization: 'Bearer ' + token } },
    )

    const responseClass = await api.post('/class/list', {
      valueCourse: classList[0].class.course.id,
      period: classList[0].class.period.id,
      idSector: session?.user.sector.id,
    })

    setClasses(responseClass.data)
  }

  async function handleRecuseClass(idRequest: number) {
    await api.post(
      '/request/update_status',
      {
        id: idRequest,
        status: 'recusada',
      },
      { headers: { Authorization: 'Bearer ' + token } },
    )

    const responseClass = await api.post('/class/list', {
      valueCourse: classList[0].class.course.id,
      period: classList[0].class.period.id,
      idSector: session?.user.sector.id,
    })

    setClasses(responseClass.data)
  }

  const formatRoomBlock = (scheduleComplet: string) => {
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

  useEffect(() => {
    setClasses(classList)
  }, [classList])

  const handleOpenModal = (idRequest: number) => {
    setSelectedRequestId(idRequest)
    setIsModalOpen(true)
  }

  const handleSendRequestModal = (idClass: number) => {
    setSelectedClass(idClass)
    setIsModalOpenSendRequest(true)
  }

  const handleCloseModalSendRequest = () => {
    setSelectedRequestId(null)
    setIsModalOpenSendRequest(false)
  }

  const handleCloseModal = () => {
    setSelectedRequestId(null)
    setIsModalOpen(false)
  }

  const handleConfirmModal = () => {
    if (selectedRequestId !== null) {
      handleRecuseClass(selectedRequestId)
      handleCloseModal()
    }
  }

  const handleConfirmSendModal = async (
    schedule: string,
    destination: number,
  ) => {
    const response = await api.post(
      '/request/create',
      {
        destination,
        schedule,
        origin,
        idClass: selectedClass,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      },
    )
    setMessage(response.data)
    handleCloseModalSendRequest()
  }

  return (
    <div className="overflow-x-auto mb-10">
      {message && (
        <div className="text-xl uppercase font-bold mb-4 flex justify-between items-center">
          <p>{message}</p>
          <Button
            isButtonDisabled={false}
            title="x"
            type="button"
            className="flex items-center justify-center border-2 px-2 rounded-lg   hover:bg-white transition-colors w-9 h-9bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950"
            onClick={() => setMessage('')}
          />
        </div>
      )}
      {classes.length > 0 ? (
        <div className="overflow-auto">
          <table
            className="table-zebra-zebra table border-collapse"
            ref={tableRef}
          >
            <thead>
              <tr className="text-black text-center">
                {headersTableKeys.map((key) => {
                  if (key !== 'ações') {
                    return <Th content={key} key={key} />
                  }

                  if (
                    key === 'ações' &&
                    (action ||
                      classes[0].request ||
                      session?.user.sector?.course)
                  ) {
                    return <Th content={key} key={key} />
                  }

                  return null
                })}
              </tr>
            </thead>
            <tbody>
              {classes.map((classData) => (
                <tr key={classData.id} className="text-black text-center">
                  <Td content={String(classData.class.discipline.period)} />
                  <Td content={classData.class.discipline.code} />
                  <Td content={classData.class.discipline.name} />
                  <Td content={classData.class.discipline.departament} />
                  <Td content={classData.class.numberOfClass} />
                  <Td
                    content={
                      classData.request
                        ? classData.request.schedule
                        : classData.class.classSchedule
                    }
                  />
                  <Td content={String(classData.class.numberOfStudents)} />
                  <Td
                    content={classData.teacher.map((t) => t.name).join(' / ')}
                  />
                  <Td
                    content={classData.room
                      .map((r) => {
                        const room = r.room ?? {}
                        const day = formatRoomBlock(r.schedule)
                        const formattedRoomBlock =
                          room.sector === 'CCET'
                            ? `${'B' + room.block || ''}`
                            : room.block || ''

                        if (day) {
                          return `${day} - ${room.number || ''} - ${room.sector || ''} - ${formattedRoomBlock}`
                        } else {
                          return `${room.number || ''} - ${room.sector || ''} - ${formattedRoomBlock}`
                        }
                      })
                      .join(' / ')}
                  />
                  {action ? (
                    <td className="border-2 border-black">
                      <a
                        href={`alocar-turma/${classData.class.id}/${classData.request ? classData.request.schedule : classData.class.classSchedule}`}
                        className="bg-blue-950 text-white font-bold uppercase w-20 p-2 rounded-md border-transparent border-2 hover:border-blue-950 hover:bg-transparent transition-colors hover:text-blue-950"
                      >
                        Alocar
                      </a>
                    </td>
                  ) : classData.request ? (
                    classData.request.status === 'analise' ? (
                      <td className="border-2 border-black">
                        <div className="flex flex-col gap-1 justify-center items-center">
                          <Button
                            isButtonDisabled={false}
                            className="w-10 flex items-center justify-center"
                            onClick={() => {
                              if (classData.request) {
                                handleAcceptClass(classData.request.id)
                              }
                            }}
                          >
                            <HiCheck size={24} />
                          </Button>
                          <Button
                            isButtonDisabled={false}
                            className="bg-red-700 w-10 hover:border-red-700 hover:text-red-700 flex items-center justify-center"
                            onClick={() => {
                              if (classData.request) {
                                handleOpenModal(classData.request.id)
                              }
                            }}
                          >
                            <HiArchiveBoxXMark size={24} />
                          </Button>
                        </div>
                      </td>
                    ) : (
                      <Td content="--" />
                    )
                  ) : (
                    session?.user.sector?.course && (
                      <td className="border-2 border-black border-l-2">
                        <Button
                          isButtonDisabled={false}
                          title=">"
                          className="text-xs w-6"
                          onClick={() => {
                            handleSendRequestModal(classData.class.id)
                          }}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        loadingTable && (
          <table className="table border-collapse" ref={tableRef}>
            <thead>
              <tr className="text-black text-center">
                {headersTableKeys.map((key, index) => (
                  <Th content={key} key={`${key}_loading_${index}`} />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-black text-center p-10">
                {headersTableKeys.map((key, index) => (
                  <td
                    key={key + '_cell'}
                    className="border-2 border-black w-56"
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="skeleton w-20 h-4" />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message="Tem certeza que deseja recusar essa turma?"
        onConfirm={handleConfirmModal}
      />
      <SendRequestModal
        isOpen={isModalOpenSendRequest}
        onClose={handleCloseModalSendRequest}
        onConfirm={handleConfirmSendModal}
        idClass={selectedClass}
        session={session}
      />
    </div>
  )
}
