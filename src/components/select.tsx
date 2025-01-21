import { ChangeEvent, RefObject, SelectHTMLAttributes } from 'react'

interface BaseOption {
  id?: number | string
  name?: string
  period?: string
  type?: string
  number?: string
  sector?: string
  block?: string
  schedule?: string
  schedule_complet?: boolean
  capacity?: number
}

interface SelectProps<T extends BaseOption>
  extends SelectHTMLAttributes<HTMLSelectElement> {
  nameLabel: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  options?: T[]
  className?: string
  selectRef?: RefObject<HTMLSelectElement>
  showInput?: boolean
}

export function Select<T extends BaseOption>({
  nameLabel,
  options = [],
  name,
  onChange,
  className,
  selectRef,
  showInput,
  ...select
}: SelectProps<T>) {
  const renderOptions = () => {
    return (
      <>
        <option value={0}>--</option>
        {showInput && (
          <option value={-1} className="uppercase">
            outra disciplina
          </option>
        )}

        {Array.isArray(options) &&
          options.map((option) => {
            if (option.type === 'room') {
              return (
                <option key={option.id} value={option.id?.toString()}>
                  {`${option.number} - ${option.sector} - ${option.sector === 'CCET' ? 'B' + option.block : option.block} - ${option.capacity ? option.capacity : 'Sem informação'}`}
                </option>
              )
            } else if (option.type === 'schedule') {
              return (
                <option key={option.schedule} value={option.schedule || ''}>
                  {`${option.schedule_complet ? option.schedule + ' (horário completo)' : option.schedule}`}
                </option>
              )
            }
            return (
              <option key={option.id} value={option.id?.toString()}>
                {option.name ? option.name : option.period}
              </option>
            )
          })}
      </>
    )
  }

  return (
    <div className={`mt-4 ${className}`}>
      <label
        htmlFor={name}
        className={`uppercase text-start font-semibold ${className ? 'mr-2' : 'mr-0'}`}
      >
        {nameLabel}:
      </label>
      <select
        name={name}
        id={name}
        onChange={onChange}
        ref={selectRef}
        {...select}
        className="border-2 border-black w-full h-10 rounded-md mt-2"
      >
        {renderOptions()}
      </select>
    </div>
  )
}
