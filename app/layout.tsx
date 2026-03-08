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
  // Titre par défaut (utilisé si une page n'en définit pas un via useEffect)
  title: "Alluvi Health-Care | Secured Pharmaceutical Logistics UK",
  description: "Alluvi Health-Care provides licensed, temperature-controlled, and discreet pharmaceutical logistics across the UK. Secure healthcare distribution with blockchain-grade tracking.",
  
  metadataBase: new URL('https://alluvihealthcareuk.store'), 

  verification: {
    google: 'ZXYDUNLP1M2OtoFdtv7y4Fcw0TtJ3wnK7IqSv283wpk',
  },

  keywords: ["pharmaceutical logistics UK", "secure medical delivery", "healthcare distribution", "discreet pharmacy shipping", "BPC-157 UK", "Lab tested research"],
  authors: [{ name: "Alluvi Health-Care Team" }],

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },

  // Configuration Open Graph (WhatsApp, Facebook, LinkedIn)
  openGraph: {
    title: "Alluvi Health-Care | Professional Medical Logistics",
    description: "Secure & Discreet Pharmaceutical Delivery Services across the UK.",
    url: 'https://alluvihealthcareuk.store',
    siteName: 'Alluvi Health-Care',
    images: [
      {
        url: '/og-image.jpg', // L'image qui s'affichera lors du partage
        width: 1200,
        height: 630,
        alt: 'Alluvi Health-Care Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  // Configuration Twitter/X pour l'image en GRAND
  twitter: {
    card: 'summary_large_image', // C'est cette ligne qui force l'image en grand
    title: 'Alluvi Health-Care UK',
    description: 'Secured & Temperature-Controlled Pharmaceutical Logistics.',
    images: ['/og-image.jpg'],
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