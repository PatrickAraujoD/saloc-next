import { GrFormNext, GrFormPrevious } from 'react-icons/gr'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const disabledPrevious = currentPage === 1
  const disabledNext = currentPage === totalPages
  return (
    <div className="join flex justify-center mt-4">
      <button
        className={`join-item w-10 bg-blue-950 text-white p-2 ${disabledPrevious ? 'opacity-80' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabledPrevious}
      >
        <GrFormPrevious size={24} />
      </button>

      <button
        className={`join-item w-10 btn-active bg-gray-400 text-white font-semibold text-lg'`}
        onClick={() => onPageChange(currentPage)}
      >
        {currentPage}
      </button>

      <button
        className={`join-item w-10 bg-blue-950 text-white p-2 ${disabledNext ? 'opacity-80' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabledNext}
      >
        <GrFormNext size={24} />
      </button>
    </div>
  )
}
