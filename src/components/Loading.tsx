type Props = {
  description: string
}

export function Loading({ description }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="h-80 w-96 bg-white flex flex-col items-center justify-center rounded-lg py-10 px-4">
        <p className="text-center text-xl text-blue-950 capitalize">
          {description}
        </p>
        <div className="flex-1 h-full w-full flex items-center justify-center">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      </div>
    </div>
  )
}
