'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { SessionProps } from '@/types'
import { signOut } from 'next-auth/react'
import { MdOutlineMenu } from 'react-icons/md'
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

export interface MenuProps {
  session: SessionProps | null
  period: number | null
  valueCourse: number | null
  isButtonDisabled: boolean
  generatePdfReport: (
    reportType: 'room' | 'course',
    providedCourse?: string,
  ) => void
}

export default function Menu({
  session,
  period,
  valueCourse,
  isButtonDisabled,
  generatePdfReport,
}: MenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function logout() {
    await signOut({
      redirect: false,
    })

    router.replace('/')
    location.reload()
  }

  function redirectLogin() {
    router.push('/login')
  }

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
            colorTextBlack={true}
            className="bg-transparent border-transparent w-full"
            onClick={() => {
              if (session?.user.course) {
                generatePdfReport('course', session?.user.course.name)
              } else {
                generatePdfReport('course')
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
                colorTextBlack={true}
                className="bg-transparent border-transparent w-full"
              />
              <Button
                isButtonDisabled={false}
                title="mapa de sala"
                type="button"
                colorTextBlack={true}
                onClick={redirecMapOfRooms}
                className="bg-transparent border-transparent w-full"
              />
              <Button
                isButtonDisabled={false}
                title="verificar salas"
                type="button"
                onClick={redirecCheckRooms}
                colorTextBlack={true}
                className="bg-transparent border-transparent w-full"
              />
            </>
          )}
          {session && (
            <Button
              isButtonDisabled={false}
              title="sair"
              type="button"
              onClick={logout}
              colorTextBlack={true}
              className="bg-transparent border-transparent w-full"
            />
          )}
          {session && session.user.isAdmin && (
            <>
              <Button
                isButtonDisabled={false}
                title="adicionar usuário"
                type="button"
                colorTextBlack={true}
                onClick={() => router.push(`/register`)}
                className="bg-transparent border-transparent w-full"
              />
              <Button
                isButtonDisabled={false}
                title="adicionar curso"
                type="button"
                colorTextBlack={true}
                onClick={() => router.push(`/registrar-curso`)}
                className="bg-transparent border-transparent w-full"
              />
              <Button
                isButtonDisabled={false}
                title="adicionar setor"
                type="button"
                colorTextBlack={true}
                onClick={() => router.push(`/registrar-setor`)}
                className="bg-transparent border-transparent w-full"
              />
            </>
          )}
          {!session && (
            <Button
              isButtonDisabled={false}
              title="login"
              type="button"
              colorTextBlack={true}
              onClick={redirectLogin}
              className="bg-transparent w-full"
            />
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
            if (session?.user.course) {
              generatePdfReport('course', session?.user.course.name)
            } else {
              generatePdfReport('course')
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
          </>
        )}
        {session && (
          <Button
            isButtonDisabled={false}
            title="sair"
            type="button"
            onClick={logout}
            className="sm:h-16 xl:h-12"
          />
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
        {!session && (
          <Button
            isButtonDisabled={false}
            title="login"
            type="button"
            onClick={redirectLogin}
            className="sm:h-16 xl:h-12"
          />
        )}
      </div>
    </section>
  )
}
