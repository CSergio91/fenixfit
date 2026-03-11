'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, ChevronDown, ChevronUp, ShieldCheck, BarChart2, Settings } from 'lucide-react'

interface CookiePreferences {
    necessary: boolean  // always true, non-negotiable
    analytics: boolean
    preferences: boolean
}

const COOKIE_KEY = 'fenixfit_cookie_consent'

export function CookieBanner() {
    const [show, setShow] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [prefs, setPrefs] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        preferences: false,
    })

    useEffect(() => {
        // Small delay so it doesn't flash before hydration
        const timer = setTimeout(() => {
            try {
                const stored = localStorage.getItem(COOKIE_KEY)
                if (!stored) setShow(true)
            } catch {
                setShow(true)
            }
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    const save = (accepted: CookiePreferences) => {
        try {
            localStorage.setItem(COOKIE_KEY, JSON.stringify({
                ...accepted,
                savedAt: new Date().toISOString()
            }))
            // If analytics enabled, you'd initialize GA here:
            // if (accepted.analytics) { initGA() }
        } catch { }
        setShow(false)
    }

    const acceptAll = () => save({ necessary: true, analytics: true, preferences: true })
    const rejectAll = () => save({ necessary: true, analytics: false, preferences: false })
    const saveCustom = () => save(prefs)

    if (!show) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 md:p-8 md:items-end md:justify-start pointer-events-none">
            <div className="pointer-events-auto w-full max-w-lg bg-[#0d0d0d] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/5 flex items-center justify-center">
                            <Cookie size={16} className="text-white/60" />
                        </div>
                        <div>
                            <p className="font-black text-[11px] uppercase tracking-widest text-white">Gestión de Cookies</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold">Fenix Fit · RGPD Compliant</p>
                        </div>
                    </div>
                    <button
                        onClick={rejectAll}
                        className="text-white/20 hover:text-white transition-colors p-1"
                        aria-label="Cerrar y rechazar cookies"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-7 py-5">
                    <p className="text-[11px] text-white/40 leading-relaxed mb-5">
                        Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y recordar tus preferencias. Puedes personalizar tus opciones o aceptarlas todas.
                        <Link href="/privacidad#cookies" className="text-white/60 underline underline-offset-2 ml-1 hover:text-white transition-colors">Más info.</Link>
                    </p>

                    {/* Cookie categories (expandable) */}
                    {showDetails && (
                        <div className="space-y-3 mb-5 animate-in fade-in duration-300">
                            {/* Necessary */}
                            <div className="border border-white/5 bg-white/[0.02] p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <ShieldCheck size={14} className="text-white/40" />
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wider text-white/70">Necesarias</p>
                                            <p className="text-[9px] text-white/25 mt-0.5">Sesión, carrito, seguridad</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 border border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/30">
                                        Siempre activas
                                    </div>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="border border-white/5 bg-white/[0.02] p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <BarChart2 size={14} className="text-white/40" />
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wider text-white/70">Analíticas</p>
                                            <p className="text-[9px] text-white/25 mt-0.5">Estadísticas de tráfico anónimas</p>
                                        </div>
                                    </div>
                                    <button
                                        role="switch"
                                        aria-checked={prefs.analytics}
                                        onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                                        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${prefs.analytics ? 'bg-white' : 'bg-white/10'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${prefs.analytics ? 'left-5 bg-black' : 'left-0.5 bg-white/30'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="border border-white/5 bg-white/[0.02] p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <Settings size={14} className="text-white/40" />
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wider text-white/70">Preferencias</p>
                                            <p className="text-[9px] text-white/25 mt-0.5">Idioma, moneda, tema</p>
                                        </div>
                                    </div>
                                    <button
                                        role="switch"
                                        aria-checked={prefs.preferences}
                                        onClick={() => setPrefs(p => ({ ...p, preferences: !p.preferences }))}
                                        className={`relative w-10 h-5 rounded-full transition-all duration-300 ${prefs.preferences ? 'bg-white' : 'bg-white/10'}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${prefs.preferences ? 'left-5 bg-black' : 'left-0.5 bg-white/30'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors mb-6"
                    >
                        {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <span>{showDetails ? 'Ocultar opciones' : 'Personalizar cookies'}</span>
                    </button>
                </div>

                {/* Actions */}
                <div className="px-7 pb-7 flex flex-col sm:flex-row gap-3">
                    {showDetails && (
                        <button
                            onClick={saveCustom}
                            className="flex-1 border border-white/20 text-white/60 py-3.5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            Guardar selección
                        </button>
                    )}
                    <button
                        onClick={rejectAll}
                        className="flex-1 border border-white/10 text-white/30 py-3.5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                        Solo necesarias
                    </button>
                    <button
                        onClick={acceptAll}
                        className="flex-1 bg-white text-black py-3.5 text-[9px] font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                    >
                        Aceptar todas
                    </button>
                </div>
            </div>
        </div>
    )
}
