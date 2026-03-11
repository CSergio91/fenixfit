'use client'

import { useState, useTransition } from 'react'
import { upsertCategory, deleteCategory } from '@/app/actions/admin-actions'
import { Plus, Edit2, Trash2, X, Save, Loader2, Check, Tag, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

interface CategoryColor { name: string; hex: string }
interface Category {
    id: string
    name: string
    slug: string
    description?: string
    sizes: string[]
    colors: CategoryColor[]
    is_active: boolean
    sort_order: number
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '36', '38', '40', '42', '44']

const DEFAULT_COLORS: CategoryColor[] = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#9CA3AF' },
    { name: 'Rojo', hex: '#EF4444' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Naranja', hex: '#F97316' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Verde', hex: '#22C55E' },
    { name: 'Azul', hex: '#3B82F6' },
    { name: 'Morado', hex: '#A855F7' },
    { name: 'Beige', hex: '#D4B896' },
    { name: 'Marrón', hex: '#78350F' },
]

function genSlug(name: string) {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function CategoryForm({
    initial,
    onSave,
    onCancel,
    isPending,
}: {
    initial?: Partial<Category>
    onSave: (data: any) => void
    onCancel: () => void
    isPending: boolean
}) {
    const [name, setName] = useState(initial?.name || '')
    const [slug, setSlug] = useState(initial?.slug || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [isActive, setIsActive] = useState(initial?.is_active ?? true)

    const handleSubmit = () => {
        if (!name.trim()) return alert('El nombre es obligatorio')
        onSave({
            id: initial?.id,
            name: name.trim(),
            slug: slug || genSlug(name),
            description: description.trim(),
            sizes: initial?.sizes || [],
            colors: initial?.colors || [],
            is_active: isActive,
            sort_order: initial?.sort_order ?? 0,
        })
    }

    return (
        <div className="space-y-7">
            {/* Name & slug */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">Nombre *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); if (!initial?.id) setSlug(genSlug(e.target.value)) }}
                        className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[12px] text-white focus:border-white/30 outline-none"
                        placeholder="Leggings"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">Slug (URL)</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[12px] text-white/50 focus:border-white/30 outline-none font-mono"
                        placeholder="leggings"
                    />
                </div>
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">Descripción</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[12px] text-white focus:border-white/30 outline-none resize-none"
                    placeholder="Descripción de la categoría..."
                />
            </div>

            {/* Active toggle */}
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isActive ? 'bg-white' : 'bg-white/10'}`}
                >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${isActive ? 'left-6 bg-black' : 'left-0.5 bg-white/30'}`} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{isActive ? 'Categoría activa' : 'Categoría oculta'}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
                <button onClick={onCancel} className="flex-1 border border-white/10 text-white/30 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 bg-white text-black py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                    {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>{isPending ? 'Guardando...' : 'Guardar Categoría'}</span>
                </button>
            </div>
        </div>
    )
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const handleSave = (data: any) => {
        startTransition(async () => {
            try {
                const saved = await upsertCategory(data) as Category
                setCategories(prev => {
                    const exists = prev.find(c => c.id === saved.id)
                    return exists ? prev.map(c => c.id === saved.id ? saved : c) : [saved, ...prev]
                })
                setShowForm(false)
                setEditingCategory(null)
            } catch (err: any) {
                alert('Error: ' + err.message)
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            try {
                await deleteCategory(id)
                setCategories(prev => prev.filter(c => c.id !== id))
                setConfirmDelete(null)
            } catch (err: any) {
                alert('Error: ' + err.message)
            }
        })
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black mb-2">Gestión</p>
                    <h1 className="font-display text-4xl font-black italic tracking-tighter uppercase">Categorías</h1>
                    <p className="text-white/30 text-[11px] mt-2">{categories.length} categorías · Filtra la tienda por tipo de prenda</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingCategory(null) }}
                    className="flex items-center space-x-2 bg-white text-black px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                >
                    <Plus size={14} />
                    <span>Nueva Categoría</span>
                </button>
            </div>

            {/* New category form */}
            {showForm && !editingCategory && (
                <div className="bg-[#0d0d0d] border border-white/10 p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Nueva</p>
                            <h2 className="font-black text-[15px] uppercase tracking-wider">Crear Categoría</h2>
                        </div>
                        <button onClick={() => setShowForm(false)} className="text-white/20 hover:text-white transition-colors"><X size={18} /></button>
                    </div>
                    <CategoryForm onSave={handleSave} onCancel={() => setShowForm(false)} isPending={isPending} />
                </div>
            )}

            {/* Category list */}
            <div className="space-y-2">
                {categories.length === 0 && (
                    <div className="border border-dashed border-white/10 p-16 text-center">
                        <Tag size={32} className="text-white/10 mx-auto mb-4" />
                        <p className="text-white/20 text-[11px] font-black uppercase tracking-widest">Sin categorías aún</p>
                        <p className="text-white/10 text-[10px] mt-2">Crea tu primera categoría para organizar la tienda</p>
                    </div>
                )}

                {categories.map(cat => (
                    <div key={cat.id} className="bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300">
                        {/* Row */}
                        <div
                            className="flex items-center justify-between px-6 py-5 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                        >
                            <div className="flex items-center space-x-5 min-w-0">
                                <GripVertical size={14} className="text-white/10 shrink-0" />
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-3">
                                        <p className="font-black text-[13px] uppercase tracking-wider text-white">{cat.name}</p>
                                        {!cat.is_active && <span className="text-[8px] font-black uppercase tracking-widest text-white/25 border border-white/10 px-2 py-0.5">Oculta</span>}
                                    </div>
                                    <p className="text-[9px] text-white/20 font-mono mt-0.5">/{cat.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0 ml-4">
                                <button
                                    onClick={e => { e.stopPropagation(); setEditingCategory(cat); setShowForm(false) }}
                                    className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/[0.05] transition-all"
                                >
                                    <Edit2 size={13} />
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); setConfirmDelete(cat.id) }}
                                    className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-400/[0.05] transition-all"
                                >
                                    <Trash2 size={13} />
                                </button>
                                {expandedId === cat.id ? <ChevronUp size={14} className="text-white/20" /> : <ChevronDown size={14} className="text-white/20" />}
                            </div>
                        </div>

                        {/* Expanded edit form */}
                        {editingCategory?.id === cat.id && (
                            <div className="border-t border-white/5 px-8 py-8 animate-in fade-in duration-200">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Editar categoría</h3>
                                <CategoryForm
                                    initial={editingCategory}
                                    onSave={handleSave}
                                    onCancel={() => setEditingCategory(null)}
                                    isPending={isPending}
                                />
                            </div>
                        )}

                        {/* Expanded info (not editing) */}
                        {expandedId === cat.id && editingCategory?.id !== cat.id && (
                            <div className="border-t border-white/5 px-8 py-6 animate-in fade-in duration-200">
                                {cat.description ? (
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Descripción</p>
                                        <p className="text-[11px] text-white/40">{cat.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-white/20 italic">Sin descripción</p>
                                )}
                            </div>
                        )}

                        {/* Delete confirm */}
                        {confirmDelete === cat.id && (
                            <div className="border-t border-rose-500/20 bg-rose-500/5 px-8 py-5 flex items-center justify-between animate-in fade-in duration-200">
                                <p className="text-[11px] text-white/60">¿Eliminar <strong className="text-white">{cat.name}</strong>? Esta acción no se puede deshacer.</p>
                                <div className="flex space-x-3">
                                    <button onClick={() => setConfirmDelete(null)} className="border border-white/10 text-white/40 px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancelar</button>
                                    <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="bg-rose-500 text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all disabled:opacity-50">
                                        {isPending ? <Loader2 size={12} className="animate-spin" /> : 'Eliminar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
