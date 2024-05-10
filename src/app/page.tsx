'use client'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Select } from '@/components/select'
import { TableList } from '@/components/table-list'
import { ChangeEvent, useState } from 'react'

export default function Home() {
  const [nameCourse, setNameCourse] = useState('--')
  const [period, setPeriod] = useState('--')

  function captureValueCourse(event: ChangeEvent<HTMLSelectElement>) {
    setNameCourse(event.target.value)
  }

  function captureValuePeriod(event: ChangeEvent<HTMLSelectElement>) {
    setPeriod(event.target.value)
  }

  const isButtonDisabled = nameCourse === '--' || period === '--'

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="px-6 md:px-20 flex-grow">
        <section></section>
        <form action="" className="mb-10">
          <Select
            name="course"
            nameLabel="curso"
            onChange={captureValueCourse}
            options={['--', 'ciência da computação', 'engenharia quimica']}
          />
          <Select
            name="period"
            nameLabel="periodo"
            onChange={captureValuePeriod}
            options={['--', '2024.2', '2035.1']}
          />
          <Select
            name="teacher"
            nameLabel="docente"
            options={[
              '--',
              'geraldo braz júnior',
              'carlos de sales soares neto',
            ]}
          />
          <Select
            name="discipline"
            nameLabel="disciplina"
            options={[
              '--',
              'estrutura de dados I',
              'linguagem de programação II',
            ]}
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full bg-blue-950 h-10 text-white uppercase font-bold mt-4 rounded-md hover:bg-blue-950 hover:ease-in duration-200 ${isButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            consultar
          </button>
        </form>
        <div className="overflow-x-auto mb-10 ">
          <div className="lg:hidden border-blue-950 border-b-4 py-4 rounded-sm  border-t-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">periodo</p>
              <p>1°</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold">nome da disciplina</p>
              <p className="uppercase">química geral</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold">código da disciplina</p>
              <p className="uppercase">dequo105</p>
            </div>
          </div>
          <TableList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
