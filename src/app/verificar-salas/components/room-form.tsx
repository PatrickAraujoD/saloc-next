'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { createRoom } from '@/services/http'
import { Room, SessionProps } from '@/types'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'

interface RoomFormProps {
  session: SessionProps
  onRoomAdded: (newRoom: Room) => void
  setMessage: (message: string) => void
  setIsError: (error: boolean) => void
}

export function RoomForm({
  session,
  onRoomAdded,
  setMessage,
  setIsError,
}: RoomFormProps) {
  const [number, setNumber] = useState('')
  const [capacity, setCapacity] = useState<number>(0)
  const [block, setBlock] = useState('')
  const [floor, setFloor] = useState('')
  const [building, setBuilding] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const token = session.token

  async function handleSubmit(event: React.FormEvent) {
    setIsLoading(true)
    event.preventDefault()

    const response = await createRoom({
      number,
      capacity,
      block,
      floor,
      building,
      token,
    })
    if (!response.error) {
      const newRoom = response
      setMessage('Sala registrada com sucesso!')

      onRoomAdded(newRoom)
      setIsError(false)
    } else {
      const errorMessage = response.error
      setMessage(errorMessage)
      setIsError(true)
    }
    setIsLoading(false)
  }

  function handleCaptureNumberOfRoom(event: ChangeEvent<HTMLInputElement>) {
    setNumber(event.target.value)
  }

  function handleCaptureCapacity(event: ChangeEvent<HTMLInputElement>) {
    const newValueCapacity = Number(event.target.value)
    setCapacity(newValueCapacity)
  }

  function handleCaptureBlock(event: ChangeEvent<HTMLInputElement>) {
    setBlock(event.target.value)
  }

  function handleCaptureBuilding(event: ChangeEvent<HTMLInputElement>) {
    const newBuilding = String(event.target.value)
    setBuilding(newBuilding.toUpperCase())
  }

  function handleCaptureFloor(event: ChangeEvent<HTMLInputElement>) {
    setFloor(event.target.value)
  }

  function closeMessage() {
    setMessage('')
  }

  const isButtonDisabled =
    number === '' || capacity === 0 || floor === '' || block === '' || isLoading

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-x-36 mt-10 mb-6">
          <Input
            nameLabel={'numero da sala *'}
            name={'numberOfRoom'}
            type="number"
            onChange={handleCaptureNumberOfRoom}
          />
          <Input
            nameLabel={'capacidade *'}
            name={'capacity'}
            type="number"
            onChange={handleCaptureCapacity}
          />
          <Input
            nameLabel={'prédio *'}
            name={'building'}
            type="text"
            onChange={handleCaptureBuilding}
          />
          <Input
            nameLabel={'bloco *'}
            name={'block'}
            type="text"
            onChange={handleCaptureBlock}
          />
          <Input
            nameLabel={'piso *'}
            name={'floor'}
            type="text"
            onChange={handleCaptureFloor}
          />
        </div>
        <Button
          isButtonDisabled={isButtonDisabled}
          title="salvar"
          type={'submit'}
          className={`${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full md:w-80`}
          isLoading={isLoading}
        />
      </form>
    </div>
  )
}
