import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  // niente ricarica automatica quando torna internet: il bambino potrebbe essere a metà di un gioco
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === 'development',
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // i dati dell'app (zaino, routine, diario…): dalla rete se c'è, altrimenti l'ultima copia salvata sul telefono
        urlPattern: ({ sameOrigin, url }: { sameOrigin: boolean; url: URL }) => sameOrigin && url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth/forgot') && !url.pathname.startsWith('/api/auth/reset'),
        handler: 'NetworkFirst',
        method: 'GET',
        options: { cacheName: 'apis', networkTimeoutSeconds: 6, expiration: { maxEntries: 300, maxAgeSeconds: 365 * 24 * 3600 } },
      },
      {
        // i caratteri dell'app: restano sul tablet anche senza internet
        urlPattern: /\/fonts\/.*\.(?:woff2?|ttf|otf)$/i,
        handler: 'CacheFirst',
        method: 'GET',
        options: { cacheName: 'app-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 3600 } },
      },
      {
        // le foto (link temporanei di Supabase): restano sul telefono per guardarle anche offline
        urlPattern: ({ url }: { url: URL }) => url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/storage/'),
        handler: 'CacheFirst',
        method: 'GET',
        options: { cacheName: 'photos', expiration: { maxEntries: 400, maxAgeSeconds: 365 * 24 * 3600 }, cacheableResponse: { statuses: [0, 200] } },
      },
    ],
  },
})

const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-XSS-Protection',          value: '1; mode=block' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  // microfono e fotocamera: permessi solo all'app stessa (dettare nel diario, Say it!, registrare le poesie)
  { key: 'Permissions-Policy',        value: 'camera=(self), microphone=(self), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  images: {
    // le foto arrivano già piccole e con un link temporaneo: si mostrano così come sono,
    // senza passare dall'ottimizzatore di Vercel (che altrimenti terrebbe una copia di ogni foto)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // le foto private, con il link firmato e temporaneo
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
}

export default withPWA(nextConfig)