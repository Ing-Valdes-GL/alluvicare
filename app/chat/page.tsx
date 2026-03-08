'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ChatRedirectPage() {
  const whatsappNumber = "+447818576208"
  const message = "Hello! I have a question about Alluvi products."
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    // 1. TITRE DE LA PAGE (S'affiche dans l'onglet et Google)
    document.title = "Contact Support | Alluvi Health-Care UK";
    
    // 2. DESCRIPTION DE LA PAGE (S'affiche sous le titre dans Google)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      // Si la balise n'existe pas, on la crée
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Contact Alluvi Health-Care support team for pharmaceutical logistics, order inquiries, and secure distribution services in the UK.");

    // 3. REDIRECTION (On laisse 3 secondes pour que Google puisse lire la description)
    const timer = setTimeout(() => {
      // On évite de rediriger les robots pour qu'ils indexent bien le contenu
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
      if (!isBot) {
        window.location.href = whatsappUrl;
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [whatsappUrl])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black font-sans text-center px-6">
      
      {/* Contenu sémantique pour les robots d'indexation */}
      <div className="sr-only">
        <h2>Alluvi Health-Care Customer Support</h2>
        <p>Direct WhatsApp channel for pharmaceutical logistics and secure healthcare distribution inquiries.</p>
      </div>

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
          Direct WhatsApp Link
        </p>
        <a 
          href={whatsappUrl} 
          className="inline-flex items-center justify-center bg-[#25D366] text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg shadow-green-100"
        >
          Open WhatsApp Now
        </a>
      </div>
    </div>
  )
}