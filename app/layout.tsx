import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  themeColor: '#f97316', 
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: "Alluvi Health-Care | Secured Pharmaceutical Logistics UK",
    template: "%s | Alluvi Health-Care" 
  },
  description: "Premium research peptides: BCP-157, TB-500, Retatrutide, Tizepatide. Janoshik tested, cold chain delivery, tracked uk, shipping for lab R&D",
  
  metadataBase: new URL('https://alluvihealthcareuk.store'), 

  verification: {
    google: '2hbWEWdI2DGbgMkCZ5FFOk-1Jc1gjsYmlFBWSiFS0-s',
  },

  keywords: ["pharmaceutical logistics UK", "secure medical delivery", "alluvi healthcare", "alluvi", "Alluvi Health-Care", "alluvi health", "alluvi care", "alluvi uk", "retatrutide", "weight loss", "healthcare distribution", "discreet pharmacy shipping"],
  authors: [{ name: "Alluvi Health-Care Team" }],

  openGraph: {
    title: "Alluvi Health-Care | Professional Medical Logistics",
    description: "Secure & Discreet Pharmaceutical Delivery Services across the UK.",
    url: 'https://alluvihealthcareuk.store',
    siteName: 'Alluvi Health-Care',
    images: [
      {
        url: '/logo-share.png',
        width: 512,
        height: 512,
        alt: 'Alluvi Health-Care Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Alluvi Health-Care UK',
    description: 'Secured & Temperature-Controlled Pharmaceutical Logistics.',
    images: ['/logo-share.png'],
  },

  robots: {
    index: true,
    follow: true,
  },

  // Favicon optimisé pour Google (recommandation: 48x48 minimum, carré, PNG/ICO)
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '48x48' },
      { url: '/logo-share.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo-share.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/logo-share.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Alluvi Health-Care",
    "url": "https://alluvihealthcareuk.store",
    // Utilisation du PNG ici aussi pour la cohérence
    "logo": "https://alluvihealthcareuk.store/logo-share.png", 
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44 7818576208",
      "contactType": "customer service",
      "areaServed": "GB",
      "availableLanguage": "en"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon prioritaire pour Google (demande souvent /favicon.ico) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/logo-share.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/logo-share.png" sizes="180x180" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#050505] selection:bg-orange-500/30 selection:text-orange-500`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark"
          enableSystem={false} 
        >
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}