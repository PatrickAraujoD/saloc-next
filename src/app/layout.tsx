import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/providers/session-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

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
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <Header />
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        <Footer />
      </body>
    </html>
  )
}
