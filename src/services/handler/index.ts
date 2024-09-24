import { nextAuthConfig } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(nextAuthConfig)
    const token = session?.token
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get token' })
  }
}
