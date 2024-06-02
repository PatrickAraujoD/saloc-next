import { api } from '@/services/api'
import { ISODateString, NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

interface User {
  email: string
  id: number
  isAdmin: boolean
  name: string
  sector: number
}
interface SessionProps {
  token: string
  user: User
  expires: ISODateString
}

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credential) {
        console.log('to aqui')
        const response = await api.post('/login', {
          email: credential?.email,
          password: credential?.password,
        })

        if (response.status === 200) {
          const { data: user } = response
          console.log(user)
          return user
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session = token.user as SessionProps
      }
      return session
    },
  },
}
