import React from 'react'
import { Button } from './button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  isLoading: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  isLoading,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col bg-white p-4 rounded-lg w-96 h-44 text-center justify-center items-center gap-y-4">
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <Button
            isButtonDisabled={isLoading}
            onClick={onClose}
            title="cancelar"
            className="uppercase mr-2 bg-gray-500 p-2 rounded hover:border-gray-500 hover:text-gray-500"
          />
          <Button
            isButtonDisabled={isLoading}
            isLoading={isLoading}
            onClick={onConfirm}
            title="confirmar"
            colorSpin="red"
            className="uppercase bg-red-700 text-white p-2 rounded hover:border-red-700 hover:text-red-700"
          />
        </div>
      </div>
    </div>
  )
}
