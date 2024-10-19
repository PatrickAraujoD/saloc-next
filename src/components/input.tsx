import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  nameLabel?: string
  typeInput?: string
}

export function Input({ nameLabel, name, typeInput, ...input }: InputProps) {
  return (
    <div
      className={`${typeInput === 'checkbox' ? '' : 'space-y-1 mt-4 w-full text-start'} flex flex-col items-center w-full`}
    >
      <label
        htmlFor={name}
        className={`uppercase font-semibold text-blue-950 ${typeInput === 'checkbox' ? 'hidden' : 'text-start w-full'}`}
      >
        {nameLabel}
      </label>
      <input
        name={name}
        id={name}
        className={`${typeInput === 'checkbox' ? 'h-4' : 'bg-transparent border-2 border-blue-950 pl-2 py-2 rounded-md'} w-full`}
        {...input}
      />
    </div>
  )
}
