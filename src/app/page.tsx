import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Select } from '@/components/select'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="px-6 md:px-10 flex-grow">
        <section></section>
        <form action="">
          <Select name="course" nameLabel="curso" />
          <Select name="period" nameLabel="periodo" />
          <Select name="teacher" nameLabel="docente" />
          <Select name="discipline" nameLabel="disciplina" />
          <button
            type="submit"
            className="w-full bg-blue-900 h-10 text-white uppercase font-bold mt-4 rounded-md hover:bg-blue-950 hover:ease-in duration-200"
          >
            consultar
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
