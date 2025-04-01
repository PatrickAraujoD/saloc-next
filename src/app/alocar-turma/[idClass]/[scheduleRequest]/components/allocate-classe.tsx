'use client'
import { redirect, useParams } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {
  deleteAlocacao,
  getClass,
  getRooms,
  getScheduleRequestByIdClass,
  registerClassAllocate,
  allocateRooms,
} from '@/services/http'
import { ClassInfoTableAllocate } from './class-info-table-allocate'
import { ClassInfoSection } from './class-info-section'
import { AllocateForm } from './allocate-form'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Class, Room, SessionProps } from '@/types'
import { Loading } from '@/components/Loading'

interface ListSchedule {
  id: number
  schedule: string
  schedule_complet: boolean
  type: string
}

interface ClassInfoTable {
  id: number
  room: Room
  name: string
  schedule: string
}

interface AllocateClasseProps {
  session: SessionProps
}

export function AllocateClasse({ session }: AllocateClasseProps) {
  const [listSchedule, setListSchedule] = useState<ListSchedule[]>([])
  const [schedule, setSchedule] = useState<string>('')
  const [valueRoom, setValueRoom] = useState<number>(0)
  const [listRooms, setListRooms] = useState<Room[]>([])
  const [classInfo, setClassInfo] = useState<Class | null>(null)
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [isLoadingSubmitClass, setIsLoadingSubmitClass] = useState(false)
  const [messageInfo, setMessageInfo] = useState(
    'identificando salas livres de conflitos.',
  )
  const [isLoadingRemoveAllocate, setIsLoadingRemoveAllocate] = useState(false)
  const [classInfoTable, setClassInfoTable] = useState<ClassInfoTable[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [valueDelete, setValueDelete] = useState<ClassInfoTable | null>(null)
  const { idClass, scheduleRequest } = useParams()
  const token = session.token

  if (!idClass || !scheduleRequest) {
    return redirect('/')
  }

  async function fecthSchedule(idClass: number) {
    try {
      const decodedScheduleRequest = Array.isArray(scheduleRequest)
        ? scheduleRequest.join(',')
        : decodeURIComponent(scheduleRequest)
      const response = await getScheduleRequestByIdClass({
        idClass,
        token,
        schedule: decodedScheduleRequest,
      })
      setListSchedule(response)
      return response
    } catch (error) {
      return []
    }
  }

  async function handleCaptureSchedule(event: ChangeEvent<HTMLSelectElement>) {
    setIsLoadingRooms(true)
    const schedule = event.target.value
    const idPeriod = classInfo?.period.id
    setSchedule(schedule)
    if (idPeriod && schedule !== '0') {
      const response = await getRooms(token, idPeriod, schedule)
      setListRooms(response)
    } else {
      setListRooms([])
    }
    setIsLoadingRooms(false)
  }

  async function handleCaptureValueRoom(event: ChangeEvent<HTMLSelectElement>) {
    const valueRoom = Number(event.target.value)
    setValueRoom(valueRoom)
  }

  async function fecthClass(idClass: number, scheduleRequest: string) {
    try {
      const response = await getClass(idClass, token, scheduleRequest)

      setClassInfo(response)
    } catch (error) {
      console.error('Error fetching class information:', error)
      setClassInfo(null)
    }
  }

  async function handleSubmit(event: FormEvent) {
    setIsLoadingSubmitClass(true)
    event.preventDefault()
    const decodedScheduleRequest = Array.isArray(scheduleRequest)
      ? scheduleRequest.join(',')
      : decodeURIComponent(scheduleRequest).replace('  ', ' ')

    const isRegisterClassAllocate = await registerClassAllocate({
      valueRoom,
      schedule,
      idClass,
      scheduleSend: decodedScheduleRequest,
      token,
    })

    if (isRegisterClassAllocate) {
      const scheduleResponse = await fecthSchedule(Number(idClass))
      const tableAllocateInfo = await fecthRoomAllocate()
      setClassInfoTable(tableAllocateInfo)
      setListRooms([])
      setValueRoom(0)
      setListSchedule(scheduleResponse)
    }
    setIsLoadingSubmitClass(false)
  }

  function openModal(value: ClassInfoTable) {
    setValueDelete(value)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setValueDelete(null)
  }

  async function handleDeleteRoom() {
    setIsModalOpen(false)
    setIsLoadingRemoveAllocate(true)
    if (valueDelete) {
      setMessageInfo('Excluindo alocação.')
      await deleteAlocacao(valueDelete.id, token)
      setClassInfoTable((classInfo) =>
        classInfo.filter((room) => room.id !== valueDelete.id),
      )
      setMessageInfo('Identificando horários disponíveis.')
      const response = await fecthSchedule(Number(idClass))
      setSchedule(response)
    }
    setIsLoadingRemoveAllocate(false)
    setMessageInfo('identificando salas livres de conflitos.')
  }

  async function fecthRoomAllocate() {
    if (idClass && classInfo?.period?.id) {
      const response = await allocateRooms({
        idClass,
        idPeriod: classInfo?.period.id,
        token,
      })
      if (!response.error) {
        setClassInfoTable(response)
        return response
      }
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (idClass) {
      fecthSchedule(Number(idClass))
      fecthClass(Number(idClass), String(scheduleRequest))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idClass, valueDelete])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (classInfo && classInfo.period?.id) {
      fecthRoomAllocate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classInfo])

  const isButtonDisable = valueRoom === 0 || schedule === ''

  return (
    <main className="flex-grow p-6 md:p-10">
      {(isLoadingRooms || isLoadingRemoveAllocate) && (
        <Loading description={messageInfo} />
      )}
      <section>
        <h2 className="font-bold uppercase mb-2">informações</h2>
        <ClassInfoSection classInfo={classInfo} />
      </section>
      <section>
        <h2 className="uppercase font-bold mt-10">alocar turma</h2>
        <div className="relative border-black border-2 p-10">
          <AllocateForm
            listSchedule={listSchedule}
            listRooms={listRooms}
            schedule={schedule}
            valueRoom={valueRoom}
            isLoading={isLoadingSubmitClass}
            onScheduleChange={handleCaptureSchedule}
            onRoomChange={handleCaptureValueRoom}
            onSubmit={handleSubmit}
            isButtonDisabled={isButtonDisable}
          />
          <div className="mt-20 w-full">
            {classInfo && (
              <ClassInfoTableAllocate
                classInfoTable={classInfoTable}
                openModal={openModal}
              />
            )}
          </div>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          isLoading={false}
          onClose={closeModal}
          onConfirm={handleDeleteRoom}
          message="Tem certeza que deseja excluir esta alocação de sala?"
        />
      </section>
    </main>
  )
}
