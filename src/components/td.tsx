interface TdProps {
  content: string
}

export function Td({ content }: TdProps) {
  return (
    <td className="border-2 border-black text-xs xl:text-sm w-56 text-center">
      {content}
    </td>
  )
}
