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
  title: "Alluvi Health-Care | Secured Pharmaceutical Logistics UK",
  description: "Alluvi Health-Care provides licensed, temperature-controlled, and discreet pharmaceutical logistics across the UK. Secure healthcare distribution with blockchain-grade tracking.",
  
  metadataBase: new URL('https://alluvihealthcareuk.store'), 

  verification: {
    google: 'ZXYDUNLP1M2OtoFdtv7y4Fcw0TtJ3wnK7IqSv283wpk',
  },

  keywords: ["pharmaceutical logistics UK", "secure medical delivery", "alluvi healthcare", "alluvi", "Alluvi Health-Care", "alluvi health", "alluvi care", "alluvi uk", "retatrutide", "weight loss", "healthcare distribution", "discreet pharmacy shipping"],
  authors: [{ name: "Alluvi Health-Care Team" }],

  // CONFIGURATION DES ICONES (Pour Google et les navigateurs)
  icons: {
    icon: [
      { url: 'https://alluvihealthcareuk.store/favicon.ico', type: 'image/ico', sizes: '48x48' },
      { url: 'https://alluvihealthcareuk.store/logo-share.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/logo-share.png',
    apple: [
      { url: '/logo-share.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  openGraph: {
    title: "Alluvi Health-Care | Professional Medical Logistics",
    description: "Secure & Discreet Pharmaceutical Delivery Services across the UK.",
    url: 'https://alluvihealthcareuk.store',
    siteName: 'Alluvi Health-Care',
    images: [
      {
        url: 'https://alluvihealthcareuk.store/logo-share.png', 
        width: 1200,
        height: 630,
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Alluvi Health-Care",
    "url": "https://alluvihealthcareuk.store",
    "logo": "https://alluvihealthcareuk.store/favicon.ico",
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
        {/* FORCER LE FAVICON POUR GOOGLE (Méthode directe) */}
        <link rel="icon" href="/favicon.ico" type="image/ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/logo-share.png" />
        
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