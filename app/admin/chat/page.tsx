'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, ChatConversation, ChatMessage } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Send, User, Check, CheckCheck, Search, Paperclip, MessageSquare, Loader2 } from 'lucide-react'

interface ConversationWithUser extends ChatConversation {
  profiles?: {
    full_name: string
    email: string
    avatar_url: string
  }
  unread_count?: number
}

function ChatInterface() {
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<ConversationWithUser[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkAdmin()
  }, [])

  // Gestion de la sélection initiale via URL ou première conversation
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId')
    if (chatIdFromUrl && conversations.length > 0 && !selectedConversation) {
      const conv = conversations.find(c => c.id === chatIdFromUrl)
      if (conv) setSelectedConversation(conv)
    }
  }, [conversations])

  // Chargement des messages et abonnement
  useEffect(() => {
    if (user && selectedConversation) {
      loadMessages()
      const channel = subscribeToMessages()
      markMessagesAsRead() // Marquer comme lu à l'ouverture
      return () => { if (channel) supabase.removeChannel(channel) }
    }
  }, [user, selectedConversation])

  useEffect(() => { scrollToBottom() }, [messages])

  const checkAdmin = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) { router.push('/login'); return; }
    
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', currentUser.id).single()
    if (!profile?.is_admin) { router.push('/products'); return; }
    
    setUser(currentUser)
    loadConversations(currentUser.id)
  }

  const loadConversations = async (adminId?: string) => {
    const currentAdminId = adminId || user?.id
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`*, profiles!chat_conversations_user_id_fkey (full_name, email, avatar_url)`)
        .order('last_message_at', { ascending: false })

      if (error) throw error
      
      // Calculer les messages non lus pour chaque conversation
      const convsWithUnread = await Promise.all((data || []).map(async (conv) => {
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', currentAdminId)
        return { ...conv, unread_count: count || 0 }
      }))

      setConversations(convsWithUnread)
    } catch (error) { console.error('Error:', error) } finally { setLoading(false) }
  }

  const loadMessages = async () => {
    if (!selectedConversation) return
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', selectedConversation.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const subscribeToMessages = () => {
    if (!selectedConversation) return
    const channel = supabase.channel(`admin_chat_${selectedConversation.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages', 
        filter: `conversation_id=eq.${selectedConversation.id}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as ChatMessage
          setMessages(prev => [...prev, newMsg])
          if (newMsg.sender_id !== user?.id) markMessagesAsRead()
        }
        if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new as ChatMessage
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m))
        }
      }).subscribe()
    return channel
  }

  const markMessagesAsRead = async () => {
    if (!selectedConversation || !user) return
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('conversation_id', selectedConversation.id)
      .neq('sender_id', user.id)
      .eq('is_read', false)
    
    if (!error) loadConversations() // Rafraîchir les compteurs de la liste
  }

  const sendMessage = async (contentOverride?: string, type: 'text' | 'image' = 'text') => {
    const content = contentOverride || newMessage
    if (!content.trim() || !user || !selectedConversation) return
    
    setSending(true)
    try {
      const { error } = await supabase.from('chat_messages').insert({
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        message_type: type,
        content: type === 'text' ? content : 'Image envoyée',
        file_url: type === 'image' ? content : null,
        is_read: false
      })
      if (error) throw error
      
      await supabase.from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id)

      setNewMessage('')
    } catch (error) { alert('Error sending message') } finally { setSending(false) }
  }

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-100px)] flex flex-col">
        
        <div className="grid lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
          {/* Liste des conversations */}
          <div className={`lg:col-span-4 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col overflow-hidden`}>
            <div className="p-4 border-b border-inherit">
                <h2 className="font-black text-xl mb-4">MESSAGES</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.filter(c => c.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase())).map(conv => (
                <div 
                  key={conv.id} 
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer border-b border-inherit transition-colors flex items-center gap-3 ${selectedConversation?.id === conv.id ? 'bg-brand-primary/10' : 'hover:bg-gray-50/50'}`}
                >
                  <div className="relative w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary">
                    {conv.profiles?.full_name[0]}
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{conv.profiles?.full_name}</p>
                    <p className="text-xs opacity-50 truncate">{conv.profiles?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fenêtre de chat */}
          <div className={`lg:col-span-8 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col overflow-hidden`}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-inherit flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="font-black uppercase">{selectedConversation.profiles?.full_name}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-4 py-2 rounded-2xl text-sm ${isOwn ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'}`}>
                            {msg.message_type === 'image' ? (
                                <img src={msg.file_url} className="rounded-lg max-w-full cursor-pointer" onClick={() => window.open(msg.file_url, '_blank')} />
                            ) : msg.content}
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[9px] opacity-40">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            {isOwn && (
                              msg.is_read ? <CheckCheck size={12} className="text-brand-primary" /> : <Check size={12} className="opacity-30" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-inherit flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrire votre réponse..."
                    className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                  />
                  <button 
                    onClick={() => sendMessage()}
                    disabled={sending || !newMessage.trim()}
                    className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-primary/80 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <MessageSquare size={64} />
                <p className="font-bold mt-4">SÉLECTIONNEZ UN CLIENT POUR RÉPONDRE</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ChatInterface />
    </Suspense>
  )
}