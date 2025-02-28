import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/providers/session-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/auth'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SALOC',
  description: 'Criação de uma aplicação para facilitar alocação de sala',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(nextAuthConfig)
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icon-saloc.ico" />
      </head>
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <Header session={session} />
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        <Footer />
      </body>
    </html>
  )
}
