'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { SessionProps } from '@/types'
import { MdOutlineMenu } from 'react-icons/md'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

export interface MenuProps {
  session: SessionProps | null
  period: number | null
  valueCourse: number | null
  isButtonDisabled: boolean
  generatePdfReport?: (
    reportType: 'room' | 'course',
    providedCourse?: string,
  ) => void
  generatePdfClassSections?: () => void
}

export default function Menu({
  session,
  period,
  valueCourse,
  isButtonDisabled,
  generatePdfReport,
  generatePdfClassSections,
}: MenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  function redirecAllocateRoom() {
    if (session?.user.course) {
      const course = session.user.course.id

      router.push(`/listar-turmas?curso=${course}&periodo=${period}`)
      return
    }

    router.push(`/listar-turmas?curso=${valueCourse}&periodo=${period}`)
  }

  function redirecCheckRooms() {
    router.push(`/verificar-salas`)
  }

  function redirecMapOfRooms() {
    router.push(`/mapa-salas`)
  }

  function redirectClass() {
    router.push('/registrar-turma')
  }

  return (
    <section>
      <details
        className="dropdown w-full md:hidden mt-10"
        open={isOpen}
        onToggle={(e) => setIsOpen(e.currentTarget.open)}
      >
        <summary className="my-1 btn border-transparent border-0 bg-blue-950 text-white hover:bg-blue-950">
          {!isOpen ? <MdOutlineMenu size={24} /> : <IoClose size={24} />}
        </summary>
        <div className="p-10 z-[1] rounded-box w-full flex flex-col items-center bg-blue-950">
          <Button
            isButtonDisabled={isButtonDisabled}
            type="button"
            title="relatório"
            className="border-transparent w-full hover:text-white"
            onClick={() => {
              if (session?.user.sector.course && generatePdfClassSections) {
                generatePdfClassSections()
              } else {
                console.log('dsjdhsjd')
                if (generatePdfReport) {
                  if (session?.user.course) {
                    generatePdfReport('course', session?.user.course.name)
                  } else {
                    generatePdfReport('course')
                  }
                }
              }
            }}
          />
          {session && session.user.sector && (
            <>
              <Button
                isButtonDisabled={isButtonDisabled}
                title="alocar turmas"
                type="button"
                onClick={redirecAllocateRoom}
                className="border-transparent w-full hover:text-white"
              />
              <Button
                isButtonDisabled={false}
                title="mapa de sala"
                type="button"
                onClick={redirecMapOfRooms}
                className="border-transparent w-full hover:text-white"
              />
              <Button
                isButtonDisabled={false}
                title="verificar salas"
                type="button"
                onClick={redirecCheckRooms}
                className="border-transparent w-full hover:text-white"
              />
              <Button
                isButtonDisabled={false}
                title="adicionar turma"
                type="button"
                onClick={redirectClass}
                className="sm:h-16 xl:h-12 hover:text-white"
              />
            </>
          )}
          {session && session.user.isAdmin && (
            <>
              <Button
                isButtonDisabled={false}
                title="adicionar usuário"
                type="button"
                onClick={() => router.push(`/register`)}
                className="border-transparent w-full hover:text-white"
              />
              <Button
                isButtonDisabled={false}
                title="adicionar curso"
                type="button"
                onClick={() => router.push(`/registrar-curso`)}
                className="border-transparent w-full hover:text-white"
              />
              <Button
                isButtonDisabled={false}
                title="adicionar setor"
                type="button"
                onClick={() => router.push(`/registrar-setor`)}
                className="border-transparent w-full hover:text-white"
              />
            </>
          )}
        </div>
      </details>
      <div className="items-center mt-10 gap-4 hidden md:flex">
        <Button
          isButtonDisabled={isButtonDisabled}
          title="RELATÓRIO"
          type="button"
          className="sm:h-16 xl:h-12"
          onClick={() => {
            if (session?.user.sector.course && generatePdfClassSections) {
              generatePdfClassSections()
            } else {
              console.log('dsjdhsjd')
              if (generatePdfReport) {
                if (session?.user.course) {
                  generatePdfReport('course', session?.user.course.name)
                } else {
                  generatePdfReport('course')
                }
              }
            }
          }}
        />
        {session && session.user.sector && (
          <>
            <Button
              isButtonDisabled={isButtonDisabled}
              title="alocar turmas"
              type="button"
              onClick={redirecAllocateRoom}
              className="sm:h-16 xl:h-12 px-2"
            />
            <Button
              isButtonDisabled={false}
              title="mapa de sala"
              type="button"
              onClick={redirecMapOfRooms}
              className="sm:h-16 xl:h-12"
            />
            <Button
              isButtonDisabled={false}
              title="verificar salas"
              type="button"
              onClick={redirecCheckRooms}
              className="sm:h-16 xl:h-12 px-2"
            />
            <Button
              isButtonDisabled={false}
              title="adicionar turma"
              type="button"
              onClick={redirectClass}
              className="sm:h-16 xl:h-12 px-2"
            />
          </>
        )}
        {session && session.user.isAdmin && (
          <>
            <Button
              isButtonDisabled={false}
              title="adicionar usuário"
              type="button"
              onClick={() => router.push(`/register`)}
              className="sm:h-16 xl:h-12"
            />
            <Button
              isButtonDisabled={false}
              title="adicionar curso"
              type="button"
              onClick={() => router.push(`/registrar-curso`)}
              className="sm:h-16 xl:h-12 px-2"
            />
            <Button
              isButtonDisabled={false}
              title="adicionar setor"
              type="button"
              onClick={() => router.push(`/registrar-setor`)}
              className="sm:h-16 xl:h-12 px-2"
            />
          </>
        )}
      </div>
    </section>
  )
}
