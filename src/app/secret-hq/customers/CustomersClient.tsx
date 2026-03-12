'use client'

import { useState } from 'react'
import {
    Users, Search, Mail, Phone, Calendar,
    ArrowRight, Edit3, Trash2, X, ShoppingBag,
    CheckCircle2, Megaphone, Loader2, Save,
    ChevronDown, ChevronUp, ExternalLink
} from "lucide-react"
import { updateCustomer, deleteCustomer, getCustomerOrders, sendPromotionalEmail } from '@/app/actions/admin-actions'

export default function CustomersClient({
    initialCustomers,
    initialMarketing,
    currency
}: {
    initialCustomers: any[],
    initialMarketing: any[],
    currency: string
}) {
    const [customers, setCustomers] = useState(initialCustomers)
    const [marketing] = useState(initialMarketing)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [customerOrders, setCustomerOrders] = useState<any[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [isLoadingOrders, setIsLoadingOrders] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null)
    const [showPromoSelect, setShowPromoSelect] = useState<string | null>(null)

    const filteredCustomers = customers.filter(c =>
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectCustomer = async (customer: any) => {
        if (selectedCustomer?.id === customer.id) {
            setSelectedCustomer(null)
            setCustomerOrders([])
            return
        }
        setSelectedCustomer(customer)
        setIsLoadingOrders(true)
        try {
            const orders = await getCustomerOrders(customer.id)
            setCustomerOrders(orders)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoadingOrders(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const updated = await updateCustomer(selectedCustomer.id, selectedCustomer)
            setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))
            setIsEditing(false)
            alert('Cliente actualizado')
        } catch (err: any) {
            alert('Error: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este cliente? Sus pedidos se mantendrán pero dejarán de estar asociados a él.')) return
        try {
            await deleteCustomer(id)
            setCustomers(prev => prev.filter(c => c.id !== id))
            if (selectedCustomer?.id === id) setSelectedCustomer(null)
        } catch (err: any) {
            alert('Error: ' + err.message)
        }
    }

    const sendPromo = async (promo: any) => {
        setIsSendingEmail(promo.id)
        try {
            await sendPromotionalEmail(selectedCustomer.email, promo)
            alert(`Campaña "${promo.title}" enviada exitosamente a ${selectedCustomer.email}`)
        } catch (err: any) {
            alert('Error al enviar correo: ' + err.message)
        } finally {
            setIsSendingEmail(null)
            setShowPromoSelect(null)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-16">
                <div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">CRM // Retention</span>
                    <h1 className="font-display text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Clientes</h1>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/5 p-5 text-center min-w-[140px]">
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Clientes</p>
                        <h4 className="font-display text-3xl font-black italic">{customers.length}</h4>
                    </div>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="bg-[#0a0a0a] border border-white/5 p-8">
                <div className="flex items-center bg-white/5 px-6 py-4 border border-white/5 group focus-within:border-white/20 transition-all">
                    <Search size={16} className="text-white/20 shrink-0 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-[11px] font-black tracking-[0.2em] uppercase ml-4 w-full placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* ── List ── */}
                <div className={`transition-all duration-500 ${selectedCustomer ? 'lg:w-[40%]' : 'w-full'}`}>
                    <div className="bg-[#0a0a0a] border border-white/5 overflow-x-auto no-scrollbar">
                        <div className="min-w-[500px] lg:min-w-0">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 text-white/30 text-[9px] uppercase tracking-widest font-black">
                                        <th className="px-6 py-5 border-b border-white/5">Cliente</th>
                                        {!selectedCustomer && (
                                            <>
                                                <th className="px-6 py-5 border-b border-white/5">Último Pedido</th>
                                                <th className="px-6 py-5 border-b border-white/5 text-right">Inversión</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.map(c => (
                                        <tr
                                            key={c.id}
                                            onClick={() => handleSelectCustomer(c)}
                                            className={`cursor-pointer transition-colors ${selectedCustomer?.id === c.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="font-black font-display text-[13px] tracking-tight text-white mb-0.5 uppercase italic">{c.name || 'Invitado'}</div>
                                                <div className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">{c.email}</div>
                                            </td>
                                            {!selectedCustomer && (
                                                <>
                                                    <td className="px-6 py-5">
                                                        <div className="text-[10px] text-white/60 font-black uppercase tracking-widest">
                                                            {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                        <div className="text-[9px] text-white/20 uppercase font-bold">{c.orders_count} pedidos</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="font-display font-black text-white italic">{currency === 'EUR' ? '€' : '$'}{Number(c.total_spent).toFixed(0)}</div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Detail Panel ── */}
                {selectedCustomer && (
                    <div className="flex-1 animate-in fade-in slide-in-from-right-10 duration-500">
                        <div className="bg-[#0a0a0a] border border-white/5 sticky top-8 overflow-hidden">
                            {/* Panel Header */}
                            <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 className="font-display text-4xl font-black italic tracking-tighter uppercase">{isEditing ? 'Editar Perfil' : selectedCustomer.name || 'Invitado'}</h2>
                                        {selectedCustomer.accepts_marketing && (
                                            <span className="bg-emerald-400/10 text-emerald-400 text-[8px] font-black px-2 py-0.5 uppercase tracking-[0.2em] rounded-full border border-emerald-400/20">Marketing OK</span>
                                        )}
                                    </div>
                                    <p className="text-white/20 text-[10px] uppercase tracking-widest font-black">ID: {selectedCustomer.id.slice(0, 18)}...</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all"
                                    >
                                        <Edit3 size={16} className={isEditing ? 'text-blue-400' : 'text-white/40'} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedCustomer.id)}
                                        className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all"
                                    >
                                        <Trash2 size={16} className="text-rose-500/40" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedCustomer(null)}
                                        className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all ml-4"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                {isEditing ? (
                                    <form onSubmit={handleUpdate} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    value={selectedCustomer.name || ''}
                                                    onChange={e => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 p-4 text-[11px] font-black uppercase tracking-widest focus:border-white/20 focus:ring-0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Teléfono</label>
                                                <input
                                                    type="text"
                                                    value={selectedCustomer.phone || ''}
                                                    onChange={e => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 p-4 text-[11px] font-black uppercase tracking-widest focus:border-white/20 focus:ring-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Email</label>
                                            <input
                                                type="email"
                                                value={selectedCustomer.email || ''}
                                                onChange={e => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 p-4 text-[11px] font-black uppercase tracking-widest focus:border-white/20 focus:ring-0"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-white/5 border border-white/5">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomer.accepts_marketing}
                                                onChange={e => setSelectedCustomer({ ...selectedCustomer, accepts_marketing: e.target.checked })}
                                                className="bg-black border-white/10 text-white rounded-none focus:ring-0"
                                            />
                                            <label className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Acepta marketing y correos promocionales</label>
                                        </div>
                                        <button
                                            disabled={isSaving}
                                            className="w-full bg-white text-black py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/80 transition-all flex items-center justify-center space-x-3"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                            <span>Guardar Cambios</span>
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-12">
                                        {/* Contact Cards */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 border border-white/5 p-6 space-y-2">
                                                <div className="flex items-center text-white/20 space-x-2">
                                                    <Mail size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Email</span>
                                                </div>
                                                <p className="text-[11px] font-black uppercase">{selectedCustomer.email}</p>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-6 space-y-2">
                                                <div className="flex items-center text-white/20 space-x-2">
                                                    <Phone size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Teléfono</span>
                                                </div>
                                                <p className="text-[11px] font-black uppercase">{selectedCustomer.phone || 'No registrado'}</p>
                                            </div>
                                        </div>

                                        {/* Marketing Actions */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center">
                                                    <Megaphone size={16} className="mr-3 text-white/40" /> Campañas de Marketing
                                                </h4>
                                            </div>

                                            {selectedCustomer.accepts_marketing ? (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowPromoSelect(showPromoSelect ? null : 'active')}
                                                        className="w-full bg-blue-600/10 border border-blue-600/30 text-blue-400 p-5 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all flex items-center justify-between"
                                                    >
                                                        <span>Enviar Correo Promocional</span>
                                                        {showPromoSelect ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>

                                                    {showPromoSelect && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 z-10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                            {marketing.length === 0 ? (
                                                                <div className="p-8 text-center text-white/20 text-[9px] font-black uppercase tracking-widest">No hay campañas activas</div>
                                                            ) : (
                                                                <div className="divide-y divide-white/5">
                                                                    {marketing.map(promo => (
                                                                        <button
                                                                            key={promo.id}
                                                                            onClick={() => sendPromo(promo)}
                                                                            disabled={!!isSendingEmail}
                                                                            className="w-full p-6 text-left hover:bg-white/5 transition-all flex items-center justify-between group"
                                                                        >
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">{promo.title}</p>
                                                                                <p className="text-[9px] text-white/30 uppercase mt-1 line-clamp-1">{promo.description}</p>
                                                                            </div>
                                                                            {isSendingEmail === promo.id ? (
                                                                                <Loader2 className="animate-spin text-blue-400" size={14} />
                                                                            ) : (
                                                                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-rose-500/5 border border-rose-500/10 p-6 flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                                                        <X size={16} className="text-rose-500" />
                                                    </div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 leading-relaxed">
                                                        Este cliente no ha dado consentimiento para recibir comunicaciones comerciales. No puedes enviarle correos promocionales.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order History */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center">
                                                    <ShoppingBag size={16} className="mr-3 text-white/40" /> Historial de Pedidos
                                                </h4>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{customerOrders.length} transacciones</span>
                                            </div>

                                            {isLoadingOrders ? (
                                                <div className="py-12 flex justify-center">
                                                    <Loader2 className="animate-spin text-white/20" size={24} />
                                                </div>
                                            ) : customerOrders.length === 0 ? (
                                                <div className="py-12 text-center text-white/10 text-[10px] uppercase font-black tracking-widest">Sin registros de compra</div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {customerOrders.map(order => (
                                                        <div key={order.id} className="bg-white/[0.03] border border-white/5 p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                                                            <div className="flex items-center space-x-6">
                                                                <div className="w-10 h-10 border border-white/5 flex items-center justify-center bg-black">
                                                                    <div className={`w-2 h-2 rounded-full ${['confirmed', 'paid', 'shipped'].includes(order.status) ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                                    <div className="flex items-center space-x-3 text-[9px] text-white/20 uppercase font-bold mt-1">
                                                                        <Calendar size={10} />
                                                                        <span>{new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-display font-black text-[14px] italic">{currency === 'EUR' ? '€' : '$'}{order.total_amount}</p>
                                                                <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${['confirmed', 'paid', 'shipped'].includes(order.status) ? 'text-emerald-400' : 'text-amber-400'}`}>{order.status}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
