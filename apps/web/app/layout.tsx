import { Roboto } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { cn } from '@/lib/utils'

import './globals.css'

const roboto = Roboto()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(roboto.className, 'antialiased')}>
        <ThemeProvider attribute='class'>{children}</ThemeProvider>
      </body>
    </html>
  )
}
