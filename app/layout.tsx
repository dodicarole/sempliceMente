import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import UpdateBanner from '@/components/UpdateBanner'
import ReadingPrefs from '@/components/ReadingPrefs'
import { I18nProvider } from '@/lib/i18n'
import { ChildrenProvider } from '@/lib/children'
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
        <I18nProvider>
          <ChildrenProvider>
            <ReadingPrefs />
            {children}
          </ChildrenProvider>
          <UpdateBanner />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
