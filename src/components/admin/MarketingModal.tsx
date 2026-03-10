'use client'

import { useState } from 'react'
import { X, Save, Loader2, Monitor, Smartphone } from 'lucide-react'
import { upsertMarketingAsset } from '@/app/actions/admin-actions'

interface MarketingModalProps {
    asset?: any
    onClose: () => void
}

export default function MarketingModal({ asset, onClose }: MarketingModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<any>({
        id: asset?.id || null,
        type: asset?.type || 'banner_home',
        image_url: asset?.image_url || '',
        target_url: asset?.target_url || '',
        title: asset?.title || '',
        description: asset?.description || '',
        is_active: asset?.is_active ?? true,
        priority: asset?.priority || 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await upsertMarketingAsset(formData)
            onClose()
        } catch (error) {
            console.error(error)
            alert('Error al guardar el activo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[#111]">
                    <div>
                        <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black mb-1 block">Campaign Control</span>
                        <h2 className="font-display text-2xl font-black italic tracking-tight uppercase">
                            {asset ? 'Editar Activo' : 'Crear Campaña'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 text-white/40 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Tipo de Activo</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                            >
                                <option value="banner_home">Banner Home</option>
                                <option value="popup">Pop-up Promo</option>
                                <option value="sidebar">Sidebar Ad</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Prioridad</label>
                            <input
                                type="number"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Título de la Campaña</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-white outline-none"
                            placeholder="Ej: Temporada de Rebajas"
                        />
                    </div>

                    <div>
                        <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Imagen URL (Desktop)</label>
                        <input
                            type="text"
                            required
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] focus:border-white outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-2 block">Target URL (Redirect)</label>
                        <input
                            type="text"
                            value={formData.target_url}
                            onChange={e => setFormData({ ...formData, target_url: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-4 text-white text-[11px] focus:border-white outline-none"
                            placeholder="/collections/sale"
                        />
                    </div>

                    <div className="flex items-center space-x-6 pt-4">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-5 h-5 bg-white/5 border border-white/10 checked:bg-white checked:border-white transition-all outline-none rounded-none"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-all">Activar Inmediatamente</span>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-10 flex justify-end items-center space-x-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={loading}
                            className="bg-white text-black px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-white/90 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{asset ? 'Actualizar Activo' : 'Deploy Campaña'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
