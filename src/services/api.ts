import axios, { AxiosInstance } from 'axios'
import { config } from 'dotenv'

config()

console.log(process.env.NEXT_PUBLIC_API_URL)
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
})
