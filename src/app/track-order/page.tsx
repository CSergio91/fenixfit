"use client";

import { useState } from 'react';
import { Truck, Search, Package, MapPin, Calendar, CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(name),
                        variant:product_variants(color_name)
                    )
                `)
                .eq('id', orderId)
                .eq('customer_email', email.toLowerCase().trim())
                .single();

            if (error) throw new Error('Pedido no encontrado. Verifica los datos.');
            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
            <header className="text-center mb-16">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 block mb-4">Guest Portal</span>
                <h1 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">Seguimiento de Pedido</h1>
                <p className="text-muted-light text-lg font-light max-w-lg mx-auto leading-relaxed">
                    No necesitas cuenta. Ingresa tu Email y el ID que recibiste en tu confirmación para ver el estado.
                </p>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Truck size={200} />
                </div>

                {!order ? (
                    <form onSubmit={handleTrack} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">ID del Pedido</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: d123-abc..."
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary transition-all uppercase"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Tu Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="email@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-[12px] font-bold text-center italic">{error}</p>}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-primary text-white py-5 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-black transition-all shadow-xl rounded-2xl flex items-center justify-center space-x-3"
                        >
                            {loading ? <span className="animate-spin uppercase">Tracking...</span> : (
                                <>
                                    <Search size={16} />
                                    <span>Rastrear Ahora</span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-10 gap-8">
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Pedido {order.id.slice(0, 8).toUpperCase()}</h2>
                                <div className="flex items-center space-x-4">
                                    <span className="bg-primary text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full">{order.status}</span>
                                    <span className="text-[11px] text-gray-400 font-medium flex items-center space-x-2">
                                        <Calendar size={12} />
                                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Pagado</p>
                                <p className="text-3xl font-black">${order.total_amount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center space-x-2">
                                    <Package size={14} />
                                    <span>Artículos</span>
                                </h3>
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-bold">{item.product.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                                    {item.variant.color_name} • Size {item.size} • Cant. {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-black font-display">${item.price_at_time}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center space-x-2">
                                    <MapPin size={14} />
                                    <span>Información</span>
                                </h3>
                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                    <p className="text-sm font-bold capitalize">{order.customer_name}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                        {order.customer_email}<br />
                                        {order.shipping_address ? (
                                            <>
                                                {order.shipping_address.city}, {order.shipping_address.country}
                                            </>
                                        ) : 'Dirección digital/pendiente'}
                                    </p>
                                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-200 pt-4 mt-4">
                                        <CreditCard size={12} />
                                        <span>Pago Seguro vía Stripe / Klarna</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <button
                            onClick={() => setOrder(null)}
                            className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors block text-center mt-10"
                        >
                            ← Rastrear otro pedido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
