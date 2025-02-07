'use server'
import { api } from '../api'

export async function pushDataSigaa(idPeriod: number | null, token?: string) {
  try {
    await api.post(
      'class/import_sigaa',
      {
        id_period: idPeriod,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      },
    )
    return true
  } catch (error) {
    return false
  }
}
