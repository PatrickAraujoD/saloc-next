export function TableList() {
  return (
    <table className="hidden lg:table border-collapse">
      <thead>
        <tr className="text-black text-center">
          <th className="border-2 border-black">periodo</th>
          <th className="border-2 border-black">código</th>
          <th className="border-2 border-black">nome da disciplina</th>
          <th className="border-2 border-black">departamento</th>
          <th className="border-2 border-black">numero da turma</th>
          <th className="border-2 border-black">horario</th>
          <th className="border-2 border-black">quantidade de alunos</th>
          <th className="border-2 border-black">docente</th>
          <th className="border-2 border-black">local</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-black text-center">
          <td className="border-2 border-black text-xs xl:text-sm">1°</td>
          <td className="border-2 border-black text-xs xl:text-sm">DEIN0040</td>
          <td className="border-2 border-black text-xs xl:text-sm">
            ALGORITMOS I
          </td>
          <td className="border-2 border-black text-xs xl:text-sm">DEINF</td>
          <td className="border-2 border-black text-xs xl:text-sm">2</td>
          <td className="border-2 border-black text-xs xl:text-sm">24T23</td>
          <td className="border-2 border-black text-xs xl:text-sm">60</td>
          <td className="border-2 border-black text-xs xl:text-sm">
            CARLOS DE SALLES SOARES NETO
          </td>
          <td className="border-2 border-black text-xs xl:text-sm">
            LAB 3 - B5 - CCET
          </td>
        </tr>
      </tbody>
    </table>
  )
}
