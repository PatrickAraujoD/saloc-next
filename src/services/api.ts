import axios, { AxiosInstance } from 'axios'
import { config } from 'dotenv'

config()

const timeout = 24 * 60 * 60 * 1000 // 24 hour

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout,
})
