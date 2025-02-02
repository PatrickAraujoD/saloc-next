import { Button } from '@/components/button'
import { Td } from '@/components/td'
import { Th } from '@/components/th'
import { ClassInfoTable as ClassInfoTableType } from '@/types'
import { MdDeleteForever } from 'react-icons/md'

interface ClassInfoTableProps {
  classInfoTable: ClassInfoTableType[]
  openModal: (value: ClassInfoTableType) => void
}

export function ClassInfoTableAllocate({
  classInfoTable,
  openModal,
}: ClassInfoTableProps) {
  return (
    <div className="mt-20 w-full overflow-auto">
      {classInfoTable?.length > 0 && (
        <table className="w-full text-center uppercase font-semibold">
          <thead>
            <tr>
              <Th content="horario" />
              <Th content="sala" />
              <Th content="ações" />
            </tr>
          </thead>
          <tbody>
            {classInfoTable.map((classInfo) => (
              <tr key={classInfo.id}>
                <Td content={classInfo.schedule} />
                <Td
                  content={`${classInfo.room.number} - ${classInfo.room.sector} - ${classInfo.room.sector === 'CCET' ? 'B' + classInfo.room.block : classInfo.room.block}`}
                />
                <td className="border-2 border-black text-xs xl:text-sm w-56 text-center">
                  <Button
                    isButtonDisabled={false}
                    type="button"
                    className="w-28 h-10 bg-red-700 hover:text-red-700 hover:border-red-700 mt-0"
                    onClick={() => openModal(classInfo)}
                  >
                    <MdDeleteForever size={24} className="m-auto" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
