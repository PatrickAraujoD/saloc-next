import { useEffect } from 'react'

type Props = {
  setMessage: (value: string) => void
  message: string
}

export function useAutoClearMessage({ setMessage, message }: Props) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('')
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [message, setMessage])
}
