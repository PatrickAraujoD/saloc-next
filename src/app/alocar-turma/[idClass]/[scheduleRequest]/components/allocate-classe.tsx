'use client'
import { redirect, useParams } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { api } from '@/services/api'
import { deleteAlocacao } from '@/services/http/delete-alocacao'
import { getClass } from '@/services/http/get_class'
import { getRooms } from '@/services/http/get_rooms'
import { ClassInfoTableAllocate } from './class-info-table-allocate'
import { ClassInfoSection } from './class-info-section'
import { AllocateForm } from './allocate-form'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Class, Room, SessionProps } from '@/types'

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
      const response = await api.post(
        `/schedule/list/${idClass}`,
        {
          schedule: decodedScheduleRequest,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setListSchedule(response.data)
      return response.data
    } catch (error) {
      return []
    }
  }

  async function handleCaptureSchedule(event: ChangeEvent<HTMLSelectElement>) {
    const schedule = event.target.value
    const idPeriod = classInfo?.period.id
    setSchedule(schedule)
    if (idPeriod && schedule !== '0') {
      const response = await getRooms(token, idPeriod, schedule)
      setListRooms(response)
    } else {
      setListRooms([])
    }
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
    event.preventDefault()
    try {
      await api.post(
        'class/allocate/register',
        {
          valueRoom,
          schedule,
          idClass,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      const scheduleResponse = await fecthSchedule(Number(idClass))
      setListSchedule(scheduleResponse)
      setListRooms([])
      setValueRoom(0)
      const tableAllocateinfo = await fecthRoomAllocate()
      setClassInfoTable(tableAllocateinfo?.data)
    } catch (error) {
      console.log('Error ao alocar turma:', error)
    }
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
    if (valueDelete) {
      try {
        await deleteAlocacao(valueDelete.id, token)
        setClassInfoTable((classInfo) =>
          classInfo.filter((room) => room.id !== valueDelete.id),
        )
        setIsModalOpen(false)

        const response = await fecthSchedule(Number(idClass))
        setSchedule(response)
      } catch (error) {
        console.error('Erro ao excluir sala:', error)
      }
    }
  }

  async function fecthRoomAllocate() {
    if (idClass && classInfo?.period?.id) {
      const response = await api.get(
        `/room/allocate_rooms/${Number(idClass)}/${classInfo?.period.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setClassInfoTable(response.data)
      return response
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
    <main className="flex-grow p-10">
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
          onClose={closeModal}
          onConfirm={handleDeleteRoom}
          message="Tem certeza que deseja excluir esta alocação de sala?"
        />
      </section>
    </main>
  )
}
