import { ChangeEvent, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  nameLabel: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  className: string
}

export function Select({
  nameLabel,
  options,
  name,
  onChange,
  className,
  ...select
}: SelectProps) {
  return (
    <div className="mt-4">
      <label htmlFor={name} className="uppercase font-semibold">
        {nameLabel}:
      </label>
      <select
        name={name}
        id={name}
        onChange={onChange}
        {...select}
        className={`border-2 border-black w-full h-10 rounded-md mt-2 ${className}`}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          )
        })}
      </select>
    </div>
  )
}
