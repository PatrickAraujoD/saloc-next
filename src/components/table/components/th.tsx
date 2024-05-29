interface ThProps {
  content: string
}

export function Th({ content }: ThProps) {
  return <th className="border-2 border-black uppercase">{content}</th>
}
