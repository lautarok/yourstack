import TransitionView from '@/components/providers/TransitionView'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YourStack - Exámenes de TI',
  description: 'Plataforma de exámenes para Diseño, Programación y Desarrollo Web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <TransitionView>
          {children}
        </TransitionView>
      </body>
    </html>
  )
}
