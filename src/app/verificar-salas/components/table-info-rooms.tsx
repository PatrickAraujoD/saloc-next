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

interface TableInfoRoomsProps {
  session: SessionProps
}

export function TableInfoRooms({ session }: TableInfoRoomsProps) {
  const [roomsList, setRoomsList] = useState<Room[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const token = session.token

  async function fetchGetRooms() {
    try {
      const rooms = await getRooms(token)
      setRoomsList(rooms)
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
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
      {roomsList?.length === 0 ? (
        <h2 className="mt-10 text-center font-bold uppercase text-lg ">
          nenhuma sala encontrada!
        </h2>
      ) : (
        <div>
          <RoomForm session={session} onRoomAdded={handleRoomAdded} />
          <table className="mt-4 hidden lg:table border-collapse">
            <thead>
              <tr className="text-black text-center">
                <Th content="Sala" />
                <Th content="Setor" />
                <Th content="Capacidade" />
                <Th content="Bloco" />
                <Th content="Piso" />
                <Th content="Ações" />
              </tr>
            </thead>
            <tbody>
              {roomsList?.map((room) => (
                <tr className="text-black text-center" key={room.id}>
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
                      title="Excluir"
                      className="bg-red-700 hover:text-red-700 hover:border-red-700"
                      onClick={() => openModal(room)}
                    />
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
