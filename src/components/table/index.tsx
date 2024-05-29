import { Td } from './components/td'
import { Th } from './components/th'

export function Table() {
  return (
    <div className="overflow-x-auto mb-10 ">
      <table className="hidden lg:table border-collapse">
        <thead>
          <tr className="text-black text-center">
            <Th content="periodo" />
            <Th content="código" />
            <Th content="nome da disciplina" />
            <Th content="departamento" />
            <Th content="numero da turma" />
            <Th content="horario" />
            <Th content="quantidade de alunos" />
            <Th content="docente" />
            <Th content="local" />
          </tr>
        </thead>
        <tbody>
          <tr className="text-black text-center">
            <Td content="1°" />
            <Td content="DEIN0040" />
            <Td content="ALGORITMOS I" />
            <Td content="DEINF" />
            <Td content="2" />
            <Td content="24T23" />
            <Td content="60" />
            <Td content="CARLOS DE SALLES SOARES NETO" />
            <Td content="LAB 3 - B5 - CCET" />
          </tr>
        </tbody>
      </table>
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
    </div>
  )
}
