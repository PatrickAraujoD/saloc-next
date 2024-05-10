import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  nameLabel: string
}

export function Select({ nameLabel, name, ...select }: SelectProps) {
  return (
    <div className="mt-4">
      <label htmlFor={name} className="uppercase font-medium">
        {nameLabel}:
      </label>
      <select
        name={name}
        id={name}
        {...select}
        className="border-2 border-black w-full h-10 px-4 rounded-md mt-2"
      >
        <option value="ciência da computação">ciência da computação</option>
      </select>
    </div>
  )
}
