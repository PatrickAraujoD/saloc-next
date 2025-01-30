import { loginUser } from '@/services/http/login-user'
import { SessionProps } from '@/types'
import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credential) {
        const response = await loginUser({
          email: credential?.email,
          password: credential?.password,
        })

        if (response.status === 404) {
          throw new Error('credenciais inválidas')
        }

        if (response.status === 200) {
          const { data: user } = response
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
