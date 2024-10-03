import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonDisabled: boolean
  className?: string
  title?: string
  isLoading?: boolean
  children?: React.ReactNode
}

export function Button({
  isButtonDisabled,
  type,
  title,
  className,
  isLoading,
  children,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`font-bold uppercase w-40 h-10 rounded-md hover:border-blue-950 hover:text-blue-950 border-2 text-white hover:bg-transparent transition-colors   ${isLoading ? 'border-blue-950 text-blue-950 bg-white' : `bg-blue-950  border-transparent`} ${className}`}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner text-blue-950 loading-sm mr-2"></span>
        </div>
      ) : (
        <p>{title}</p>
      )}
      {children}
    </button>
  )
}
