import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  nameLabel: string
}

export function Input({ nameLabel, name, ...input }: InputProps) {
  return (
    <div className="mt-4 space-y-1 w-full">
      <label htmlFor={name} className="uppercase font-semibold text-blue-950">
        {nameLabel}
      </label>
      <input
        name={name}
        id={name}
        className="w-full bg-transparent border-2 border-blue-950 pl-2 py-2 rounded-md placeholder:capitalize"
        {...input}
      />
    </div>
  )
}
