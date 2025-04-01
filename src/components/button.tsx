import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isButtonDisabled: boolean
  className?: string
  title?: string
  isLoading?: boolean
  children?: React.ReactNode
  colorSpin?: 'red' | 'blue'
}

export function Button({
  isButtonDisabled,
  type,
  title,
  className,
  isLoading,
  children,
  colorSpin = 'blue',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`font-bold uppercase w-40 h-10 rounded-md hover:border-blue-950 hover:text-blue-950 border-2 text-white hover:bg-transparent transition-colors   ${isLoading ? `${colorSpin === 'blue' ? 'border-blue-950 text-blue-950' : 'border-red-700 text-red-700'} bg-white` : `bg-blue-950  border-transparent`} ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span
            className={`loading loading-spinner ${colorSpin === 'blue' ? 'text-blue-950' : 'text-red-700'} loading-sm mr-2`}
          ></span>
        </div>
      ) : (
        <p>{title}</p>
      )}
      {children}
    </button>
  )
}
