import NextAuth from 'next-auth'
import { Course, Sector } from '@/types/index'

declare module 'next-auth' {
  interface Session {
    token: string
    user: {
      email: string
      isAdmin: boolean
      name: string
      sector: Sector
      course: Course
    }
  }
}
