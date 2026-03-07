'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, CheckCheck, Loader2, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && conversation) {
      loadMessages()
      const channel = subscribeToRealtime()
      // Marquer comme lu au chargement initial
      markMessagesAsRead(conversation.id, user.id)
      return () => { supabase.removeChannel(channel) }
    }
  }, [user, conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      await loadOrCreateConversation(user.id)
    }
  }

  // --- LOGIQUE DE L'ID UNIQUE (Évite les doublons) ---
  const loadOrCreateConversation = async (userId: string) => {
    try {
      // On cherche si une conversation existe déjà pour cet USER_ID
      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (existing) {
        setConversation(existing)
      } else {
        // Création d'une seule conversation par utilisateur
        const { data: newConv, error } = await supabase
          .from('chat_conversations')
          .insert({ user_id: userId, status: 'active' })
          .select().single()
        if (error) throw error
        setConversation(newConv)
      }
    } catch (error) {
      console.error('Erreur conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!conversation) return
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  // --- GESTION DU "LU / NON LU" ---
  const markMessagesAsRead = async (convId: string, currentUserId: string) => {
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('conversation_id', convId)
      .neq('sender_id', currentUserId) // On lit les messages de l'autre
      .eq('is_read', false)
  }

  const subscribeToRealtime = () => {
    const channel = supabase.channel(`chat:${conversation?.id}`)
    channel
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages', 
        filter: `conversation_id=eq.${conversation?.id}` 
      }, (payload) => {
        const newMsg = payload.new
        setMessages((current) => [...current, newMsg])
        // Marquer comme lu si on reçoit un message en étant sur la page
        markMessagesAsRead(conversation.id, user.id)
      })
      .subscribe()
    return channel
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversation || sending) return
    const content = newMessage
    setNewMessage('')
    setSending(true)

    try {
      const { error } = await supabase.from('chat_messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message_type: 'text',
        content: content,
        is_read: false // Par défaut non lu par le destinataire
      })

      if (error) throw error

      // Mettre à jour la date de dernier message
      await supabase.from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id)

    } catch (error) {
      console.error("Failed to send:", error)
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#EF6C00]" /></div>

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto max-w-4xl p-4 flex flex-col h-[calc(100vh-160px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-grow flex flex-col overflow-hidden">
          
          {/* Header du Chat */}
          <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-white">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#EF6C00]">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-bold text-sm">Alluvi Support</h2>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>

          {/* Zone des Messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#FDFDFD]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.sender_id === user.id 
                    ? 'bg-[#0A0A0A] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[9px]">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.sender_id === user.id && (
                      <CheckCheck size={12} className={msg.is_read ? 'text-blue-400' : 'text-gray-400'} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Message */}
          <div className="p-4 bg-white border-t border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow bg-transparent px-4 py-2 text-sm outline-none text-black"
              />
              <button 
                onClick={sendMessage}
                disabled={sending}
                className="bg-[#EF6C00] text-white p-2.5 rounded-lg hover:bg-black transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}