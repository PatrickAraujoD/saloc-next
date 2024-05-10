export function Header() {
  return (
    <header className="flex justify-between px-6 md:px-20 py-10 items-center bg-blue-900 text-white">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 md:gap-4">
          <span className="bg-white h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-lg font-bold">
            S
          </span>
          <span className="bg-white h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-lg font-bold">
            A
          </span>
          <span className="bg-white h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-lg font-bold">
            L
          </span>
          <span className="bg-white  h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-lg font-bold">
            O
          </span>
          <span className="bg-white  h-6 w-6 md:h-10 md:w-10 text-blue-800 rounded-md flex items-center justify-center text-lg font-bold">
            C
          </span>
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
