'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ChatRedirectPage() {
  const whatsappNumber = "+447818576208"
  const message = "Hello! I have a question about Alluvi products."
  
  // Construction de l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    // 1. FORCER LE TITRE UNIQUE POUR L'INDEXATION
    document.title = "Contact Support | Alluvi Health-Care UK";

    // 2. FORCER LA DESCRIPTION UNIQUE (Ce que Google affichera sous le titre)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Contact Alluvi Health-Care support team on WhatsApp for inquiries about pharmaceutical logistics, orders, and secure distribution in the UK.");

    // 3. DETECTION DES ROBOTS & REDIRECTION INTELLIGENTE
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

    const timer = setTimeout(() => {
      // On ne redirige que les VRAIS UTILISATEURS
      // Les robots restent sur la page pour finir l'indexation
      if (!isBot) {
        window.location.href = whatsappUrl;
      }
    }, 3500); // 3.5 secondes : assez long pour Google, assez court pour l'humain

    return () => clearTimeout(timer)
  }, [whatsappUrl])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black font-sans text-center px-6">
      
      {/* TEXTE SEMANTIQUE POUR GOOGLE (Invisible à l'oeil nu) */}
      <div className="sr-only">
        <h2>Official Alluvi Health-Care Support Channel</h2>
        <p>Get priority assistance for pharmaceutical logistics and order tracking in the UK.</p>
      </div>

      {/* Badge Vert Clair / Texte Blanc (Ton nouveau style) */}
      <span className="bg-[#22C55E] text-white px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] mb-8 rounded-full shadow-sm">
        Secure Support Channel
      </span>

      <div className="relative flex items-center justify-center mb-6">
        <Loader2 className="animate-spin text-[#25D366] absolute" size={64} />
        <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
           <div className="w-3 h-3 bg-[#25D366] rounded-full animate-ping" />
        </div>
      </div>

      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-black">
        Contact Alluvi Support
      </h1>
      
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed italic mb-4">
        Connecting you to our pharmaceutical logistics team for priority assistance.
      </p>

      <div className="mt-10 pt-10 border-t border-gray-100 w-full max-w-xs">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">
          Not working?
        </p>
        <a 
          href={whatsappUrl} 
          className="inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg shadow-green-100"
        >
          Open WhatsApp Manually
        </a>
      </div>
    </div>
  )
}