interface LetterSpanProps {
  letter: string
}

export function LetterSpan({ letter }: LetterSpanProps) {
  return (
    <span className="bg-white h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-xl md:text-2xl font-bold uppercase">
      {letter}
    </span>
  )
}
