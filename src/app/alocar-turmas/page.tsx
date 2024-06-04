import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Select } from '@/components/select'
import { Td } from '@/components/td'
import { Th } from '@/components/th'

export default function AlocarTurmas() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-10">
        <section>
          <h2 className="font-bold uppercase mb-2">informações</h2>
          <div className="border-2 border-black p-10 grid grid-cols-2 gap-y-2 w-full">
            <p className="justify-self-start">código: DEIN0237</p>
            <p className="justify-self-end">curso: ciência da computação</p>
            <p className="justify-self-start">departamento: deinf</p>
            <p className="justify-self-end">disciplina: computação móvel</p>
            <p className="justify-self-start">período: 2023.2</p>
            <p className="justify-self-end">docente: Geraldo braz júnior</p>
          </div>
        </section>
        <section>
          <h2 className="uppercase font-bold mt-10">alocar turma</h2>
          <div className="relative border-black border-2 p-10">
            <div>
              <div className="flex">
                <Select
                  nameLabel="horario"
                  options={['2T45']}
                  className="flex justify-center items-center w-2/4 mr-96"
                  name="horario"
                />
                <Select
                  nameLabel="sala"
                  options={['2T45']}
                  className="flex items-center justify-center w-2/4"
                  name="sala"
                />
              </div>
              <Button
                isButtonDisabled={false}
                title="alocar"
                type="submit"
                className="w-56 absolute mt-2 right-10"
              />
            </div>
            <div className="mt-20 w-full ">
              <table className="w-full text-center uppercase font-semibold">
                <thead>
                  <tr>
                    <Th content="horario" />
                    <Th content="sala" />
                    <Th content="ações" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td content="2T45" />
                    <Td content="sala 201 - b7 - ccet" />
                    <td className="border-black border-2">
                      <Button
                        isButtonDisabled={false}
                        title="deletar"
                        type="submit"
                        className="w-24 y-10 right-0 bg-red-700 hover:text-red-700 hover:border-red-700 mt-0"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
