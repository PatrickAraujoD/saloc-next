import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { ListSchedule, Room } from '@/types'
import { ChangeEvent, FormEvent } from 'react'

interface AllocateFormProps {
  listSchedule: ListSchedule[]
  listRooms: Room[]
  schedule: string
  valueRoom: number
  onScheduleChange: (event: ChangeEvent<HTMLSelectElement>) => Promise<void>
  onRoomChange: (event: ChangeEvent<HTMLSelectElement>) => Promise<void>
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  isButtonDisabled: boolean
}

export function AllocateForm({
  listSchedule,
  listRooms,
  schedule,
  valueRoom,
  onSubmit,
  isButtonDisabled,
  onScheduleChange,
  onRoomChange,
}: AllocateFormProps) {
  return (
    <section>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col w-full md:flex-row md:gap-x-20">
          <Select
            nameLabel="horario"
            options={listSchedule}
            className="flex flex-col justify-center w-full items-start lg:flex-row lg:items-center"
            name="horario"
            onChange={onScheduleChange}
            value={schedule}
          />
          <Select
            nameLabel="sala"
            options={listRooms}
            className="flex flex-col justify-center w-full items-start lg:flex-row lg:items-center"
            name="sala"
            onChange={onRoomChange}
            value={valueRoom}
          />
        </div>
        <Button
          isButtonDisabled={isButtonDisabled}
          title="alocar"
          type="submit"
          className={`w-full md:w-28 md:absolute mt-2 flex items-center justify-center right-10 ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
      </form>
    </section>
  )
}
