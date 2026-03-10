'use client'

import { useState } from 'react'
import {
    ShoppingBag,
    Search,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    Mail,
    Filter,
    TrendingUp,
    ChevronDown,
    Loader2
} from "lucide-react"
import { updateOrderStatus } from '@/app/actions/admin-actions'

interface OrdersClientProps {
    initialOrders: any[]
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [searchQuery, setSearchQuery] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatus(orderId, newStatus)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            alert('Error al actualizar el estado')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-20">
                <div className="max-w-xl">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Transactions // Fulfilment</span>
                    <h1 className="font-display text-6xl md:text-8xl font-black italic tracking-tightest uppercase leading-none mb-8">
                        Pedidos
                    </h1>
                    <p className="text-white/20 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Gestión de pedidos, logística de envíos y conciliación de pagos en tiempo real.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center min-w-[150px]">
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Total Pedidos</p>
                        <h4 className="font-display text-4xl font-black italic tracking-tighter">{orders.length}</h4>
                    </div>
                    <div className="bg-white text-black p-6 flex flex-col items-center justify-center min-w-[150px]">
                        <p className="text-black/40 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Pagados</p>
                        <h4 className="font-display text-4xl font-black italic tracking-tighter">
                            {orders.filter(o => o.status === 'paid').length}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[#0a0a0a] border border-white/5 p-6 rounded-sm">
                <div className="flex items-center bg-white/5 px-6 py-3 border border-white/5 w-full md:max-w-md">
                    <Search size={16} className="text-white/20" />
                    <input
                        type="text"
                        placeholder="Filtrar Pedidos (ID o Email)..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-[10px] font-black tracking-widest uppercase ml-4 w-full placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border border-white/5 px-8 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white/5 transition-all">
                        <Filter size={14} />
                        <span>Estado: Todos</span>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-white/40 text-[10px] uppercase tracking-widest font-black">
                            <th className="px-10 py-8 border-b border-white/5">Referencia ID</th>
                            <th className="px-10 py-8 border-b border-white/5">Cliente & Contacto</th>
                            <th className="px-10 py-8 border-b border-white/5">Estado Operativo</th>
                            <th className="px-10 py-8 border-b border-white/5">Items</th>
                            <th className="px-10 py-8 border-b border-white/5 text-right font-black">Monto Bruto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors relative">
                                <td className="px-10 py-10">
                                    <div className="flex items-center space-x-3">
                                        <p className="font-display font-black text-[13px] tracking-tight text-white/60">#HQ-{order.id.slice(0, 8).toUpperCase()}</p>
                                        <button className="text-white/10 hover:text-white transition-colors"><ExternalLink size={12} /></button>
                                    </div>
                                    <p className="text-[9px] text-white/20 font-black tracking-widest mt-2 uppercase italic">
                                        {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </td>
                                <td className="px-10 py-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-3">
                                            <Mail size={12} className="text-white/30" />
                                            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">{order.customer_email}</p>
                                        </div>
                                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest pl-6 italic">GUEST CUSTOMER</p>
                                    </div>
                                </td>
                                <td className="px-10 py-10">
                                    <div className="relative inline-block group/select">
                                        <select
                                            value={order.status}
                                            disabled={updatingId === order.id}
                                            onChange={(e) => handleStatusChange(order.status === 'paid' ? order.id : order.id, e.target.value)}
                                            className={`appearance-none text-[10px] font-black px-6 py-2 pr-10 uppercase tracking-widest bg-white/5 border border-white/10 cursor-pointer focus:border-white transition-all ${order.status === 'paid' ? 'text-emerald-400' :
                                                    order.status === 'shipped' ? 'text-blue-400' :
                                                        order.status === 'cancelled' ? 'text-rose-500' : 'text-amber-400'
                                                }`}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="paid">Liquidado</option>
                                            <option value="shipped">Enviado</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                            {updatingId === order.id ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-10">
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-white/5 w-10 h-10 flex items-center justify-center font-black text-[12px] border border-white/5">
                                            {order.order_items?.length || 0}
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Artículos</p>
                                    </div>
                                </td>
                                <td className="px-10 py-10 text-right">
                                    <div className="space-y-1">
                                        <p className="font-display font-black text-2xl italic tracking-tighter text-white">${Number(order.total_amount).toFixed(2)}</p>
                                        <div className="flex items-center justify-end text-emerald-400 text-[9px] font-black uppercase tracking-widest italic">
                                            <TrendingUp size={10} className="mr-2" />
                                            NET VALUE
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="py-60 text-center flex flex-col items-center justify-center border-t border-white/5">
                        <ShoppingBag size={64} className="mb-10 text-white/10" />
                        <h3 className="font-display text-4xl font-black italic tracking-tightest uppercase mb-4 leading-none text-white/80">Silencio Operativo</h3>
                        <p className="text-white/20 text-[11px] uppercase tracking-widest max-w-sm">No se han encontrado registros de transacciones bajo ese identificador.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
