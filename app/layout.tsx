import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import UpdateBanner from '@/components/UpdateBanner'
import './globals.css'

export const metadata: Metadata = {
  title: 'SempliceMente Bimbi',
  description: 'Aiuta i bambini a essere più autonomi ogni giorno',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'SempliceMente Bimbi' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6B7FE3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        {children}
        <UpdateBanner />
        <Analytics />
      </body>
    </html>
  )
}
