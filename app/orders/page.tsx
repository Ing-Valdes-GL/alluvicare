'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, ChevronDown, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplitText } from '@/components/motion/SplitText'
import { EASE_OUT } from '@/components/motion/tokens'

export default function OrdersPage() {
  const { theme } = useTheme() // Still keeping the hook for system compatibility
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const fetchOrders = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else fetchOrders(user.id)
    }
    checkUser()
  }, [fetchOrders, router])

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase()
    const baseClass = "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border"
    
    if (s === 'confirmed' || s === 'approved') 
      return <span className={`${baseClass} bg-green-500/10 text-green-400 border-green-500/20`}>Confirmed</span>
    if (s === 'rejected' || s === 'cancelled') 
      return <span className={`${baseClass} bg-red-500/10 text-red-400 border-red-500/20`}>Rejected</span>
    
    return <span className={`${baseClass} bg-amber-500/10 text-amber-400 border-amber-500/20`}>Pending</span>
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <Header />

      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2"><SplitText text="Order History" trigger="mount" /></h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }} className="text-zinc-500 text-sm">
            Review and track your pharmaceutical transmissions.
          </motion.p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, rotateX: 20, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 1, ease: EASE_OUT }} style={{ transformPerspective: 1000 }} className="bg-zinc-900/50 border border-zinc-800 p-20 text-center rounded-2xl">
            <motion.div animate={{ rotateY: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ transformPerspective: 400 }} className="w-fit mx-auto">
              <Package className="mx-auto mb-4 text-zinc-700" size={48} />
            </motion.div>
            <p className="text-zinc-500 font-medium">No order history found.</p>
          </motion.div>
        ) : (
          <div className="space-y-6" style={{ perspective: 1400 }}>
            {orders.map((order, index) => (
              <motion.div 
                key={order.id} 
                layout
                initial={{ opacity: 0, y: 40, rotateX: -25 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: Math.min(index, 8) * 0.07 }}
                className={`group border transition-[border-color,background-color,box-shadow] duration-300 overflow-hidden rounded-2xl ${
                  expandedOrderId === order.id 
                  ? 'border-zinc-700 bg-zinc-900 shadow-2xl' 
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                {/* Summary Header */}
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-zinc-200 transition-colors">
                            <Hash size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Reference</p>
                            <p className="text-sm font-mono font-bold text-white uppercase">
                                {order.order_reference || order.reference_code || order.id.slice(0, 8)}
                            </p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block w-[1px] h-8 bg-zinc-800"></div>

                    <div>
                      <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Ordered On</p>
                      <p className="text-sm text-zinc-300 font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Total Amount</p>
                      <p className="text-lg font-bold text-white">£{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <motion.div
                        animate={{ rotateX: expandedOrderId === order.id ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`p-1 rounded-full transition-colors duration-300 ${expandedOrderId === order.id ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Detailed Table Section */}
                <AnimatePresence initial={false}>
                {expandedOrderId === order.id && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                  <div className="bg-black/20 border-t border-zinc-800 p-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase text-zinc-500 border-b border-zinc-800">
                          <th className="text-left pb-4 font-bold tracking-widest">Item Description</th>
                          <th className="text-center pb-4 font-bold tracking-widest">Qty</th>
                          <th className="text-right pb-4 font-bold tracking-widest">Unit Price</th>
                          <th className="text-right pb-4 font-bold tracking-widest">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {order.order_items?.map((item: any, i: number) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.05 }}
                            className="text-zinc-300 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-5 font-medium text-zinc-100">{item.product_name}</td>
                            <td className="py-5 text-center font-bold">
                                <span className="text-zinc-600 text-[10px] mr-1 italic">x</span>
                                {item.quantity}
                            </td>
                            <td className="py-5 text-right font-mono text-zinc-400">£{Number(item.unit_price).toFixed(2)}</td>
                            <td className="py-5 text-right font-bold text-white font-mono">
                              £{(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}