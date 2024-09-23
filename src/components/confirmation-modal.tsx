import React from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-white p-4 rounded-lg w-96 h-44 text-center justify-center items-center gap-y-4">
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="uppercase mr-2 bg-gray-200 p-2 rounded"
          >
            cancelar
          </button>
          <button
            onClick={onConfirm}
            className="uppercase bg-red-700 text-white p-2 rounded"
          >
            confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
