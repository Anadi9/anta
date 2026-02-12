import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'
import { GoogleAnalytics } from '@next/third-parties/google'
import PerformanceMonitor from '@/components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Custom Website Development Services - Professional Web Solutions',
  description: 'Get custom websites built according to your requirements. Professional web development, UI/UX design, and digital solutions. Contact us for your next project.',
  keywords: 'custom website development, web development services, website design, custom web solutions, professional web developer, build website, web development company, custom website builder, website creation, web design services',
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
    siteName: 'ANTA - Custom Website Development Services',
    title: 'Custom Website Development Services - Professional Web Solutions',
    description: 'Get custom websites built according to your requirements. Professional web development, UI/UX design, and digital solutions. Contact us for your next project.',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Custom Website Development Services - Professional Web Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Website Development Services - Professional Web Solutions',
    description: 'Get custom websites built according to your requirements. Professional web development, UI/UX design, and digital solutions. Contact us for your next project.',
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
