'use client'

import { useState, useCallback } from 'react'
import { X, Plus, Trash2, Save, Loader2, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { upsertProduct } from '@/app/actions/admin-actions'
import ImagePickerModal from './ImagePickerModal'

// ─── Constants ───────────────────────────────────────────────────────────────
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '34', '36', '38', '40', '42', '44', 'ONE SIZE']

const PRESET_COLORS = [
    // Neutrals
    { name: 'Onyx Black', hex: '#0a0a0a' },
    { name: 'Pure White', hex: '#F8F8F8' },
    { name: 'Charcoal', hex: '#36393E' },
    { name: 'Stone Grey', hex: '#9B9EA4' },
    { name: 'Ivory', hex: '#F2EFE8' },
    { name: 'Nude Beige', hex: '#D4B8A0' },
    // Warm
    { name: 'Dusty Rose', hex: '#C9897A' },
    { name: 'Coral Red', hex: '#E8563A' },
    { name: 'Oxblood', hex: '#6B1A1A' },
    { name: 'Caramel', hex: '#C08040' },
    { name: 'Terracotta', hex: '#C2714F' },
    // Cool / Nature
    { name: 'Alpine Green', hex: '#3D6B52' },
    { name: 'Sage', hex: '#8A9E7B' },
    { name: 'Midnight Blue', hex: '#1a2744' },
    { name: 'Ocean Teal', hex: '#2E7B8A' },
    { name: 'Lavender', hex: '#9171A7' },
    { name: 'Lilac', hex: '#C4AFD8' },
    { name: 'Sky Blue', hex: '#6EA8CC' },
    // Vivid
    { name: 'Electric Pink', hex: '#E91E8C' },
    { name: 'Neon Lime', hex: '#B8E020' },
    { name: 'Mango', hex: '#F5A623' },
    { name: 'Purple', hex: '#6F42C1' },
    { name: 'Royal Navy', hex: '#003087' },
    { name: 'Burgundy', hex: '#800020' },
]

interface ProductModalProps {
    product?: any
    categories: any[]
    currency: string
    onClose: () => void
    onSuccess?: (product: any) => void
}

