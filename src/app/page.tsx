'use client'
import { Loading } from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/home')
  })

  return (
    <div className="flex-1">
      <Loading description="quase lá! estamos preparando tudo para você." />
    </div>
  )
}
