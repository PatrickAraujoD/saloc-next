import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { Td } from '@/components/td'
import { Th } from '@/components/th'

export default function CheckRooms() {
  return (
    <main className="flex-grow p-10">
      <section>
        <h1 className="uppercase font-extrabold">mapa de sala</h1>
        <Button
          type="submit"
          title="baixar relátorio"
          isButtonDisabled={false}
          className="mt-4 w-36 sm:w-52 text-xs sm:text-sm"
        />
        <Select nameLabel="sala" name="class" options={['101 - b7 - ccet']} />
        <Select
          nameLabel="periodo"
          name="period"
          options={['101 - b7 - ccet']}
        />
      </section>
      <section className="flex mt-10 items-center justify-end">
        <h2 className="capitalize font-bold mr-2 sm:mr-10 text-xs sm:text-sm">
          informações:
        </h2>
        <div className="flex flex-row p-4 justify-between flex-wrap gap-y-2 border-black border-2 max-w-80">
          <p className="capitalize text-xs sm:text-sm ">
            <span className="font-bold">bloco:</span> 9
          </p>
          <p className="capitalize text-xs sm:text-sm ">
            <span className="font-bold">andar:</span> terreo
          </p>
          <p className="capitalize text-xs sm:text-sm ">
            <span className="font-bold">capacidade:</span> 50 discentes
          </p>
        </div>
      </section>
      <section className="mt-10">
        <table className="hidden md:table border-collapse">
          <thead>
            <tr className="text-black text-center">
              <Th content="horario" />
              <Th content="seg" />
              <Th content="ter" />
              <Th content="qua" />
              <Th content="qui" />
              <Th content="sex" />
              <Th content="sab" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td content="7:40 8:20" />
              <Td content="Ondas eletrom" />
              <Td content="matematica aplicada" />
              <Td content="Ondas eletrom" />
              <Td content="matematica aplicada" />
              <Td content="tecnologia de materiais elétricos" />
              <Td content="" />
            </tr>
          </tbody>
        </table>
        <div className="md:hidden border-blue-950 border-b-4 py-4 rounded-sm  border-t-4">
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">horario</p>
            <p className="text-xs sm:text-sm">7:20 8:30</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">seg</p>
            <p className="text-xs sm:text-sm">Ondas eletrom</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">ter</p>
            <p className="text-xs sm:text-sm">matematica aplicada</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">qua</p>
            <p className="text-xs sm:text-sm">Ondas eletrom</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">qui</p>
            <p className="text-xs sm:text-sm">matematica aplicada</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">sex</p>
            <p className="text-xs sm:text-sm">
              tecnologia de materiais elétricos
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold uppercase text-xs sm:text-sm">sab</p>
            <p></p>
          </div>
        </div>
      </section>
    </main>
  )
}
