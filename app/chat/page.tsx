'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ChatRedirectPage() {
  const whatsappNumber = "+447818576208"
  const message = "Hello! I have a question about Alluvi products."
  
  // Construction de l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    // Redirection automatique après un court délai
    const timer = setTimeout(() => {
      window.location.href = whatsappUrl
    }, 1000)

    return () => clearTimeout(timer)
  }, [whatsappUrl])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
      <Loader2 className="animate-spin text-[#25D366] mb-4" size={48} />
      <h1 className="text-xl font-bold">Redirecting to WhatsApp...</h1>
      <p className="text-gray-500 mt-2 text-sm text-center px-4">
        If you are not redirected,{' '}
        <a href={whatsappUrl} className="text-[#25D366] underline font-bold">
          click here to chat with us
        </a>.
      </p>
    </div>
  )
}