'use server'
import { api } from '../api'

type AllocateAutomaticProps = {
  idPeriod: number | null
  idSector?: number
  token?: string
}
export async function allocateAutomatic({
  idPeriod,
  idSector,
  token,
}: AllocateAutomaticProps) {
  const response = await api.post(
    'class/allocate/automatic',
    {
      id_period: idPeriod,
      id_sector: idSector,
    },
    {
      headers: { Authorization: 'Bearer ' + token },
    },
  )
  return response.data
}
