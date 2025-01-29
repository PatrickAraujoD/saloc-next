'use server'
import { api } from '../api'

type getRequestClassProgressProps = {
  token?: string
  body: any
}

export async function getRequestClassProgress({
  token,
  body,
}: getRequestClassProgressProps) {
  const response = await api.post('/request/progress', body, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return {
    acceptedInAnalysis: response.data.accepted_in_analysis,
    notInRequests: response.data.not_in_requests,
    allocatedClasses: response.data.allocated_classes,
  }
}
