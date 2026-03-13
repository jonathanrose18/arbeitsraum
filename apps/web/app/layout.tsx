import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(inter.className, 'antialiased')}>
        <ThemeProvider attribute='class'>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
