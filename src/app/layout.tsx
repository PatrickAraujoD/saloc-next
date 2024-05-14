import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/providers/session-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Create App Saloc',
  description: 'Criação de uma aplicação para facilitar alocação de sala',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}
