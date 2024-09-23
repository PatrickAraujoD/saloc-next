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
        <div className="flex">
          <Select
            nameLabel="horario"
            options={listSchedule}
            className="flex justify-center items-center w-2/4 mr-96"
            name="horario"
            onChange={onScheduleChange}
            value={schedule}
          />
          <Select
            nameLabel="sala"
            options={listRooms}
            className="flex items-center justify-center w-2/4"
            name="sala"
            onChange={onRoomChange}
            value={valueRoom}
          />
        </div>
        <Button
          isButtonDisabled={isButtonDisabled}
          title="alocar"
          type="submit"
          className={`w-28 absolute mt-2 flex items-center justify-center right-10 ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
      </form>
    </section>
  )
}
