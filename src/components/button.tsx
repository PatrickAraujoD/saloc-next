import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonDisabled: boolean
  name: string
}

export function Button({
  isButtonDisabled,
  className,
  type,
  title,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={className}
      {...buttonProps}
    >
      {title}
    </button>
  )
}
