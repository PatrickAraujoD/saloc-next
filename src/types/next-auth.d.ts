import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      isAdmin: boolean
      name: string
      sector: number
    }
  }
}
