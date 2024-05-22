import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonDisabled: boolean
  className?: string
  title: string
}

export function Button({
  isButtonDisabled,
  type,
  title,
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`bg-blue-950 text-white font-bold uppercase w-full p-2 rounded-md border-transparent border-2 hover:border-blue-950 hover:bg-transparent transition-colors hover:text-blue-950 ${className}`}
      {...buttonProps}
    >
      {title}
    </button>
  )
}
