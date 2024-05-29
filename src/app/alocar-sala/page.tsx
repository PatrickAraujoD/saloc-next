import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Table } from '@/components/table'

export default function AlocarSala() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10 px-2 xl:px-16">
        <section>
          <h2 className="uppercase font-semibold mb-4">turmas sem salas</h2>
          <Table />
        </section>
        <section>
          <h2 className="uppercase font-semibold mb-4">turmas com salas</h2>
          <Table />
        </section>
      </main>
      <Footer />
    </div>
  )
}
