import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SessionProps } from './types'

interface Session {
  user: {
    exp: number
  }
}

export async function middleware(request: NextRequest) {
  const session = (await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  })) as Session | null

  if (session && session.user) {
    const currentTime = Date.now() / 1000

    if (currentTime > session.user.exp) {
      const response = NextResponse.redirect(new URL('/home', request.nextUrl))

      response.cookies.set('next-auth.session-token', '', { maxAge: -1 })
      response.cookies.set('next-auth.callback-url', '', { maxAge: -1 })

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
