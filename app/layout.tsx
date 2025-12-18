import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Chat - AI-Powered Document Assistant',
  description: 'Chat with your PDFs, generate flashcards, and more',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>  {/* <--- 2. OPEN TAG HERE */}
            <Navbar />
            {children}
          </Providers> {/* <--- 3. CLOSE TAG HERE */}
        </body>
      </html>
    </ClerkProvider>
  )
}