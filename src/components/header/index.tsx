import { LetterSpan } from './components/letter-span'

export function Header() {
  return (
    <header className="flex justify-between px-6 md:px-20 py-10 items-center bg-blue-900 text-white">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 md:gap-4">
          <LetterSpan letter="s" />
          <LetterSpan letter="a" />
          <LetterSpan letter="l" />
          <LetterSpan letter="o" />
          <LetterSpan letter="c" />
        </div>

        <span className="uppercase text-xs md:text-lg font-bold">
          alocação de salas
        </span>
      </div>
      <div>
        <h2 className="uppercase text-2xl md:text-4xl font-bold">ccet</h2>
      </div>
    </header>
  )
}
