import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // 1. Optimisation du titre pour Google (Max 60 caractères)
  title: {
    default: "Alluvi Health-Care | Secured Pharmaceutical Logistics UK",
    template: "%s | Alluvi Health-Care"
  },
  
  // 2. Description enrichie avec mots-clés (Max 155 caractères)
  description: "Alluvi Health-Care: Licensed pharmaceutical logistics in the UK. We provide secure, temperature-controlled, and discreet delivery for sensitive healthcare products.",
  
  // IMPORTANT: Remplace par ton domaine exact acheté chez Namecheap
  metadataBase: new URL('https://alluvihealth.store'), 
  
  // 3. Mots-clés (Bien que moins utilisés par Google, utile pour d'autres moteurs)
  keywords: ["pharmaceutical logistics UK", "secure medical delivery", "healthcare distribution", "discreet pharmacy shipping"],

  authors: [{ name: "Alluvi Health-Care Team" }],

  // 4. Configuration Open Graph (WhatsApp, FB, LinkedIn)
  openGraph: {
    title: "Alluvi Health-Care | Professional Medical Logistics",
    description: "Secure & Discreet Pharmaceutical Delivery Services across the UK. Professionalism at every step.",
    url: 'https://alluvihealth.store',
    siteName: 'Alluvi Health-Care',
    images: [
      {
        url: '/og-image.jpg', // Utilise un .jpg de haute qualité (1200x630)
        width: 1200,
        height: 630,
        alt: 'Alluvi Health-Care - Secured Medical Logistics',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  // 5. Twitter Card (Optimisé pour X)
  twitter: {
    card: 'summary_large_image',
    title: 'Alluvi Health-Care UK',
    description: 'Secured & Temperature-Controlled Pharmaceutical Logistics.',
    images: ['/og-image.jpg'],
    creator: '@alluvihealth',
  },

  // 6. Sécurité et Robots
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Couleur de la barre d'adresse sur mobile */}
        <meta name="theme-color" content="#FFA52F" />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#050505] transition-colors duration-300`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" // Alluvi a l'air mieux en sombre !
          enableSystem 
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}