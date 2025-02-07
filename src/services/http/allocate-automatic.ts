'use server'
import { AxiosError } from 'axios'
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
  try {
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
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.message || 'Falha ao importar dados do sigaa'
      return { error: errorMessage }
    }
  }
}
