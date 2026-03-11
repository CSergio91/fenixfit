'use client'

import { useState } from 'react'
import Image from "next/image"
import {
    Plus,
    Monitor,
    Smartphone,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Edit3,
    Eye,
    X,
    Trash2,
    Megaphone,
    Save,
    Loader2
} from "lucide-react"
import MarketingModal from '@/components/admin/MarketingModal'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'
import { deleteMarketingAsset, upsertSettings } from '@/app/actions/admin-actions'
import { useSettingsStore } from '@/store/useSettingsStore'

interface MarketingClientProps {
    initialAssets: any[]
    products: any[]
    initialSettings: any
}

export default function MarketingClient({ initialAssets, products, initialSettings }: MarketingClientProps) {
    const [assets, setAssets] = useState(initialAssets)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<any>(null)
    const [announcement, setAnnouncement] = useState(initialSettings?.announcement_text || '')
    const [savingSettings, setSavingSettings] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const fetchSettings = useSettingsStore(state => state.fetchSettings)

    const handleMarketingSuccess = (updatedAsset: any) => {
        setAssets(prev => {
            const exists = prev.find(a => a.id === updatedAsset.id)
            if (exists) {
                return prev.map(a => a.id === updatedAsset.id ? updatedAsset : a)
            } else {
                return [updatedAsset, ...prev]
            }
        })
    }

    const handleAdd = () => {
        setSelectedAsset(null)
        setIsModalOpen(true)
    }

    const handleEdit = (asset: any) => {
        setSelectedAsset(asset)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (asset: any) => {
        setSelectedAsset(asset)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedAsset) {
            await deleteMarketingAsset(selectedAsset.id)
            setAssets(prev => prev.filter(a => a.id !== selectedAsset.id))
        }
    }

    const handleSaveAnnouncement = async () => {
        setSavingSettings(true)
        try {
            await upsertSettings({
                ...initialSettings,
                announcement_text: announcement
            })
            setSettingsSaved(true)
            await fetchSettings()
            setTimeout(() => setSettingsSaved(false), 3000)
        } catch (err) {
            alert('Error al guardar el anuncio')
        } finally {
            setSavingSettings(false)
        }
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-20">
                <div className="max-w-xl">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Visual Assets // Campaign Mgmt</span>
                    <h1 className="font-display text-6xl md:text-8xl font-black italic tracking-tightest uppercase leading-none mb-8">
                        Marketing
                    </h1>
                    <p className="text-white/20 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Control directo sobre la narrativa visual de Fenix Fit. Gestiona banners, pop-ups y anuncios estratégicos.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-white text-black px-12 py-6 text-[11px] font-black uppercase tracking-[0.25em] flex items-center space-x-4 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1"
                >
                    <Plus size={18} />
                    <span>Nueva Campaña</span>
                </button>
            </div>

            {/* Announcement Bar Control */}
            <div className="bg-[#0a0a0a] border border-white/5 p-10">
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1">
                        <label className="text-white/20 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center">
                            <Megaphone size={14} className="mr-3 text-emerald-400" /> Barra de Anuncio Global
                        </label>
                        <p className="text-white/20 text-[10px] mb-8 uppercase tracking-wider">Configura el mensaje que aparece en la parte superior de toda la tienda.</p>
                        <input
                            type="text"
                            value={announcement}
                            onChange={e => setAnnouncement(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 p-5 text-white text-[11px] uppercase font-black tracking-widest outline-none focus:border-white transition-all"
                            placeholder="Ej: ENVÍO GRATUITO EN PEDIDOS SUPERIORES A 50€"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSaveAnnouncement}
                            disabled={savingSettings}
                            className={`w-full md:w-auto px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all ${settingsSaved ? 'bg-emerald-500 text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'
                                }`}
                        >
                            {savingSettings ? <Loader2 size={16} className="animate-spin" /> : settingsSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                            <span>{settingsSaved ? 'SINCRONIZADO ✓' : 'ACTUALIZAR BARRA'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 gap-12">
                {assets?.map((asset) => (
                    <div key={asset.id} className="group flex flex-col xl:flex-row bg-[#080808] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden min-h-[400px]">
                        {/* Visual Preview */}
                        <div className="w-full xl:w-2/5 relative h-80 xl:h-auto overflow-hidden bg-black flex items-center justify-center p-4">
                            <div className="relative w-full h-full border border-white/10 group-hover:scale-105 transition-transform duration-1000">
                                <Image
                                    src={asset.image_url}
                                    alt={asset.title || 'Marketing Asset'}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white uppercase italic font-black font-display text-4xl leading-none">
                                    {asset.title}
                                </div>
                            </div>
                            <div className="absolute top-8 left-8 flex space-x-3">
                                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-black tracking-widest text-white uppercase flex items-center">
                                    <Monitor size={12} className="mr-2" /> DESKTOP
                                </div>
                            </div>
                        </div>

                        {/* Asset Details */}
                        <div className="flex-1 p-10 xl:p-16 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-10">
                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Identificación de Activo</label>
                                        <h4 className="text-[13px] font-black uppercase tracking-widest text-white mb-2">{asset.type}</h4>
                                        <p className="text-white/30 text-[11px] font-medium leading-relaxed italic">{asset.description || 'Sin descripción adicional'}</p>
                                    </div>

                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Dirección de Destino (URL)</label>
                                        <p className="text-[11px] font-black text-white/60 tracking-tight hover:text-white cursor-pointer transition-colors max-w-sm truncate inline-flex items-center">
                                            {asset.target_url || 'SIN DESTINO CONFIGURADO'}
                                            <ChevronRight size={12} className="ml-2" />
                                        </p>
                                    </div>

                                    {asset.product_id && (
                                        <div>
                                            <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Producto en Promoción</label>
                                            <div className="bg-white/5 border border-white/5 p-4 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                                    {products.find(p => p.id === asset.product_id)?.name || 'Producto Desconocido'}
                                                </span>
                                                <span className="text-emerald-400 text-[10px] font-black">
                                                    SAVE PRICE: {asset.sale_price}€
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Estado de Operación</label>
                                        <div className="flex items-center space-x-6">
                                            <span className={`flex items-center text-[10px] font-black px-4 py-2 uppercase tracking-widest ${asset.is_active ? 'bg-emerald-400/5 text-emerald-400 border border-emerald-400/20' : 'bg-red-500/5 text-red-500 border border-red-500/20'
                                                }`}>
                                                {asset.is_active ? <CheckCircle2 size={14} className="mr-3" /> : <AlertCircle size={14} className="mr-3" />}
                                                {asset.is_active ? 'Activo en Web' : 'Inactivo / Archivo'}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                                Prioridad: <span className="text-white font-black">{asset.priority}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-12 pt-10 border-t border-white/5">
                                <button
                                    onClick={() => handleEdit(asset)}
                                    className="flex-1 md:flex-none bg-white/5 border border-white/10 px-10 py-4 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-white hover:text-black transition-all"
                                >
                                    <Edit3 size={14} />
                                    <span>Editar Activo</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(asset)}
                                    className="flex-1 md:flex-none border border-red-500/20 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-red-500 hover:text-white transition-all text-red-500/60 ml-auto"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {assets.length === 0 && (
                    <div className="py-40 text-center border border-dashed border-white/5">
                        <Megaphone size={48} className="mx-auto mb-8 text-white/10" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20">No hay activos de marketing configurados</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <MarketingModal
                    asset={selectedAsset}
                    products={products}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleMarketingSuccess}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteConfirmModal
                    title="¿ELIMINAR ACTIVO?"
                    description={`ESTA ACCIÓN ELIMINARÁ DE FORMA PERMANENTE LA CAMPAÑA "${selectedAsset?.title?.toUpperCase()}" DEL SERVIDOR CENTRAL.`}
                    onConfirm={confirmDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    )
}
