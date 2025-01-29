'use client'
import { getSectores } from '@/services/http'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Select } from './select'
import { Button } from './button'
import { SelectedClassesProps } from './classroom-list'

interface SendAllRequestProps {
  isOpen: boolean
  onClose: () => void
  setIsCheckedAll: (checked: boolean) => void
  onConfirm: (classes: SelectedClassesProps[], destination: number) => void
  message: string
  classes: SelectedClassesProps[]
  token?: string
}

export function SendAllRequest({
  isOpen,
  onClose,
  setIsCheckedAll,
  onConfirm,
  message,
  classes,
  token,
}: SendAllRequestProps) {
  const [sectores, setSectores] = useState([])
  const [destination, setDestination] = useState(0)

  useEffect(() => {
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

    handleSearchSectores()
  }, [token])

  function handleCaptureDestination(event: ChangeEvent<HTMLSelectElement>) {
    setDestination(Number(event.target.value))
  }

  function handleOnConfirm() {
    onConfirm(classes, destination)
    setIsCheckedAll(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col bg-white p-4 rounded-lg w-96 h-64 text-center justify-center items-center gap-y-2 ">
        {message}
        <Select
          nameLabel="Setor"
          options={sectores}
          className="w-full text-start"
          onChange={handleCaptureDestination}
        />
        <div className="flex justify-between mt-6">
          <Button
            isButtonDisabled={false}
            title="fechar"
            type="button"
            onClick={onClose}
            className="uppercase mr-2 bg-gray-400 p-2 rounded font-light hover:text-gray-400 hover:border-gray-400"
          />
          <Button
            isButtonDisabled={false}
            type="button"
            title="confirmar"
            className="uppercase bg-blue-950 text-white p-2 rounded font-light"
            onClick={() => handleOnConfirm()}
          />
        </div>
      </div>
    </div>
  )
}
