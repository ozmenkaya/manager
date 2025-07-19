import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Epica Manager - Modern Yönetim Sistemi',
  description: 'Epica.com.tr - Modern ve güçlü yönetim uygulaması. Proje yönetimi, görev takibi ve ekip koordinasyonu.',
  keywords: 'proje yönetimi, görev takibi, ekip yönetimi, epica, manager',
  authors: [{ name: 'Epica Team' }],
  creator: 'Epica',
  publisher: 'Epica',
  metadataBase: new URL('https://epica.com.tr'),
  openGraph: {
    title: 'Epica Manager - Modern Yönetim Sistemi',
    description: 'Modern ve güçlü yönetim uygulaması',
    url: 'https://epica.com.tr',
    siteName: 'Epica Manager',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Epica Manager',
    description: 'Modern yönetim uygulaması',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
