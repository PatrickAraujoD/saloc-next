import { ISODateString } from 'next-auth'

export interface Room {
  id: number
  number: string
  sector: string
  capacity: number
  block: string
  floor: string
  building: string
}

export interface Course {
  id: number
  name: string
}

export interface Period {
  id: number
  year: number
  semester: number
}

export interface Discipline {
  departament: string
  code: string
  name: string
  period: string
}

export interface Teacher {
  id: number
  name: string
}

export interface Class {
  id: number
  period: Period
  discipline: Discipline
  course: Course
  numberOfStudents: number
  numberOfClass: string
  classSchedule: string
  teachers: Teacher[]
}

export interface ClassInfoTable {
  id: number
  room: Room
  name: string
  schedule: string
}

export interface ListSchedule {
  id: number
  schedule: string
  schedule_complet: boolean
  type: string
}

export interface Sector {
  course: string | null
  id: number
  name: string
}

export interface User {
  email: string
  id: number
  isAdmin: boolean
  name: string
  sector: Sector
}

interface UserSession {
  id?: string
  email: string
  isAdmin: boolean
  name: string
  sector: Sector
  course: Course
}

export interface SessionProps {
  token: string
  user: UserSession
  expires: ISODateString
  exp: number
}
