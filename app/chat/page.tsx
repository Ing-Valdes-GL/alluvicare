'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ChatRedirectPage() {
  const whatsappNumber = "+447818576208"
  const message = "Hello! I have a question about Alluvi products."
  
  // Construction de l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    // SEO : Mise à jour du titre et de la description dynamiquement
    document.title = "Contact Us | Alluvi Health-Care Support";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Contact our team on WhatsApp for inquiries about pharmaceutical logistics and orders.");
    }

    // Redirection automatique après 1.5 seconde
    const timer = setTimeout(() => {
      window.location.href = whatsappUrl
    }, 1500)

    return () => clearTimeout(timer)
  }, [whatsappUrl])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black font-sans text-center px-6">
      {/* Ton nouveau badge Vert Clair / Texte Blanc */}
      <span className="bg-[#22C55E] text-white px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] mb-8 rounded-full shadow-sm">
        Secure Support Channel
      </span>

      <div className="relative flex items-center justify-center mb-6">
        <Loader2 className="animate-spin text-[#25D366] absolute" size={64} />
        <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center">
           <div className="w-3 h-3 bg-[#25D366] rounded-full animate-ping" />
        </div>
      </div>

      <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
        Redirecting to WhatsApp
      </h1>
      
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed italic">
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