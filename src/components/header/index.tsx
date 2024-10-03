'use client'
import Link from 'next/link'
import { LetterSpan } from './components/letter-span'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { GrFormPreviousLink } from 'react-icons/gr'
import { Button } from '../button'
import { IoMdLogIn, IoMdLogOut } from 'react-icons/io'
import { SessionProps } from '@/types'
import { signOut } from 'next-auth/react'

interface HeaderProps {
  session: SessionProps | null
}

export function Header({ session }: HeaderProps) {
  const router = useRouter()
  const [isInternalNavigation, setIsInternalNavigation] = useState(true)
  const isLoggedIn = session !== null
  const pathname = usePathname()
  const isLoginPage = pathname === '/home'

  async function logout() {
    await signOut({ redirect: false })
    window.location.reload()
  }

  useEffect(() => {
    const referrer = document.referrer
    if (referrer && !referrer.includes(window.location.origin)) {
      setIsInternalNavigation(false)
    }
  }, [])

  const handleBack = () => {
    if (isInternalNavigation) {
      router.back()
    }
  }

  return (
    <header className="flex justify-between px-6 md:px-20 py-10 items-center bg-blue-950 text-white">
      <div className="flex flex-col gap-2">
        <Link href="/home" className="flex gap-2 md:gap-4">
          <LetterSpan letter="s" />
          <LetterSpan letter="a" />
          <LetterSpan letter="l" />
          <LetterSpan letter="o" />
          <LetterSpan letter="c" />
        </Link>
        <span className="uppercase text-xs md:text-lg font-bold">
          alocação de salas
        </span>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="hidden md:block uppercase text-2xl md:text-4xl font-bold">
          ccet
        </h2>
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={handleBack}
            title="voltar"
            className="flex items-center justify-center bg-white w-6 h-6 md:w-8 md:h-8 rounded-md hover:bg-blue-950 text-blue-950 hover:text-white border-2 border-transparent hover:border-white transition duration-300 ease-in-out"
          >
            <GrFormPreviousLink size={20} />
          </button>

          <Link
            href="/home"
            title="página inicial"
            className="hidden md:flex items-center justify-center bg-white w-6 h-6 md:w-8 md:h-8 rounded-md hover:bg-blue-950 text-blue-950 hover:text-white border-2 border-transparent hover:border-white transition duration-300 ease-in-out"
          >
            <FaHome size={20} />
          </Link>

          {isLoginPage &&
            (isLoggedIn ? (
              <Button
                isButtonDisabled={false}
                onClick={logout}
                className="flex items-center justify-center bg-white w-6 h-6 md:w-8 md:h-8 rounded-md hover:bg-blue-950 border-2 border-transparent hover:border-white transition duration-300 ease-in-out"
              >
                <IoMdLogOut
                  size={20}
                  className="text-blue-950 hover:text-white"
                  title="sair"
                />
              </Button>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center bg-white w-6 h-6 md:w-8 md:h-8 rounded-md hover:bg-blue-950 text-blue-950 hover:text-white border-2 border-transparent hover:border-white transition duration-300 ease-in-out"
              >
                <IoMdLogIn size={20} title="entrar" />
              </Link>
            ))}
        </div>
      </div>
    </header>
  )
}
