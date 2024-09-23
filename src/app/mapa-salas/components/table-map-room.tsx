import { Td } from '@/components/td'
import { Th } from '@/components/th'
import { Room } from '@/types'
import React, { RefObject } from 'react'

interface ResponseTableMap {
  room: Room
  name: string
  schedule: string
}

interface TableMapRoomProps {
  data: ResponseTableMap[]
  tableRef?: RefObject<HTMLTableElement>
}

export function TableMapRoom({ data, tableRef }: TableMapRoomProps) {
  function findDiscipline(
    list: ResponseTableMap[],
    day: string,
    timeSlot: string,
    shift: string,
  ) {
    for (const item of list) {
      const discipline = item.name
      const schedule = item.schedule
      const results = parseSchedule(schedule)
      for (const result of results) {
        if (Array.isArray(result)) {
          const [days, timeSlots, shifts] = result
          if (
            days.includes(day) &&
            shifts.includes(shift) &&
            timeSlots.includes(Number(timeSlot))
          ) {
            return discipline
          }
        }
      }
    }
    return ''
  }

  function parseSchedule(schedule: string) {
    const regex = /(\d+)([MTN])(\d+)/g
    const results: Array<[string[], number[], string[]]> = []
    let match
    while ((match = regex.exec(schedule)) !== null) {
      const days = match[1].split('')
      const timeSlots = match[3].split('').map(Number)
      const shifts = match[2].split('')
      results.push([days, timeSlots, shifts])
    }
    return results
  }

  const dias = ['2', '3', '4', '5', '6', '7']

  const horarios: [number, number, number, number, string, string][] = [
    [7, 30, 8, 20, 'M', '1'],
    [8, 20, 9, 10, 'M', '2'],
    [9, 20, 10, 10, 'M', '3'],
    [10, 10, 11, 0, 'M', '4'],
    [11, 10, 12, 0, 'M', '5'],
    [12, 0, 12, 50, 'M', '6'],
    [13, 10, 14, 0, 'T', '1'],
    [14, 0, 14, 50, 'T', '2'],
    [14, 50, 15, 40, 'T', '3'],
    [15, 50, 16, 40, 'T', '4'],
    [16, 40, 17, 30, 'T', '5'],
    [17, 40, 18, 30, 'T', '6'],
    [18, 30, 19, 20, 'N', '1'],
    [19, 20, 20, 10, 'N', '2'],
    [20, 20, 21, 10, 'N', '3'],
    [21, 10, 22, 0, 'N', '4'],
  ]

  return (
    <div>
      {data.length > 0 && (
        <section className="flex mt-10 items-center justify-end">
          <h2 className="capitalize font-bold mr-2 sm:mr-10 text-xs sm:text-sm">
            informações:
          </h2>
          <div className="flex flex-row p-4 justify-between flex-wrap gap-y-2 border-black border-2 max-w-80">
            <p className="capitalize text-xs sm:text-sm ">
              <span className="font-bold">bloco:</span> {data[0].room.block}
            </p>
            <p className="capitalize text-xs sm:text-sm ">
              <span className="font-bold">andar:</span> {data[0].room.floor}
            </p>
            <p className="capitalize text-xs sm:text-sm ">
              <span className="font-bold">capacidade:</span>{' '}
              {data[0].room.capacity} discentes
            </p>
          </div>
        </section>
      )}

      <table className="table mt-10" ref={tableRef}>
        <thead>
          <tr className="text-center text-black">
            <Th content="HORÁRIO" />
            <Th content="SEGUNDO" />
            <Th content="TERÇA" />
            <Th content="QUARTA" />
            <Th content="QUINTA" />
            <Th content="SEXTA" />
            <Th content="SÁBADO" />
          </tr>
        </thead>
        <tbody id="tabelas-disciplinas">
          {horarios.map((horario, index) => {
            const [startHour, startMinute, endHour, endMinute, turno, slot] =
              horario
            const timeRange = `${startHour}:${startMinute < 10 ? `0${startMinute}` : startMinute} ${endHour}:${endMinute < 10 ? `0${endMinute}` : endMinute}`

            return (
              <tr key={index}>
                <Td content={timeRange} />
                {dias.map((dia, diaIndex) => {
                  const disciplinaEncontrada = findDiscipline(
                    data,
                    dia,
                    slot,
                    turno,
                  )

                  return (
                    <Td
                      key={diaIndex}
                      content={`${disciplinaEncontrada || ''}`}
                    />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
