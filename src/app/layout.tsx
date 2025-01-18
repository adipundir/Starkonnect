import { Navbar } from '@/components/Navbar/Navbar'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'


export const metadata = {
  title: 'StarKonnect',
  description: 'Connect with like minded Individuals and get Payed',
  icons: {
    icon: "./favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
