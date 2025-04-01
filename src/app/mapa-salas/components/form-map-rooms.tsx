'use client'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { listPeriod, getRooms, getRoomAllocateClass } from '@/services/http'
import { Period, Room, SessionProps } from '@/types'
import { ChangeEvent, RefObject, useEffect, useState } from 'react'

interface ResponseTableMap {
  room: Room
  name: string
  schedule: string
}

interface FormMapRoomProps {
  handleSetAllocateClasses: (data: ResponseTableMap[]) => void
  selectRoomRef: RefObject<HTMLSelectElement>
  selectPeriodRef: RefObject<HTMLSelectElement>
  session: SessionProps
}

export function FormMapRoom({
  handleSetAllocateClasses,
  selectPeriodRef,
  selectRoomRef,
  session,
}: FormMapRoomProps) {
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([])
  const [listPeriods, setListPeriods] = useState<Period[]>([])
  const [roomId, setRoomId] = useState<number | null>(null)
  const [periodId, setPeriodId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const token = session.token

  async function fetchRooms() {
    const rooms = await getRooms(token)
    setRooms(rooms)
  }

  async function fetchPeriods() {
    const periods = await listPeriod()
    setListPeriods(periods)
  }

  async function handleSubmit(event: React.FormEvent) {
    setIsLoading(true)
    event.preventDefault()
    if (roomId !== null && periodId !== null) {
      try {
        const response = await getRoomAllocateClass({
          roomId,
          periodId,
          token,
        })
        handleSetAllocateClasses(response)
      } catch (error) {
        console.error('Error allocating classes:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleCaptureRoomValue(event: ChangeEvent<HTMLSelectElement>) {
    setRoomId(Number(event.target.value))
  }

  function handleCapturePeriodValue(event: ChangeEvent<HTMLSelectElement>) {
    setPeriodId(Number(event.target.value))
  }

  useEffect(() => {
    fetchRooms()
    fetchPeriods()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <Select
        nameLabel="Sala"
        name="class"
        options={rooms}
        onChange={handleCaptureRoomValue}
        selectRef={selectRoomRef}
      />
      <Select
        nameLabel="Período"
        name="period"
        options={listPeriods}
        onChange={handleCapturePeriodValue}
        selectRef={selectPeriodRef}
      />
      <Button
        isButtonDisabled={isLoading}
        isLoading={isLoading}
        title="pesquisar"
        type="submit"
        className="mt-5"
      />
    </form>
  )
}
