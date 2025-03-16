import QeryClientProvider from '@/components/provider/QeryClientProvider'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Xebraa Note app',
  description: 'This is a note app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QeryClientProvider>
            {children}
            <Toaster richColors />
          </QeryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