// ─── ImageField: sub-component with bucket picker trigger ───────────────────
function ImageField({
    label,
    value,
    folder,
    onChange,
    required = false,
}: {
    label: string
    value: string
    folder: string
    onChange: (url: string) => void
    required?: boolean
}) {
    const [showPicker, setShowPicker] = useState(false)

    return (
        <div>
            <label className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1 block">{label}</label>
            <div className="flex space-x-2 items-stretch">
                {/* Preview */}
                {value && (
                    <div className="w-12 h-10 shrink-0 border border-white/10 overflow-hidden">
                        <img src={value} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    className="flex-1 bg-white/5 border border-white/10 p-2 text-white text-[10px] outline-none min-w-0"
                    placeholder="Pegar URL o usar ↓ selector"
                />
                <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="shrink-0 px-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white/40 transition-all"
                    title="Seleccionar del bucket"
                >
                    <ImageIcon size={14} />
                </button>
            </div>

            {showPicker && (
                <ImagePickerModal
                    folder={folder}
                    onSelect={onChange}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </div>
    )
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function ProductModal({ product, categories, currency, onClose }: ProductModalProps) {
    const [loading, setLoading] = useState(false)
    const [activeVariantIdx, setActiveVariantIdx] = useState(0)
    const [showColorPalette, setShowColorPalette] = useState<number | null>(null)

    const [formData, setFormData] = useState<any>({
        id: product?.id || null,
        name: product?.name || '',
        price: product?.price || 0,
        original_price: product?.original_price || 0,
        stock: product?.stock || 0,
        category: product?.category || (categories && categories.length > 0 ? categories[0].name : 'Leggings'),
        description: product?.description || '',
        sizes: product?.sizes || ['XS', 'S', 'M', 'L', 'XL'],
        features: product?.features || [],
        badges: product?.badges || [],
        is_active: product?.is_active ?? true
    })

    const [variants, setVariants] = useState<any[]>(
        product?.product_variants?.length
            ? product.product_variants
            : [{ color_name: 'Onyx Black', color_hex: '#0a0a0a', main_image: '', hover_image: '', gallery_images: [] }]
    )

    // ── Size helpers ──────────────────────────────────────────────────────────
    const toggleSize = (size: string) => {
        const current: string[] = formData.sizes || []
        const updated = current.includes(size)
            ? current.filter((s: string) => s !== size)
            : [...current, size]
        setFormData({ ...formData, sizes: updated })
    }

    // ── Feature helpers ───────────────────────────────────────────────────────
    const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] })
    const changeFeature = (i: number, v: string) => {
        const f = [...formData.features]; f[i] = v; setFormData({ ...formData, features: f })
    }
    const removeFeature = (i: number) => setFormData({ ...formData, features: formData.features.filter((_: any, idx: number) => idx !== i) })

    // ── Variant helpers ───────────────────────────────────────────────────────
    const addVariant = () => {
        const newV = { color_name: '', color_hex: '#0a0a0a', main_image: '', hover_image: '', gallery_images: [] }
        setVariants([...variants, newV])
        setActiveVariantIdx(variants.length)
    }

    const removeVariant = (i: number) => {
        if (variants.length === 1) return
        const updated = variants.filter((_, idx) => idx !== i)
        setVariants(updated)
        setActiveVariantIdx(Math.max(0, i - 1))
    }

    const changeVariant = useCallback((i: number, field: string, value: any) => {
        setVariants(prev => {
            const copy = [...prev]
            copy[i] = { ...copy[i], [field]: value }
            return copy
        })
    }, [])

    const applyPresetColor = (variantIdx: number, preset: { name: string; hex: string }) => {
        changeVariant(variantIdx, 'color_name', preset.name)
        changeVariant(variantIdx, 'color_hex', preset.hex)
        setShowColorPalette(null)
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const updated = await upsertProduct(formData, variants)
            if (onSuccess) {
                // Return full data for UI update
                onSuccess({ ...updated, product_variants: variants })
            }
            onClose()
        } catch (err) {
            console.error(err)
            alert('Error al guardar el producto. Revisa la consola.')
        } finally {
            setLoading(false)
        }
    }

    // folder for bucket: sanitize product name or use color name
    const getBucketFolder = (variantColorName: string) => {
        const nameSlug = formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'product'
        const colorSlug = variantColorName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'default'
        return `${nameSlug}/${colorSlug}`
    }

    const activeVariant = variants[activeVariantIdx] || variants[0]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#080808] border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0d0d0d] shrink-0">
                    <div>
                        <span className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black mb-0.5 block">Inventory System // Product Editor</span>
                        <h2 className="font-display text-xl font-black italic tracking-tight uppercase">
                            {product ? `Editar — ${product.name}` : 'Nueva Prenda'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-white/5 text-white/40 hover:text-white transition-all border border-white/5">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Body ── */}
                <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">

                    {/* ──── LEFT PANEL: Basic Info ──── */}
                    <div className="w-[45%] shrink-0 border-r border-white/5 overflow-y-auto p-8 space-y-8">

                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3">Datos del Producto</h3>

                        {/* Name */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Nombre del Producto *</label>
                            <input
                                type="text" required value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm font-bold focus:border-white outline-none transition-all"
                                placeholder="Ej: High-Waist Sculpt Legging"
                            />
                        </div>

                        {/* Price + Original Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Precio *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-black text-sm">{currency === 'EUR' ? '€' : '$'}</span>
                                    <input
                                        type="number" step="0.01" required value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 pl-7 pr-3 py-3 text-white text-sm font-black focus:border-white outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Precio Tachado</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 font-black text-sm">{currency === 'EUR' ? '€' : '$'}</span>
                                    <input
                                        type="number" step="0.01" value={formData.original_price}
                                        onChange={e => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 pl-7 pr-3 py-3 text-white/50 text-sm focus:border-white outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock + Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Stock total *</label>
                                <input
                                    type="number" required value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm font-black focus:border-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Categoría</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-[#0d0d0d] border border-white/10 p-3 text-white text-sm focus:border-white outline-none cursor-pointer"
                                >
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    {categories.length === 0 && (
                                        <>
                                            <option value="Leggings">Leggings</option>
                                            <option value="Tops">Tops</option>
                                            <option value="Shorts">Shorts</option>
                                            <option value="Accessories">Accesorios</option>
                                            <option value="Sets">Sets</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2 block">Descripción</label>
                            <textarea
                                rows={3} value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-white outline-none resize-none"
                                placeholder="Material, ajuste, detalles técnicos..."
                            />
                        </div>

                        {/* ── SIZES Toggle ── */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3">Tallas Disponibles</label>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                    {formData.sizes.length} seleccionadas
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {ALL_SIZES.map(size => {
                                    const active = formData.sizes.includes(size)
                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${active
                                                ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                                                : 'bg-transparent text-white/30 border-white/10 hover:border-white/40 hover:text-white/60'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ── Features ── */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3">Características</label>
                                <button
                                    type="button" onClick={addFeature}
                                    className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/5 px-3 py-1 hover:border-white/20 hover:text-white transition-all flex items-center"
                                >
                                    <Plus size={12} className="mr-1" /> Añadir
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((f: string, i: number) => (
                                    <div key={i} className="flex space-x-2">
                                        <input
                                            value={f}
                                            onChange={e => changeFeature(i, e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-white text-xs outline-none"
                                            placeholder="Ej: Tejido de compresión con Lycra 4D"
                                        />
                                        <button type="button" onClick={() => removeFeature(i)}
                                            className="px-3 border border-white/5 text-white/20 hover:text-rose-500 hover:border-rose-500/20 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active toggle */}
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                className={`relative w-10 h-5 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-emerald-500' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${formData.is_active ? 'left-5' : 'left-0.5'}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-all">
                                Visible en tienda
                            </span>
                        </label>
                    </div>

                    {/* ──── RIGHT PANEL: Color Variants ──── */}
                    <div className="flex-1 flex flex-col overflow-hidden">

                        {/* Variant tabs */}
                        <div className="flex items-center space-x-1 px-6 pt-4 pb-0 border-b border-white/5 bg-[#0a0a0a] shrink-0 overflow-x-auto">
                            {variants.map((v, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveVariantIdx(i)}
                                    className={`flex items-center space-x-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeVariantIdx === i
                                        ? 'border-white text-white'
                                        : 'border-transparent text-white/30 hover:text-white/60'
                                        }`}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full border border-white/20"
                                        style={{ backgroundColor: v.color_hex || '#0a0a0a' }}
                                    />
                                    <span>{v.color_name || `Color ${i + 1}`}</span>
                                    {variants.length > 1 && (
                                        <span
                                            onClick={(e) => { e.stopPropagation(); removeVariant(i) }}
                                            className="ml-1 text-white/20 hover:text-rose-500 transition-colors"
                                        >
                                            <X size={12} />
                                        </span>
                                    )}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center space-x-1 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-all whitespace-nowrap border-b-2 border-transparent"
                            >
                                <Plus size={14} />
                                <span>Nuevo Color</span>
                            </button>
                        </div>

                        {/* Active variant editor */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* Color selector */}
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3 mb-4 block">Color del Variant</label>

                                {/* Color display + input row */}
                                <div className="flex items-center space-x-3 mb-4">
                                    {/* Big color swatch */}
                                    <div
                                        className="w-12 h-12 border-2 border-white/20 shrink-0 shadow-lg"
                                        style={{ backgroundColor: activeVariant?.color_hex }}
                                    />
                                    {/* Color name */}
                                    <input
                                        type="text"
                                        value={activeVariant?.color_name || ''}
                                        onChange={e => changeVariant(activeVariantIdx, 'color_name', e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 p-3 text-white text-sm font-bold focus:border-white outline-none"
                                        placeholder="Nombre del color"
                                        required
                                    />
                                    {/* Hex input */}
                                    <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-3">
                                        <input
                                            type="color"
                                            value={activeVariant?.color_hex || '#000000'}
                                            onChange={e => changeVariant(activeVariantIdx, 'color_hex', e.target.value)}
                                            className="w-6 h-6 cursor-pointer bg-transparent border-none outline-none p-0"
                                        />
                                        <input
                                            type="text"
                                            value={(activeVariant?.color_hex || '').toUpperCase()}
                                            onChange={e => changeVariant(activeVariantIdx, 'color_hex', e.target.value)}
                                            className="w-20 bg-transparent border-none text-white/60 text-[10px] font-black uppercase tracking-widest outline-none"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>

                                {/* Preset palette */}
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-3">Paleta Rápida:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PRESET_COLORS.map(preset => (
                                            <button
                                                key={preset.hex}
                                                type="button"
                                                onClick={() => applyPresetColor(activeVariantIdx, preset)}
                                                title={preset.name}
                                                className={`w-7 h-7 rounded-sm border-2 transition-all hover:scale-110 hover:shadow-lg ${activeVariant?.color_hex === preset.hex
                                                    ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                                    : 'border-white/20 hover:border-white/60'
                                                    }`}
                                                style={{ backgroundColor: preset.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3 mb-4 block">Imágenes del Color</label>

                                <ImageField
                                    label="Imagen Principal *"
                                    value={activeVariant?.main_image || ''}
                                    folder={getBucketFolder(activeVariant?.color_name || '')}
                                    required
                                    onChange={url => changeVariant(activeVariantIdx, 'main_image', url)}
                                />

                                {/* Main preview */}
                                {activeVariant?.main_image && (
                                    <div className="mt-3 relative h-40 overflow-hidden border border-white/10">
                                        <img
                                            src={activeVariant.main_image}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Vista Previa Principal</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hover Image */}
                            <ImageField
                                label="Imagen Hover (al pasar el cursor)"
                                value={activeVariant?.hover_image || ''}
                                folder={getBucketFolder(activeVariant?.color_name || '')}
                                onChange={url => changeVariant(activeVariantIdx, 'hover_image', url)}
                            />

                            {/* Gallery images */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border-l-2 border-white pl-3">Galería (hasta 6 fotos)</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = activeVariant?.gallery_images || []
                                            if (current.length < 6) {
                                                changeVariant(activeVariantIdx, 'gallery_images', [...current, ''])
                                            }
                                        }}
                                        className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/5 px-3 py-1 hover:border-white/20 hover:text-white transition-all flex items-center"
                                    >
                                        <Plus size={12} className="mr-1" /> Añadir
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {(activeVariant?.gallery_images || []).map((img: string, gIdx: number) => (
                                        <div key={gIdx} className="flex items-center space-x-2">
                                            {img && (
                                                <div className="w-10 h-8 shrink-0 border border-white/10 overflow-hidden">
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={e => {
                                                    const gallery = [...(activeVariant?.gallery_images || [])]
                                                    gallery[gIdx] = e.target.value
                                                    changeVariant(activeVariantIdx, 'gallery_images', gallery)
                                                }}
                                                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-white text-[10px] outline-none"
                                                placeholder="URL de imagen galería"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // open picker for this gallery slot
                                                }}
                                                className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white/40 transition-all"
                                            >
                                                <ImageIcon size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const gallery = (activeVariant?.gallery_images || []).filter((_: any, i: number) => i !== gIdx)
                                                    changeVariant(activeVariantIdx, 'gallery_images', gallery)
                                                }}
                                                className="px-3 py-2 border border-white/5 text-white/20 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Gallery preview strip */}
                                {activeVariant?.gallery_images?.filter(Boolean).length > 0 && (
                                    <div className="flex space-x-2 mt-3 overflow-x-auto">
                                        {activeVariant.gallery_images.filter(Boolean).map((img: string, i: number) => (
                                            <div key={i} className="w-16 h-16 shrink-0 border border-white/10 overflow-hidden">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {/* ── Footer ── */}
                <div className="px-8 py-5 border-t border-white/5 bg-[#0d0d0d] flex justify-between items-center shrink-0">
                    <div className="flex items-center space-x-6">
                        <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
                            {variants.length} color{variants.length > 1 ? 'es' : ''} · {formData.sizes.length} tallas
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all px-4 py-3"
                        >
                            Descartar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-white text-black px-10 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-emerald-400 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span>{product ? 'Actualizar Archivo' : 'Guardar en Sistema'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
