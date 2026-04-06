import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'
import { GoogleAnalytics } from '@next/third-parties/google'
import PerformanceMonitor from '@/components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ANTA — AI Product Studio for MVPs & Revenue Systems',
  description:
    'We design and ship AI-powered MVPs that validate demand, attract users, and scale into high-performance systems — for founders who need speed and clarity.',
  keywords:
    'AI product studio, MVP development, validation, revenue systems, automation, Next.js, React, founders, product studio',
  authors: [{ name: 'ANTA' }],
  creator: 'ANTA',
  publisher: 'ANTA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.theanta.com',
    siteName: 'ANTA — AI Product Studio',
    title: 'ANTA — AI Product Studio for MVPs & Revenue Systems',
    description:
      'AI-powered MVPs, validation, and scalable systems — built for founders who need to move fast without building the wrong product.',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'ANTA — AI product studio for MVPs and revenue systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANTA — AI Product Studio for MVPs & Revenue Systems',
    description:
      'AI-powered MVPs, validation, and scalable systems — built for founders who need to move fast without building the wrong product.',
    images: ['/images/hero-bg.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const theme = savedTheme || 'dark';
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
        <link rel="icon" href="/assets/favicon.png" type="image/png" />
        <link
          rel="preload"
          href="/Righteous.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <PerformanceMonitor />
        <ClientProviders>
          {children}
        </ClientProviders>
        {/* Google Analytics tracking */}
        <GoogleAnalytics gaId="G-BF6M3EFFKH" />
      </body>
    </html>
  )
}
