'use client'

import { useState } from 'react'
import {
    ShoppingBag, Search, MessageCircle, CreditCard, Mail,
    CheckCircle2, XCircle, Clock, Trash2, AlertTriangle,
    ChevronRight, X, Package, User, Phone, TrendingUp, Loader2, Users,
    Calendar, ChevronDown
} from "lucide-react"
import { updateOrderStatus, confirmWhatsappOrder, deleteOrder, saveAsCustomer } from '@/app/actions/admin-actions'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending_whatsapp: { label: 'Esperando Confirmación', color: 'text-amber-400', bg: 'bg-amber-400/10 border border-amber-400/20', icon: MessageCircle },
    pending: { label: 'Pendiente', color: 'text-amber-400', bg: 'bg-amber-400/10 border border-amber-400/20', icon: Clock },
    confirmed: { label: 'Confirmado', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border border-emerald-400/20', icon: CheckCircle2 },
    paid: { label: 'Pagado', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border border-emerald-400/20', icon: CheckCircle2 },
    shipped: { label: 'Enviado', color: 'text-blue-400', bg: 'bg-blue-400/10 border border-blue-400/20', icon: Package },
    cancelled: { label: 'Cancelado', color: 'text-rose-500', bg: 'bg-rose-500/10 border border-rose-500/20', icon: XCircle },
    rejected: { label: 'Rechazado', color: 'text-rose-500', bg: 'bg-rose-500/10 border border-rose-500/20', icon: XCircle },
}

const METHOD_ICON: Record<string, any> = {
    whatsapp: MessageCircle,
    stripe: CreditCard,
    email: Mail,
}

export default function OrdersClient({ initialOrders, currency, role }: { initialOrders: any[], currency: string, role: string | null }) {
    const [orders, setOrders] = useState(initialOrders)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<'all' | 'today' | 'this_month' | 'last_month'>('all')

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || o.status === statusFilter

        const orderDate = new Date(o.created_at)
        const now = new Date()
        let matchesDate = true

        if (dateRange === 'today') {
            matchesDate = orderDate.toDateString() === now.toDateString()
        } else if (dateRange === 'this_month') {
            matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
        } else if (dateRange === 'last_month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            matchesDate = orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear()
        }

        return matchesSearch && matchesStatus && matchesDate
    })

    const pendingWaCount = filteredOrders.filter(o => o.status === 'pending_whatsapp').length
    const confirmedCount = filteredOrders.filter(o => ['confirmed', 'paid'].includes(o.status)).length
    const totalRevenue = filteredOrders.filter(o => ['confirmed', 'paid', 'shipped'].includes(o.status))
        .reduce((s, o) => s + Number(o.total_amount || 0), 0)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setLoadingId(orderId)
        try {
            if (newStatus === 'confirmed' && orders.find(o => o.id === orderId)?.checkout_method === 'whatsapp') {
                await confirmWhatsappOrder(orderId)
            } else {
                await updateOrderStatus(orderId, newStatus)
            }
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }))
        } catch {
            alert('Error al actualizar estado')
        } finally {
            setLoadingId(null)
        }
    }

    const handleConfirm = async (orderId: string) => {
        setLoadingId(orderId)
        try {
            await confirmWhatsappOrder(orderId)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o))
            if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status: 'confirmed' }))
        } catch (err: any) {
            alert('Error al confirmar: ' + err.message)
        } finally {
            setLoadingId(null)
        }
    }

    const handleReject = async (orderId: string) => {
        await handleStatusChange(orderId, 'rejected')
    }

    const handleDelete = async (orderId: string) => {
        setLoadingId(orderId)
        try {
            await deleteOrder(orderId)
            setOrders(prev => prev.filter(o => o.id !== orderId))
            if (selectedOrder?.id === orderId) setSelectedOrder(null)
            setConfirmingDelete(null)
        } catch (err: any) {
            alert('Error al eliminar: ' + err.message)
        } finally {
            setLoadingId(null)
        }
    }

    const handleSaveCustomer = async (orderId: string) => {
        setLoadingId(orderId)
        try {
            await saveAsCustomer(orderId)
            alert('Cliente guardado exitosamente en la base de datos.')
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_saved_as_customer: true } : o))
            if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, is_saved_as_customer: true }))
        } catch (err: any) {
            alert('Error al guardar cliente: ' + err.message)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-16">
                <div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Transactions // Fulfilment</span>
                    <h1 className="font-display text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Pedidos</h1>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-amber-400/5 border border-amber-400/20 p-5 text-center min-w-[110px]">
                        <p className="text-amber-400/60 text-[9px] font-black uppercase tracking-widest mb-1">En Espera WA</p>
                        <h4 className="font-display text-3xl font-black italic text-amber-400">{pendingWaCount}</h4>
                    </div>
                    <div className="bg-emerald-400/5 border border-emerald-400/10 p-5 text-center">
                        <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mb-1">Confirmados</p>
                        <h4 className="font-display text-3xl font-black italic text-emerald-400">{confirmedCount}</h4>
                    </div>
                    <div className="bg-white text-black p-5 text-center">
                        <p className="text-black/40 text-[9px] font-black uppercase tracking-widest mb-1">Revenue</p>
                        <h4 className="font-display text-2xl font-black italic tracking-tighter">{currency === 'EUR' ? '€' : '$'}{totalRevenue.toFixed(0)}</h4>
                    </div>
                </div>
            </div>

            {/* ── WA Pending Alert ── */}
            {pendingWaCount > 0 && (
                <div className="bg-amber-400/5 border border-amber-400/20 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <MessageCircle size={20} className="text-amber-400" />
                        <div>
                            <p className="text-amber-400 text-[11px] font-black uppercase tracking-widest">{pendingWaCount} pedido{pendingWaCount > 1 ? 's' : ''} pendiente{pendingWaCount > 1 ? 's' : ''} de confirmar por WhatsApp</p>
                            <p className="text-white/30 text-[10px] mt-0.5">Revisa los detalles del cliente y confirma la venta para descontar del stock.</p>
                        </div>
                    </div>
                    <button onClick={() => setStatusFilter('pending_whatsapp')} className="text-amber-400 border border-amber-400/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/10 transition-all flex items-center space-x-2">
                        <span>Ver</span><ChevronRight size={12} />
                    </button>
                </div>
            )}

            {/* ── Filters ── */}
            <div className="bg-[#0a0a0a] border border-white/5 p-8 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="flex items-center bg-white/5 px-6 py-4 border border-white/5 flex-1 group focus-within:border-white/20 transition-all">
                        <Search size={16} className="text-white/20 shrink-0 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre o email..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-[11px] font-black tracking-[0.2em] uppercase ml-4 w-full placeholder:text-white/10"
                        />
                    </div>

                    {/* Date Selector */}
                    <div className="flex items-center space-x-4 bg-white/5 border border-white/5 px-6 py-4">
                        <Calendar size={16} className="text-white/20" />
                        <select
                            value={dateRange}
                            onChange={(e: any) => setDateRange(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-white/60 outline-none cursor-pointer"
                        >
                            <option value="all">Todo el tiempo</option>
                            <option value="today">Hoy</option>
                            <option value="this_month">Este Mes</option>
                            <option value="last_month">Mes Pasado</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {['all', 'pending_whatsapp', 'confirmed', 'paid', 'shipped', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all border ${statusFilter === status
                                ? 'bg-white text-black border-white'
                                : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/60'
                                }`}
                        >
                            {status === 'all' ? 'Todos los Estados' : STATUS_CONFIG[status]?.label || status}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table + Detail Panel ── */}
            <div className="flex gap-6">
                {/* Table */}
                <div className={`bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-500 ${selectedOrder ? 'flex-1' : 'w-full'}`}>
                    {filteredOrders.length === 0 ? (
                        <div className="py-40 text-center flex flex-col items-center">
                            <ShoppingBag size={48} className="text-white/10 mb-6" />
                            <h3 className="font-display text-3xl font-black italic text-white/40">Sin pedidos</h3>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-white/30 text-[9px] uppercase tracking-widest font-black">
                                    <th className="px-6 py-5 border-b border-white/5">Pedido</th>
                                    {!selectedOrder && <th className="px-6 py-5 border-b border-white/5">Cliente</th>}
                                    <th className="px-6 py-5 border-b border-white/5">Estado</th>
                                    <th className="px-6 py-5 border-b border-white/5 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map(order => {
                                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                                    const StatusIcon = status.icon
                                    const MethodIcon = METHOD_ICON[order.checkout_method] || CreditCard
                                    const isSelected = selectedOrder?.id === order.id
                                    const isLoading = loadingId === order.id

                                    return (
                                        <tr
                                            key={order.id}
                                            onClick={() => setSelectedOrder(isSelected ? null : order)}
                                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <MethodIcon size={12} className="text-white/30" />
                                                    <p className="font-black text-[11px] text-white/60">#{order.id.slice(0, 6).toUpperCase()}</p>
                                                </div>
                                                <p className="text-[9px] text-white/20 uppercase tracking-wider">
                                                    {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                </p>
                                            </td>
                                            {!selectedOrder && (
                                                <td className="px-6 py-5">
                                                    <p className="text-[11px] font-bold text-white/70">{order.customer_name || 'Guest'}</p>
                                                    <p className="text-[9px] text-white/25">{order.customer_email}</p>
                                                </td>
                                            )}
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest ${status.bg}`}>
                                                    {isLoading ? <Loader2 size={10} className="animate-spin" /> : <StatusIcon size={10} />}
                                                    <span className={status.color}>{selectedOrder ? status.label.split(' ')[0] : status.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className="font-display font-black text-lg italic">{currency === 'EUR' ? '€' : '$'}{Number(order.total_amount).toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ── Detail Panel ── */}
                {selectedOrder && (
                    <div className="w-96 shrink-0 bg-[#0a0a0a] border border-white/5 flex flex-col animate-in slide-in-from-right-4 duration-300">
                        {/* Panel header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <div>
                                <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">Detalle del Pedido</p>
                                <p className="font-black text-[11px] text-white/60 mt-0.5">#{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-white/20 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Status badge */}
                            <div className="px-6 py-4 border-b border-white/5">
                                {(() => {
                                    const s = STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.pending
                                    const SIcon = s.icon
                                    return (
                                        <div className={`inline-flex items-center space-x-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest ${s.bg} ${s.color}`}>
                                            <SIcon size={12} />
                                            <span>{s.label}</span>
                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Customer info */}
                            <div className="px-6 py-5 border-b border-white/5 space-y-3">
                                <p className="text-white/20 text-[9px] uppercase tracking-widest font-black">Datos del Cliente</p>
                                <div className="flex items-center space-x-3">
                                    <User size={14} className="text-white/20 shrink-0" />
                                    <span className="text-[12px] font-bold text-white">{selectedOrder.customer_name || 'Guest'}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail size={14} className="text-white/20 shrink-0" />
                                    <span className="text-[11px] text-white/50">{selectedOrder.customer_email}</span>
                                </div>
                                {selectedOrder.customer_phone && (
                                    <div className="flex items-center space-x-3">
                                        <Phone size={14} className="text-white/20 shrink-0" />
                                        <span className="text-[11px] text-white/50">{selectedOrder.customer_phone}</span>
                                    </div>
                                )}

                                {selectedOrder.accepts_marketing && (
                                    <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-3 py-1.5 w-fit">
                                        <CheckCircle2 size={10} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Acepta Marketing</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 pt-2">
                                    {selectedOrder.customer_id ? (
                                        <div className="flex items-center space-x-2 text-white/20 bg-white/5 border border-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                                            <Users size={12} />
                                            <span>Ya es Cliente de la Tienda</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSaveCustomer(selectedOrder.id)}
                                            disabled={loadingId === selectedOrder.id}
                                            className="flex items-center space-x-2 bg-white text-black px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/80 transition-all"
                                        >
                                            <Users size={12} />
                                            <span>Guardar en Cartera de Clientes</span>
                                        </button>
                                    )}

                                    {selectedOrder.checkout_method === 'whatsapp' && selectedOrder.customer_phone && (
                                        <a
                                            href={`https://wa.me/${selectedOrder.customer_phone?.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                                        >
                                            <MessageCircle size={12} />
                                            <span>Abrir WhatsApp</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Shipping address */}
                            {selectedOrder.shipping_address && Object.values(selectedOrder.shipping_address).some(Boolean) && (
                                <div className="px-6 py-5 border-b border-white/5 space-y-2">
                                    <p className="text-white/20 text-[9px] uppercase tracking-widest font-black flex items-center space-x-2">
                                        <Package size={10} />
                                        <span>Dirección de Envío</span>
                                    </p>
                                    {selectedOrder.shipping_address.street && (
                                        <p className="text-[11px] text-white/60">{selectedOrder.shipping_address.street}</p>
                                    )}
                                    <p className="text-[11px] text-white/60">
                                        {[
                                            selectedOrder.shipping_address.city,
                                            selectedOrder.shipping_address.postal_code
                                        ].filter(Boolean).join(' ')}
                                        {selectedOrder.shipping_address.country && (
                                            <span className="text-white/30"> — {selectedOrder.shipping_address.country}</span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Order items */}
                            <div className="px-6 py-5 border-b border-white/5 space-y-3">
                                <p className="text-white/20 text-[9px] uppercase tracking-widest font-black">Artículos</p>
                                {(selectedOrder.order_items || []).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[11px] font-bold text-white/80">{item.products?.name || `Producto`}</p>
                                            <p className="text-[9px] text-white/25 uppercase tracking-wider">
                                                Talla: {item.size} · ×{item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-[12px] font-black">{currency === 'EUR' ? '€' : '$'}{(item.price_at_time * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                {(selectedOrder.order_items || []).length === 0 && (
                                    <p className="text-white/20 text-[10px]">Sin artículos registrados</p>
                                )}
                                <div className="border-t border-white/5 pt-3 flex justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</span>
                                    <span className="font-display font-black text-xl italic">{currency === 'EUR' ? '€' : '$'}{Number(selectedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Status selector */}
                            <div className="px-6 py-5 border-b border-white/5">
                                <p className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-3">Cambiar Estado</p>
                                <select
                                    value={selectedOrder.status}
                                    onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                                    disabled={loadingId === selectedOrder.id}
                                    className="w-full bg-white/5 border border-white/10 p-3 text-white text-[11px] font-black uppercase tracking-widest focus:border-white outline-none cursor-pointer"
                                >
                                    <option value="pending_whatsapp">Esperando Confirmación WA</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="confirmed">Confirmado</option>
                                    <option value="paid">Pagado</option>
                                    <option value="shipped">Enviado</option>
                                    <option value="cancelled">Cancelado</option>
                                    <option value="rejected">Rechazado</option>
                                </select>
                            </div>
                        </div>

                        {/* ── Action buttons ── */}
                        <div className="px-6 py-5 border-t border-white/5 space-y-3">
                            {/* Confirm WA order (main CTA) */}
                            {(selectedOrder.status === 'pending_whatsapp' || selectedOrder.status === 'pending') && (
                                <button
                                    onClick={() => handleConfirm(selectedOrder.id)}
                                    disabled={loadingId === selectedOrder.id}
                                    className="w-full bg-emerald-500 text-white py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-all disabled:opacity-50"
                                >
                                    {loadingId === selectedOrder.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                    <span>Confirmar Venta y Descontar Stock</span>
                                </button>
                            )}

                            {/* Secondary actions */}
                            <div className="grid grid-cols-2 gap-3">
                                {selectedOrder.status !== 'rejected' && selectedOrder.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleReject(selectedOrder.id)}
                                        disabled={loadingId === selectedOrder.id}
                                        className="py-3 text-[9px] font-black uppercase tracking-widest border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                                    >
                                        <XCircle size={12} />
                                        <span>Rechazar</span>
                                    </button>
                                )}
                                {selectedOrder.status !== 'shipped' && selectedOrder.status !== 'confirmed' && selectedOrder.status !== 'paid' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                                        disabled={loadingId === selectedOrder.id}
                                        className="py-3 text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/40 hover:bg-white/5 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                                    >
                                        <Clock size={12} />
                                        <span>Pendiente</span>
                                    </button>
                                )}
                            </div>

                            {/* Delete - Restricted to Owner */}
                            {role !== 'moderator' && (
                                <>
                                    {confirmingDelete === selectedOrder.id ? (
                                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 space-y-3">
                                            <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                                                <AlertTriangle size={12} />
                                                <span>¿Eliminar permanentemente?</span>
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(selectedOrder.id)}
                                                    disabled={loadingId === selectedOrder.id}
                                                    className="flex-1 bg-rose-500 text-white py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-rose-400 transition-all disabled:opacity-50"
                                                >
                                                    {loadingId === selectedOrder.id ? <Loader2 size={12} className="animate-spin mx-auto" /> : 'Confirmar'}
                                                </button>
                                                <button onClick={() => setConfirmingDelete(null)} className="flex-1 border border-white/10 text-white/40 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmingDelete(selectedOrder.id)}
                                            className="w-full py-3 text-[9px] font-black uppercase tracking-widest border border-white/5 text-white/20 hover:border-rose-500/30 hover:text-rose-400 transition-all flex items-center justify-center space-x-2"
                                        >
                                            <Trash2 size={12} />
                                            <span>Eliminar Pedido</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
