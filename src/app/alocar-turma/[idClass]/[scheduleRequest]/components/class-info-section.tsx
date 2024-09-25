import { Class } from '@/types'

interface ClassInfoSectionProps {
  classInfo?: Class | null
}

export function ClassInfoSection({ classInfo }: ClassInfoSectionProps) {
  return (
    <section>
      {!classInfo ? (
        <div className="flex border-2 border-black p-10 w-full flex-col md:flex-row justify-between gap-y-3 md:gap-y-0">
          <div className="flex gap-y-2 flex-col">
            <p className="uppercase skeleton w-64 h-6"></p>
            <p className="uppercase skeleton w-64 h-6"></p>
            <p className="uppercase skeleton w-64 h-6"></p>
            <p className="uppercase skeleton w-64 h-6"></p>
          </div>
          <div className="flex gap-y-3 flex-col">
            <p className="uppercase skeleton w-64 h-6"></p>
            <p className="uppercase skeleton w-64 h-6"></p>
            <p className="uppercase skeleton w-64 h-6"></p>
          </div>
        </div>
      ) : (
        <div className="flex border-2 border-black p-10 w-full flex-col md:flex-row text-xs lg:text-lg justify-between">
          <div className="flex gap-y-3 mb-3 md:mb-0 flex-col">
            <p className="uppercase">código: {classInfo.discipline?.code}</p>
            <p className="uppercase">curso: {classInfo.course?.name}</p>
            <p className="uppercase">
              departamento: {classInfo.discipline?.departament}
            </p>
            <p className="uppercase">
              disciplina: {classInfo.discipline?.name}
            </p>
          </div>
          <div className="flex gap-y-3 flex-col">
            <p className="uppercase">
              período: {classInfo.period?.year}.{classInfo.period?.semester}
            </p>
            <p className="uppercase">
              Docente:{' '}
              {classInfo.teachers?.map((teacher) => teacher.name).join(' / ')}
            </p>
            <p className="uppercase">horário: {classInfo.classSchedule}</p>
          </div>
        </div>
      )}
    </section>
  )
}
