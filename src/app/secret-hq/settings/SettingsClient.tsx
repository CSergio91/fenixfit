'use client'

import { useState } from 'react'
import {
    Save, Loader2, Globe, MessageSquare, Mail, Phone, MapPin,
    CheckCircle2, Instagram, ExternalLink, Database,
    CreditCard, MessageCircle, ShoppingBag, ChevronRight
} from "lucide-react"
import { upsertSettings } from '@/app/actions/admin-actions'

interface SettingsClientProps {
    initialSettings: any
}

type CheckoutType = 'stripe' | 'whatsapp' | 'email'

const CHECKOUT_OPTIONS: { value: CheckoutType; label: string; icon: any; description: string; color: string }[] = [
    {
        value: 'stripe',
        label: 'Stripe / Tarjeta',
        icon: CreditCard,
        description: 'Checkout con pago online seguro. Compatible con Klarna, tarjeta de crédito y débito.',
        color: 'blue'
    },
    {
        value: 'whatsapp',
        label: 'WhatsApp Manual',
        icon: MessageCircle,
        description: 'El cliente envía su pedido por WhatsApp. Tú confirmas la venta y acuerdas el pago.',
        color: 'emerald'
    },
    {
        value: 'email',
        label: 'Email / Contacto',
        icon: Mail,
        description: 'El cliente envía su pedido por correo electrónico. Ideal para mercados sin Stripe.',
        color: 'violet'
    }
]

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [dbError, setDbError] = useState(false)
    const [formData, setFormData] = useState<any>(initialSettings || {
        store_name: 'Fenix Fit',
        contact_email: 'cbs@bcnnorth.com',
        contact_phone: '',
        address: '',
        instagram_url: '',
        whatsapp_number: '',
        currency: 'USD',
        shipping_fee: 0,
        checkout_type: 'stripe'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSaved(false)
        setDbError(false)
        try {
            await upsertSettings(formData)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error: any) {
            if (error?.message?.includes('schema cache') || error?.message?.includes('relation') || error?.message?.includes('does not exist') || error?.message?.includes('column')) {
                setDbError(true)
            } else {
                alert('Error al guardar: ' + error?.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const checkoutColor: Record<CheckoutType, string> = {
        stripe: 'blue',
        whatsapp: 'emerald',
        email: 'violet'
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="border-b border-white/5 pb-12">
                <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">System // Global Control</span>
                <h1 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                    Configuración
                </h1>
            </div>

            {/* DB Error Banner */}
            {dbError && (
                <div className="bg-amber-400/5 border border-amber-400/20 p-8 space-y-6">
                    <div className="flex items-start space-x-4">
                        <Database size={24} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-amber-400 mb-2">Tabla Faltante — Acción Requerida</p>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                La tabla <code className="text-amber-300 bg-amber-400/10 px-1">store_settings</code> no existe o le faltan columnas.
                                Ejecuta el SQL en el editor de Supabase:
                            </p>
                            <a
                                href="https://supabase.com/dashboard/project/nflojloxwutopunsqerg/sql/new"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-amber-400 text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-amber-300 transition-all"
                            >
                                <ExternalLink size={14} />
                                <span>Abrir SQL Editor de Supabase</span>
                            </a>
                        </div>
                    </div>
                    <pre className="bg-black/40 border border-white/5 p-6 text-[10px] text-emerald-400 overflow-x-auto leading-relaxed font-mono">
                        {`create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text default 'Fenix Fit',
  contact_email text,
  contact_phone text,
  address text,
  instagram_url text,
  whatsapp_number text,
  currency text default 'USD',
  shipping_fee numeric(10,2) default 0.00,
  checkout_type text default 'stripe',
  updated_at timestamptz default now()
);

alter table public.store_settings enable row level security;

create policy if not exists "store_settings_public_read"
  on public.store_settings for select using (true);

create policy if not exists "store_settings_auth_all"
  on public.store_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.store_settings
  (id, store_name, contact_email, currency, checkout_type)
values
  ('00000000-0000-0000-0000-000000000001', 'Fenix Fit', 'cbs@bcnnorth.com', 'USD', 'stripe')
on conflict (id) do nothing;

-- Add checkout_type if the table exists but column is missing:
alter table public.store_settings add column if not exists checkout_type text default 'stripe';`}
                    </pre>
                </div>
            )}

            {/* Success Banner */}
            {saved && (
                <div className="bg-emerald-400/5 border border-emerald-400/20 p-5 flex items-center space-x-4 animate-in fade-in duration-300">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                        Configuración sincronizada correctamente
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ── Checkout Type ── */}
                <div className="bg-[#0a0a0a] border border-white/5 p-10">
                    <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-2 flex items-center">
                        <ShoppingBag size={14} className="mr-3" /> Método de Checkout
                    </h3>
                    <p className="text-white/20 text-[10px] mb-8">Elige cómo recibirás los pedidos de tus clientes.</p>

                    <div className="grid grid-cols-1 gap-4">
                        {CHECKOUT_OPTIONS.map(opt => {
                            const isActive = formData.checkout_type === opt.value
                            const Icon = opt.icon
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, checkout_type: opt.value })}
                                    className={`flex items-center space-x-5 p-6 text-left border transition-all duration-200 ${isActive
                                            ? opt.value === 'stripe' ? 'border-blue-500/50 bg-blue-500/5'
                                                : opt.value === 'whatsapp' ? 'border-emerald-500/50 bg-emerald-500/5'
                                                    : 'border-violet-500/50 bg-violet-500/5'
                                            : 'border-white/5 hover:border-white/20 bg-transparent'
                                        }`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${isActive
                                            ? opt.value === 'stripe' ? 'bg-blue-500/10'
                                                : opt.value === 'whatsapp' ? 'bg-emerald-500/10'
                                                    : 'bg-violet-500/10'
                                            : 'bg-white/5'
                                        }`}>
                                        <Icon size={20} className={
                                            isActive
                                                ? opt.value === 'stripe' ? 'text-blue-400'
                                                    : opt.value === 'whatsapp' ? 'text-emerald-400'
                                                        : 'text-violet-400'
                                                : 'text-white/30'
                                        } />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-black text-[12px] uppercase tracking-widest mb-1 ${isActive ? 'text-white' : 'text-white/50'}`}>
                                            {opt.label}
                                        </p>
                                        <p className="text-[10px] text-white/25 leading-relaxed">{opt.description}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${isActive
                                            ? opt.value === 'stripe' ? 'border-blue-400 bg-blue-400'
                                                : opt.value === 'whatsapp' ? 'border-emerald-400 bg-emerald-400'
                                                    : 'border-violet-400 bg-violet-400'
                                            : 'border-white/20 bg-transparent'
                                        }`}>
                                        {isActive && <CheckCircle2 size={10} className="text-black" />}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* WhatsApp number helper (only when WA checkout selected) */}
                    {formData.checkout_type === 'whatsapp' && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 flex items-center">
                                <MessageCircle size={10} className="mr-2 text-emerald-400" />
                                Número de WhatsApp (con prefijo de país)
                            </label>
                            <input
                                type="text"
                                value={formData.whatsapp_number}
                                onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                className="w-full bg-white/5 border border-emerald-500/30 p-4 text-white text-sm focus:border-emerald-400 outline-none transition-all"
                                placeholder="+34 612 345 678"
                            />
                            <p className="text-white/20 text-[9px] mt-2">Ejemplo: +34612345678 · Los clientes abrirán WhatsApp con su pedido ya redactado.</p>
                        </div>
                    )}
                </div>

                {/* ── Brand Identity ── */}
                <div className="bg-[#0a0a0a] border border-white/5 p-10">
                    <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-8 flex items-center">
                        <Globe size={14} className="mr-3" /> Identidad de la Marca
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Nombre de la Tienda</label>
                            <input
                                type="text"
                                value={formData.store_name}
                                onChange={e => setFormData({ ...formData, store_name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-black uppercase tracking-widest focus:border-white outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Moneda</label>
                                <select
                                    value={formData.currency}
                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full bg-[#0d0d0d] border border-white/10 p-4 text-white text-sm focus:border-white outline-none cursor-pointer"
                                >
                                    <option value="USD">USD — Dólar</option>
                                    <option value="EUR">EUR — Euro</option>
                                    <option value="MXN">MXN — Peso MX</option>
                                    <option value="COP">COP — Peso CO</option>
                                    <option value="GBP">GBP — Libra</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Tarifa de Envío ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-black">$</span>
                                    <input
                                        type="number" step="0.01" min="0"
                                        value={formData.shipping_fee}
                                        onChange={e => setFormData({ ...formData, shipping_fee: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 pl-8 pr-4 py-4 text-white text-sm font-black focus:border-white outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Contact & Social ── */}
                <div className="bg-[#0a0a0a] border border-white/5 p-10">
                    <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-8 flex items-center">
                        <MessageSquare size={14} className="mr-3" /> Contacto y Redes
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 flex items-center">
                                <Mail size={10} className="mr-2" /> Email de Contacto
                            </label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 flex items-center">
                                <Phone size={10} className="mr-2" /> WhatsApp / Teléfono
                            </label>
                            <input
                                type="text"
                                value={formData.whatsapp_number}
                                onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                                placeholder="+34 ..."
                            />
                        </div>
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 flex items-center">
                                <Instagram size={10} className="mr-2" /> Instagram URL
                            </label>
                            <input
                                type="text"
                                value={formData.instagram_url}
                                onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 flex items-center">
                                <MapPin size={10} className="mr-2" /> Dirección
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                                placeholder="Calle ..."
                            />
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex justify-between items-center pt-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
                        Los cambios se aplican en tiempo real a la tienda
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 transition-all ${saved ? 'bg-emerald-400 text-black' : 'bg-white text-black hover:bg-white/90'
                            } disabled:opacity-50`}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        <span>{saved ? 'Guardado ✓' : 'Guardar Cambios'}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
