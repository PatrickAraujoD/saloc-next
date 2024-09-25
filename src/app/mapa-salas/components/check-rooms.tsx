// CheckRooms.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/button'
import { FormMapRoom } from './form-map-rooms'
import { TableMapRoom } from './table-map-room'
import { Room, SessionProps } from '@/types'
import usePdfGenerator from '@/hooks/use-pdf-generator'

interface ResponseTableMap {
  room: Room
  name: string
  schedule: string
}

interface CheckRoomsProps {
  session: SessionProps
}

export function CheckRooms({ session }: CheckRoomsProps) {
  const { generatePdfReport, selectRoomRef, selectSemesterRef, tableRef } =
    usePdfGenerator()
  const [tableData, setTableData] = useState<ResponseTableMap[]>([])

  const handleSetAllocateClasses = (data: ResponseTableMap[]) => {
    setTableData(data)
  }

  return (
    <main className="flex-grow p-6 md:p-20">
      <section>
        <h1 className="uppercase font-extrabold">Mapa de Sala</h1>
        <Button
          type="submit"
          title="Baixar Relatório"
          isButtonDisabled={false}
          className="mt-4 w-36 sm:w-52 text-xs sm:text-sm"
          onClick={() => {
            generatePdfReport('room')
          }}
        />
        <FormMapRoom
          handleSetAllocateClasses={handleSetAllocateClasses}
          selectRoomRef={selectRoomRef}
          selectPeriodRef={selectSemesterRef}
          session={session}
        />
      </section>
      <TableMapRoom data={tableData} tableRef={tableRef} />
    </main>
  )
}
