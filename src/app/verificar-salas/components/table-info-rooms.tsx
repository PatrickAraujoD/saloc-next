'use client'
import { Button } from '@/components/button'
import { Td } from '@/components/td'
import { Th } from '@/components/th'
import { deleteRoom } from '@/services/http/deleteRoom'
import { getRooms } from '@/services/http/get_rooms'
import { useEffect, useState } from 'react'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { Room, SessionProps } from '@/types'
import axios from 'axios'
import { RoomForm } from './room-form'
import { MdDeleteForever } from 'react-icons/md'

interface TableInfoRoomsProps {
  session: SessionProps
}

const headerTableProps = [
  'Sala',
  'Setor',
  'Capacidade',
  'Bloco',
  'Piso',
  'Ações',
]

export function TableInfoRooms({ session }: TableInfoRoomsProps) {
  const [roomsList, setRoomsList] = useState<Room[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const token = session.token

  async function fetchGetRooms() {
    try {
      setIsLoading(true)
      const rooms = await getRooms(token)
      setRoomsList(rooms)
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteRoom() {
    if (roomToDelete) {
      try {
        await deleteRoom(roomToDelete.id, token)
        setRoomsList((prevRoomsList) =>
          prevRoomsList.filter((room) => room.id !== roomToDelete.id),
        )
        setMessage('Sala deletada com sucesso!')
        setIsModalOpen(false)
        setIsError(false)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Erro ao deletar sala:', error)
          setMessage(error.response?.data.message)
          setIsModalOpen(false)
          setIsError(true)
        }
      }
    }
  }

  function openModal(room: Room) {
    setRoomToDelete(room)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setRoomToDelete(null)
  }

  function closeMessage() {
    setMessage('')
  }

  async function handleRoomAdded(newRoom: Room) {
    setRoomsList((prevRoomsList) => [...prevRoomsList, newRoom])
  }

  useEffect(() => {
    fetchGetRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {message && (
        <div className="flex justify-between items-center my-5 uppercase font-bold text-xl text-blue-950">
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
      <RoomForm session={session} onRoomAdded={handleRoomAdded} />
      {isLoading ? (
        <table className="mt-4 table-zebra-zebra md:table border-collapse">
          <thead>
            <tr className="text-black text-center">
              {headerTableProps.map((header) => (
                <Th key={header} content={header} />
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {headerTableProps.map((key) => (
                <td key={key} className="border-2 border-black">
                  <div className="w-full flex items-center justify-center">
                    <p className="skeleton md:w-12 lg:w-20 h-4" />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : roomsList?.length === 0 ? (
        <div className="mt-4 text-center text-black">
          <p>Nenhuma sala encontrada.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="mt-4 table-zebra-zebra table border-collapse">
            <thead>
              <tr className="text-black text-center">
                {headerTableProps.map((header) => (
                  <Th key={header} content={header} />
                ))}
              </tr>
            </thead>
            <tbody>
              {roomsList?.map((room) => (
                <tr key={room.id} className="text-black text-center">
                  <Td content={room.number} />
                  <Td content={room.sector} />
                  <Td content={room.capacity ? String(room.capacity) : ''} />
                  <Td content={room.block} />
                  <Td content={room.floor} />
                  <td className="border-black border-2">
                    <Button
                      isButtonDisabled={false}
                      type="button"
                      name="delete"
                      className="bg-red-700 hover:text-red-700 hover:border-red-700 w-full"
                      onClick={() => openModal(room)}
                    >
                      <MdDeleteForever size={24} className="m-auto" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteRoom}
        message="Tem certeza que deseja excluir esta sala?"
      />
    </>
  )
}
