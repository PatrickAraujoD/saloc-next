'use client'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { api } from '@/services/api'
import { Room, SessionProps } from '@/types'
import axios from 'axios'
import { ChangeEvent, useState } from 'react'

interface RoomFormProps {
  session: SessionProps
  onRoomAdded: (newRoom: Room) => void
}

export function RoomForm({ session, onRoomAdded }: RoomFormProps) {
  const [number, setNumber] = useState('')
  const [capacity, setCapacity] = useState<number>(0)
  const [block, setBlock] = useState('')
  const [floor, setFloor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const token = session.token

  async function handleSubmit(event: React.FormEvent) {
    setIsLoading(true)
    event.preventDefault()

    try {
      const response = await api.post(
        '/room/register',
        {
          number,
          capacity,
          block,
          floor,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      const newRoom = response.data.room as Room
      setMessage('Sala registrada com sucesso!')

      onRoomAdded(newRoom)
      setIsError(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || 'Erro desconhecido'
        setMessage(errorMessage)
        setIsError(true)
      }
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
      {message && (
        <div className="flex justify-between items-center mt-10 uppercase font-bold text-xl text-blue-950">
          <p className={`${isError ? 'text-red-700' : 'text-blue-950'}`}>
            {message}
          </p>
          <Button
            isButtonDisabled={false}
            title={'x'}
            type={'button'}
            className={`flex items-center justify-center border-2 px-2 rounded-lg   hover:bg-white transition-colors w-9 h-9 ${isError ? 'bg-red-700 border-red-700 hover:text-red-700 hover:border-red-700' : 'bg-blue-950 border-blue-950 hover:text-blue-950 hover:border-blue-950'}`}
            onClick={closeMessage}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-x-36 mt-10">
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
