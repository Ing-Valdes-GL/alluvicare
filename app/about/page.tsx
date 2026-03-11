import { Metadata } from 'next'
import AboutPageClient from './AboutClient'

// C'est ce bloc que Google lira en priorité absolue
export const metadata: Metadata = {
  title: "About Our Labs | Precision Research", 
  // Avec ton template, cela deviendra : "About Our Labs | Precision Research | Alluvi Health-Care"
  description: "Learn more about Alluvi Health-Care's mission, our commitment to safety, and our expertise in pharmaceutical supply chains and precision research.",
  openGraph: {
    title: "About Our Labs | Alluvi Health-Care",
    description: "Our mission is to provide the highest purity compounds with absolute transparency.",
    images: ['/logo-share.png'],
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}