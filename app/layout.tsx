import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

// Configuration du Viewport pour une fluidité mobile parfaite
export const viewport: Viewport = {
  themeColor: '#f97316', // Orange-500 Alluvi
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  // 1. Titre & Description (SEO On-Page)
  title: {
    default: "Alluvi Health-Care | Secured Pharmaceutical Logistics UK",
    template: "%s | Alluvi Health-Care"
  },
  description: "Alluvi Health-Care provides licensed, temperature-controlled, and discreet pharmaceutical logistics across the UK. Secure healthcare distribution with blockchain-grade tracking.",
  
  metadataBase: new URL('https://alluvihealthcareuk.store'), 
  

  verification: {
    google: 'ZXYDUNLP1M2OtoFdtv7y4Fcw0TtJ3wnK7IqSv283wpk', // Plus besoin du fichier .html dans /public !
  },

  keywords: ["pharmaceutical logistics UK", "secure medical delivery", "healthcare distribution", "discreet pharmacy shipping", "BPC-157 UK", "Lab tested research"],
  authors: [{ name: "Alluvi Health-Care Team" }],

  // 3. Icons (Indispensable pour le look pro dans Google)
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },

  // 4. Open Graph (Partage réseaux sociaux)
  openGraph: {
    title: "Alluvi Health-Care | Professional Medical Logistics",
    description: "Secure & Discreet Pharmaceutical Delivery Services across the UK. Professionalism at every step.",
    url: 'https://alluvihealthcareuk.store',
    siteName: 'Alluvi Health-Care',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alluvi Health-Care - Secured Medical Logistics',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  // 5. Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: 'Alluvi Health-Care UK',
    description: 'Secured & Temperature-Controlled Pharmaceutical Logistics.',
    images: ['/og-image.jpg'],
  },

  // 6. Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Script de données structurées (JSON-LD) pour rassurer Google sur la légitimité du site
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Alluvi Health-Care",
    "url": "https://alluvihealthcareuk.store",
    "logo": "https://alluvihealthcareuk.store/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+237-692-118-391",
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
        {/* Insertion des données structurées */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#050505] selection:bg-orange-500/30 selection:text-orange-500`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark"
          enableSystem={false} // On force le dark mode par défaut pour Alluvi
        >
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}