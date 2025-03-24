import React, { ChangeEvent, useEffect, useState } from 'react'
import { Select } from './select'
import { SessionProps } from '@/types'
import { getSectores, getScheduleRequestByIdClass } from '@/services/http'
import { Button } from './button'

interface SendRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (schedule: string, destination: number) => void
  idClass?: number | null
  session: SessionProps | null
  scheduleValue?: string
  isLoading: boolean
}

interface SchedulesProps {
  schedule: string
  schedule_complet: boolean
  type: string
}

export function SendRequestModal({
  isOpen,
  onClose,
  onConfirm,
  idClass,
  scheduleValue,
  session,
  isLoading,
}: SendRequestModalProps) {
  const [schedules, setSchedules] = useState<SchedulesProps[]>([])
  const [sectores, setSectores] = useState([])
  const [schedule, setSchedule] = useState('')
  const [destination, setDestination] = useState(0)
  const token = session?.token

  async function handleSearchSchedules() {
    try {
      const response = await getScheduleRequestByIdClass({
        idClass,
        schedule: scheduleValue,
        token,
      })

      setSchedules(response)
    } catch (error) {
      console.error('Erro ao buscar horários:', error)
    }
  }

  function handleCaptureSchedule(event: ChangeEvent<HTMLSelectElement>) {
    setSchedule(event.target.value)
  }

  function handleCaptureDestination(event: ChangeEvent<HTMLSelectElement>) {
    setDestination(Number(event.target.value))
  }

  async function handleSearchSectores() {
    try {
      if (token) {
        const response = await getSectores(token)

        setSectores(response)
      }
    } catch (error) {
      console.error('Erro ao buscar setores:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      handleSearchSchedules()
      handleSearchSectores()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idClass, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col bg-white rounded-lg w-96 h-96 px-8 gap-y-4">
        <h1 className="uppercase font-bold text-center mt-6">
          Enviar Solicitação
        </h1>
        <Select
          nameLabel="Horário"
          options={schedules}
          className="w-full"
          onChange={handleCaptureSchedule}
        />
        <Select
          nameLabel="Setor"
          options={sectores}
          className="w-full"
          onChange={handleCaptureDestination}
        />
        <div className="mt-4 flex justify-center">
          <Button
            isButtonDisabled={isLoading}
            title="fechar"
            type="button"
            onClick={onClose}
            className="uppercase mr-2 bg-gray-400 p-2 rounded font-light hover:text-gray-400 hover:border-gray-400"
          />
          <Button
            isButtonDisabled={isLoading}
            type="button"
            title="confirmar"
            isLoading={isLoading}
            onClick={() => onConfirm(schedule, destination)}
            className="uppercase bg-blue-950 text-white p-2 rounded font-light"
          />
        </div>
      </div>
    </div>
  )
}
