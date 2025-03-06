import { Class, Room, SessionProps, Teacher } from '@/types'
import { Td } from './td'
import { Th } from './th'
import { ChangeEvent, RefObject, useEffect, useState } from 'react'
import { Button } from './button'
import { SendAllRequest } from './send-all-modal'
import { SendRequestModal } from './send-request-modal'
import { HiCheck } from 'react-icons/hi'
import { MdOutlineArrowForward } from 'react-icons/md'
import { Input } from './input'
import {
  updateStatus,
  requestSendAll,
  requestAcceptAll,
  createRequest,
} from '@/services/http'
import { useAutoClearMessage } from '@/hooks/use-auto-clear-message'
import { Toast } from './toast'

export interface SelectedClassesProps {
  id: number
  schedule: string
}

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

export interface ClassComplet {
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
  showActions?: boolean
  updateTable?: () => Promise<void>
}

interface SelectedClasse {
  idClass: number
  scheduleValue: string
}

const headersTableKeys = [
  'envios',
  'periodo',
  'código',
  'nome da disciplina',
  'departamento',
  'numero da turma',
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
  updateTable,
  session,
  showActions,
}: TableProps) {
  const [classes, setClasses] = useState<ClassComplet[]>(classList)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenSendRequest, setIsModalOpenSendRequest] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  )
  const [selectedRequests, setSelectedRequests] = useState<number[]>([])
  const [selectedClass, setSelectedClass] = useState<SelectedClasse | null>()
  const [selectedClasses, setSelectedClasses] = useState<
    SelectedClassesProps[]
  >([])
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const token = session?.token
  const origin = session?.user.sector?.id
  useAutoClearMessage({ message, setMessage })

  async function handleAcceptClass(idRequest: number) {
    await updateStatus({
      idRequest,
      token,
    })

    if (updateTable) {
      await updateTable()
    }
  }

  const formatRoomBlock = (scheduleComplet: string, name: string) => {
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

  const handleSelectClassesAndRequests = (
    classe: SelectedClassesProps,
    isChecked: boolean,
    requestId?: number,
  ) => {
    setCheckedItems((prevCheckedItems) => {
      if (isChecked) {
        if (!session?.user.sector?.course && requestId) {
          return [...prevCheckedItems, requestId]
        }
        return [...prevCheckedItems, classe.id]
      } else {
        if (!session?.user.sector?.course && requestId) {
          return prevCheckedItems.filter((itemId) => itemId !== requestId)
        }
        return prevCheckedItems.filter((itemId) => itemId !== classe.id)
      }
    })
    setSelectedClasses((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, classe]
      } else {
        return prevSelected.filter(
          (classExists: SelectedClassesProps) => classExists.id !== classe.id,
        )
      }
    })

    if (requestId) {
      setSelectedRequests((prevSelected) => {
        if (isChecked) {
          return [...prevSelected, requestId]
        } else {
          return prevSelected.filter(
            (requestPrevId) => requestPrevId !== requestId,
          )
        }
      })
    }
  }

  const handleSendRequestModal = (idClass: number, scheduleValue: string) => {
    setSelectedClass({ idClass, scheduleValue })
    setIsModalOpenSendRequest(true)
  }

  const handleCloseModalSendRequest = () => {
    setSelectedRequestId(null)
    setIsModalOpenSendRequest(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmSendSelectedClasses = async (
    classes: SelectedClassesProps[],
    destination: number,
  ) => {
    const isSendAll = await requestSendAll({
      destination,
      classes,
      token,
    })

    if (isSendAll) {
      if (updateTable) {
        await updateTable()
      }
      setIsError(false)
      setCheckedItems([])
      setSelectedClasses([])
    } else {
      setMessage('Erro ao enviar as solicitações')
      setIsError(true)
    }
    handleCloseModal()
  }

  const handleAcceptSelectedRequests = async () => {
    const response = await requestAcceptAll({
      token,
      requests: selectedRequests,
    })

    if (!response.error) {
      if (updateTable) {
        await updateTable()
      }

      setMessage(response)
      setIsError(false)
      setSelectedRequests([])
      setCheckedItems([])
      setIsCheckedAll(false)
    } else {
      setMessage(response.error)
      setIsError(true)
    }
  }

  function handleSelectAll(isChecked: boolean) {
    setCheckedItems((prevCheckedItems) => {
      if (isChecked) {
        return [
          ...prevCheckedItems,
          ...classes.flatMap((classe) => {
            if (!session?.user.sector.course && classe.request) {
              return classe.request.id ? [classe.request.id] : []
            }
            return classe.class.id ? [classe.class.id] : []
          }),
        ]
      } else {
        return prevCheckedItems.filter(
          (itemId) =>
            !classes.some((classe) => {
              if (!session?.user.sector.course && classe.request) {
                return classe.request.id === itemId
              }
              return classe.class.id === itemId
            }),
        )
      }
    })

    setSelectedClasses((prevSelected) => {
      if (isChecked && session?.user.sector.course) {
        return [
          ...prevSelected,
          ...classes.map((classe) => ({
            id: classe.class.id,
            schedule: classe.class.classSchedule,
          })),
        ]
      } else {
        return prevSelected.filter(
          (classExists: SelectedClassesProps) =>
            !classes.some((classe) => classe.class.id === classExists.id),
        )
      }
    })

    if (!session?.user.sector.course) {
      setSelectedRequests((prevSelected) => {
        if (isChecked) {
          return [
            ...prevSelected,
            ...classes
              .filter((classe) => classe.request)
              .map((classe) => classe.request!.id),
          ]
        } else {
          return prevSelected.filter(
            (requestPrevId) =>
              !classes.some((classe) => classe.request?.id === requestPrevId),
          )
        }
      })
    }
  }

  const handleSetisCheckedAll = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setIsCheckedAll(isChecked)
    handleSelectAll(isChecked)
  }

  const handleConfirmSendModal = async (
    schedule: string,
    destination: number,
  ) => {
    const response = await createRequest({
      destination,
      schedule,
      origin,
      idClass: selectedClass?.idClass,
      token,
    })
    if (updateTable) {
      await updateTable()
    }
    if (response.error) {
      setMessage(response.error)
    }
    handleCloseModalSendRequest()
  }

  return (
    <div className="overflow-x-auto mb-10">
      {message && <Toast message={message} isError={isError} />}
      {classes?.length > 0 ? (
        <div className="overflow-auto">
          {session?.user.sector && showActions && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="mr-3 h-4 w-4"
                  checked={isCheckedAll}
                  onChange={(e) => handleSetisCheckedAll(e)}
                />
                <label
                  htmlFor="selectAll"
                  className="text-blue-950 uppercase font-bold"
                >
                  Selecionar todas as turmas
                </label>
              </div>
              <div>
                <Button
                  isButtonDisabled={false}
                  type="button"
                  title="enviar selecionadas"
                  className={`text-sm ${!session?.user.sector.course ? 'mr-4' : ''}`}
                  onClick={() => setIsModalOpen(true)}
                />
                {!session?.user.sector.course && (
                  <Button
                    isButtonDisabled={false}
                    type="button"
                    title="aceitar solicitações"
                    className="text-sm"
                    onClick={() => handleAcceptSelectedRequests()}
                  />
                )}
              </div>
            </div>
          )}
          <table
            className="table-zebra-zebra table border-collapse"
            ref={tableRef}
          >
            <thead>
              <tr className="text-black text-center">
                {headersTableKeys.map((key) => {
                  if (showActions && session?.user.sector && key === 'envios') {
                    return <Th content={key} key={key} />
                  }

                  if (key !== 'ações' && key !== 'envios') {
                    return <Th content={key} key={key} />
                  }

                  if (
                    (action || showActions) &&
                    session?.user.sector &&
                    key === 'ações'
                  ) {
                    const shouldShowActions =
                      action ||
                      classes[0].request ||
                      session?.user.sector?.course

                    if (shouldShowActions) {
                      return <Th content={key} key={key} />
                    }
                  }

                  return null
                })}
              </tr>
            </thead>
            <tbody>
              {classes.map((classData) => (
                <tr key={classData.id} className="text-black text-center">
                  {showActions && session?.user.sector && (
                    <td className="border-2 border-black">
                      <Input
                        type="checkbox"
                        typeInput="checkbox"
                        checked={checkedItems.includes(
                          classData.request?.id ?? classData.class.id,
                        )}
                        onChange={(e) => {
                          !session.user.course && classData.request
                            ? handleSelectClassesAndRequests(
                                {
                                  id: classData.class.id,
                                  schedule: classData.request?.schedule,
                                },
                                e.target.checked,
                                classData.request?.id,
                              )
                            : handleSelectClassesAndRequests(
                                {
                                  id: classData.class.id,
                                  schedule: classData.class.classSchedule,
                                },
                                e.target.checked,
                                classData.request?.id,
                              )
                        }}
                      />
                    </td>
                  )}

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
                        const day = formatRoomBlock(
                          r.schedule,
                          classData.class.discipline.name,
                        )
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
                  ) : classData.request && showActions ? (
                    <td className="border-2 border-black">
                      <div className="flex flex-col gap-1 justify-center items-center">
                        {classData.request.status === 'analise' && (
                          <Button
                            isButtonDisabled={false}
                            className="w-7 h-7 flex items-center justify-center"
                            onClick={() => {
                              if (classData.request) {
                                handleAcceptClass(classData.request.id)
                              }
                            }}
                          >
                            <HiCheck size={20} />
                          </Button>
                        )}
                        <Button
                          isButtonDisabled={false}
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => {
                            handleSendRequestModal(
                              classData.class.id,
                              classData.request?.schedule || '',
                            )
                          }}
                        >
                          <MdOutlineArrowForward size={20} />
                        </Button>
                      </div>
                    </td>
                  ) : (
                    session?.user.sector?.course &&
                    showActions && (
                      <td className="border-2 border-black border-l-2">
                        <Button
                          isButtonDisabled={false}
                          className="w-7 h-7"
                          onClick={() => {
                            handleSendRequestModal(
                              classData.class.id,
                              classData.request?.schedule || '',
                            )
                          }}
                        >
                          <MdOutlineArrowForward size={24} />
                        </Button>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loadingTable ? (
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
              {headersTableKeys.map((key) => (
                <td key={key + '_cell'} className="border-2 border-black w-56">
                  <div className="flex items-center justify-center h-full">
                    <div className="skeleton w-20 h-4" />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <h2 className="mt-4 text-center uppercase font-bold text-lg">
          não existe dados para mostrar.
        </h2>
      )}
      <SendAllRequest
        isOpen={isModalOpen}
        classes={selectedClasses}
        setIsCheckedAll={setIsCheckedAll}
        onClose={handleCloseModal}
        message="informe o setor que deseja enviar as solicitações"
        onConfirm={handleConfirmSendSelectedClasses}
        token={token}
      />
      <SendRequestModal
        isOpen={isModalOpenSendRequest}
        onClose={handleCloseModalSendRequest}
        onConfirm={handleConfirmSendModal}
        idClass={selectedClass?.idClass}
        scheduleValue={selectedClass?.scheduleValue}
        session={session}
      />
    </div>
  )
}
