import { api } from '@/lib/api'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const nextAuthConfig: NextAuthOptions = {
  secret: 'secredt_hash',
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credential) {
        const response = await api.post('/login', {
          email: credential?.email,
          password: credential?.password,
        })

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
        session = token.user as any
      }
      return session
    },
  },
}

const handler = NextAuth(nextAuthConfig)

export { handler as GET, handler as POST, nextAuthConfig }
