import { Table } from '@/components/table'

export function TableInfo() {
  return (
    <main className="flex-grow py-10 px-2 xl:px-16">
      <section>
        <h2 className="uppercase font-semibold mb-4">turmas sem salas</h2>
        <Table acao={true} />
      </section>
      <section>
        <h2 className="uppercase font-semibold mb-4">turmas com salas</h2>
        <Table acao={true} />
      </section>
    </main>
  )
}
