import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond, Ma_Shan_Zheng, ZCOOL_XiaoWei } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSeasonThemeClass } from '@/lib/star-calendar'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// 中文书法字体 - 马善政（楷书风格，适合排盘）
const maShanZheng = Ma_Shan_Zheng({
  variable: '--font-kaishu',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

// 备用中文书法字体
const zcoolXiaowei = ZCOOL_XiaoWei({
  variable: '--font-xiaowei',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://mingdao.space'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mingdao — Bazi Reading & Chinese Astrology | Light Your Path',
    template: '%s | Mingdao',
  },
  description:
    'Discover your destiny through ancient Eastern wisdom. Free Bazi (八字) reading, Zi Wei Dou Shu (紫微斗数), and I Ching (易经) divination — guided by tradition, enhanced by AI.',
  keywords: [
    'bazi reading',
    'bazi calculator',
    'chinese astrology',
    'four pillars of destiny',
    'i ching',
    'zi wei dou shu',
    'purple star astrology',
    'chinese numerology',
    'destiny reading',
    'free bazi chart',
    'ba zi 八字',
    'mingdao',
    'chinese metaphysics',
    'daoist wisdom',
  ],
  authors: [{ name: 'Mingdao' }],
  creator: 'Mingdao',
  publisher: 'Mingdao',
  category: 'Astrology & Spirituality',
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Mingdao',
    title: 'Mingdao — Bazi Reading & Chinese Astrology',
    description:
      'Discover your destiny through ancient Eastern wisdom. Free Bazi reading, Zi Wei Dou Shu, and I Ching divination.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mingdao — Light Your Path',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mingdao — Bazi Reading & Chinese Astrology',
    description: 'Discover your destiny through ancient Eastern wisdom.',
    images: ['/og-image.png'],
    creator: '@mingdao_space',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    // 添加后可验证：Google Search Console, Bing Webmaster Tools 等
    // google: 'google-site-verification-code',
    // bing: 'bing-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const seasonClass = getSeasonThemeClass()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${maShanZheng.variable} ${zcoolXiaowei.variable} h-full antialiased ${seasonClass}`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink-800">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
