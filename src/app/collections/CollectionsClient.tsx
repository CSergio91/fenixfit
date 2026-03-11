'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

interface CategoryColor { name: string; hex: string }
interface Category {
    id: string; name: string; slug: string; description?: string
    sizes: string[]; colors: CategoryColor[]; is_active: boolean; sort_order: number
}

type SortOption = 'recommended' | 'newest' | 'price-asc' | 'price-desc'

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border-b border-black/10 pb-6 mb-6">
            <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-4 group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:opacity-70 transition-opacity">{title}</h3>
                {open ? <ChevronUp size={12} className="text-primary/40" /> : <ChevronDown size={12} className="text-primary/40" />}
            </button>
            {open && children}
        </div>
    )
}

export default function CollectionsClient({
    products,
    categories,
}: {
    products: any[]
    categories: Category[]
}) {
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [activeSizes, setActiveSizes] = useState<string[]>([])
    const [activeColors, setActiveColors] = useState<string[]>([]) // store hex values
    const [sort, setSort] = useState<SortOption>('recommended')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const activeCategories = categories.filter(c => c.is_active)

    // Derive available sizes/colors from the products
    const availableSizes = useMemo(() => {
        const pool = activeCategory === 'all'
            ? products
            : products.filter(p => p.category?.toLowerCase() === activeCategories.find(c => c.slug === activeCategory)?.name.toLowerCase())

        const all = pool.flatMap(p => p.sizes || [])
        return [...new Set(all)].sort()
    }, [activeCategory, activeCategories, products])

    const availableColors = useMemo(() => {
        const pool = activeCategory === 'all'
            ? products
            : products.filter(p => p.category?.toLowerCase() === activeCategories.find(c => c.slug === activeCategory)?.name.toLowerCase())

        const allVariants = pool.flatMap(p => p.variants || [])
        const colors: CategoryColor[] = []
        const seen = new Set<string>()

        for (const v of allVariants) {
            if (v.color_hex && !seen.has(v.color_hex)) {
                seen.add(v.color_hex)
                colors.push({ name: v.color_name, hex: v.color_hex })
            }
        }
        return colors
    }, [activeCategory, activeCategories, products])

    const toggleSize = (s: string) =>
        setActiveSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    const toggleColor = (hex: string) =>
        setActiveColors(prev => prev.includes(hex) ? prev.filter(x => x !== hex) : [...prev, hex])

    // Filter + sort
    const filtered = useMemo(() => {
        let result = [...products]

        // Category filter
        if (activeCategory !== 'all') {
            const cat = activeCategories.find(c => c.slug === activeCategory)
            if (cat) result = result.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase() || p.category?.toLowerCase() === cat.slug.toLowerCase())
        }

        // Size filter — products have p.sizes (text[])
        if (activeSizes.length > 0) {
            result = result.filter(p => activeSizes.some(s => (p.sizes || []).includes(s)))
        }

        // Color filter — match variant color_hex
        if (activeColors.length > 0) {
            result = result.filter(p =>
                (p.variants || []).some((v: any) => activeColors.includes(v.color_hex))
            )
        }

        // Sort
        switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break
            case 'price-desc': result.sort((a, b) => b.price - a.price); break
            case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
        }

        return result
    }, [products, activeCategory, activeSizes, activeColors, sort, activeCategories])

    const activeFiltersCount = (activeCategory !== 'all' ? 1 : 0) + activeSizes.length + activeColors.length

    const clearFilters = () => {
        setActiveCategory('all')
        setActiveSizes([])
        setActiveColors([])
    }

    const FiltersPanel = () => (
        <div className="sticky top-36">
            {/* Category */}
            <FilterSection title="Categoría">
                <ul className="space-y-3">
                    <li>
                        <button
                            onClick={() => { setActiveCategory('all'); setActiveSizes([]); setActiveColors([]) }}
                            className={`text-[12px] tracking-wide transition-all uppercase block ${activeCategory === 'all' ? 'font-black text-primary translate-x-1' : 'font-medium text-muted-light hover:text-primary hover:translate-x-1'}`}
                        >
                            Todos
                        </button>
                    </li>
                    {activeCategories.map(cat => (
                        <li key={cat.id}>
                            <button
                                onClick={() => { setActiveCategory(cat.slug); setActiveSizes([]); setActiveColors([]) }}
                                className={`text-[12px] tracking-wide transition-all uppercase block text-left ${activeCategory === cat.slug ? 'font-black text-primary translate-x-1' : 'font-medium text-muted-light hover:text-primary hover:translate-x-1'}`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </FilterSection>

            {/* Sizes */}
            {availableSizes.length > 0 && (
                <FilterSection title="Talla">
                    <div className="grid grid-cols-3 gap-2">
                        {availableSizes.map(size => (
                            <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`border py-2.5 text-[9px] font-black hover:border-black transition-all uppercase tracking-widest ${activeSizes.includes(size) ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Colors */}
            {availableColors.length > 0 && (
                <FilterSection title="Color">
                    <div className="space-y-2">
                        {availableColors.map(c => (
                            <button
                                key={c.hex}
                                onClick={() => toggleColor(c.hex)}
                                className={`flex items-center space-x-3 w-full group transition-all ${activeColors.includes(c.hex) ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${activeColors.includes(c.hex) ? 'border-black scale-110 shadow-md' : 'border-gray-200'}`} style={{ backgroundColor: c.hex }} />
                                <span className={`text-[11px] uppercase tracking-wide transition-all ${activeColors.includes(c.hex) ? 'font-black text-primary' : 'font-medium text-muted-light group-hover:text-primary'}`}>
                                    {c.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
                <button
                    onClick={clearFilters}
                    className="w-full border border-black/20 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                    <X size={10} />
                    <span>Limpiar filtros ({activeFiltersCount})</span>
                </button>
            )}
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 block mb-4">Shop the Edit</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase italic">
                        {activeCategory === 'all' ? 'All Products' : activeCategories.find(c => c.slug === activeCategory)?.name || 'Colección'}
                    </h1>
                    <p className="text-muted-light text-[13px] font-medium tracking-wide">
                        {filtered.length} {filtered.length === 1 ? 'PRENDA' : 'PRENDAS'} ENCONTRADAS
                        {activeFiltersCount > 0 && <span className="ml-2 text-black/40">· {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}</span>}
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-8 md:mt-0">
                    {/* Mobile filter button */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="md:hidden flex items-center space-x-2 border border-black/20 px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        <SlidersHorizontal size={14} />
                        <span>Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                    </button>
                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value as SortOption)}
                        className="bg-transparent border border-black/10 text-[10px] font-black uppercase tracking-[0.1em] cursor-pointer outline-none px-4 py-3 hover:border-black transition-all"
                    >
                        <option value="recommended">Recomendados</option>
                        <option value="newest">Más nuevos</option>
                        <option value="price-asc">Precio: menor a mayor</option>
                        <option value="price-desc">Precio: mayor a menor</option>
                    </select>
                </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {activeCategory !== 'all' && (
                        <button onClick={() => setActiveCategory('all')} className="flex items-center space-x-2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 hover:bg-black/70 transition-all">
                            <span>{activeCategories.find(c => c.slug === activeCategory)?.name}</span>
                            <X size={10} />
                        </button>
                    )}
                    {activeSizes.map(s => (
                        <button key={s} onClick={() => toggleSize(s)} className="flex items-center space-x-2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 hover:bg-black/70 transition-all">
                            <span>Talla: {s}</span><X size={10} />
                        </button>
                    ))}
                    {activeColors.map(hex => {
                        const color = availableColors.find(c => c.hex === hex)
                        return (
                            <button key={hex} onClick={() => toggleColor(hex)} className="flex items-center space-x-2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 hover:bg-black/70 transition-all">
                                <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: hex }} />
                                <span>{color?.name || hex}</span><X size={10} />
                            </button>
                        )
                    })}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
                {/* Sidebar Filters */}
                <div className="hidden md:block w-52 flex-shrink-0">
                    <FiltersPanel />
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filtered.length === 0 ? (
                        <div className="text-center py-32 border-2 border-dashed border-gray-100">
                            <h3 className="text-2xl font-black mb-3 italic uppercase">Sin resultados</h3>
                            <p className="text-muted-light text-sm max-w-xs mx-auto mb-10">No encontramos productos con estos filtros.</p>
                            <button onClick={clearFilters} className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-gray-800 transition-all shadow-lg">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                            {filtered.map((product) => {
                                const variant = product.variants[0]
                                const isHotSale = product.original_price && product.original_price > product.price
                                return (
                                    <div key={product.id} className="group relative">
                                        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 mb-6 shadow-sm">
                                            {variant && (
                                                <Image
                                                    src={variant.main_image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="block w-full bg-white text-primary py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-center shadow-xl hover:bg-black hover:text-white transition-all"
                                                >
                                                    Ver Producto
                                                </Link>
                                            </div>
                                            <div className="absolute top-6 left-6 flex flex-col space-y-2">
                                                {product.badges?.map((badge: string, idx: number) => (
                                                    <span key={idx} className="bg-primary text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest">{badge}</span>
                                                ))}
                                                {isHotSale && <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest">Sale</span>}
                                            </div>
                                        </div>
                                        {product.variants.length > 1 && (
                                            <div className="flex space-x-2 mb-4">
                                                {product.variants.slice(0, 5).map((v: any) => (
                                                    <div
                                                        key={v.id}
                                                        title={v.color_name}
                                                        className={`w-3.5 h-3.5 rounded-full border transition-transform hover:scale-125 cursor-pointer ${activeColors.includes(v.color_hex) ? 'border-black scale-125' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: v.color_hex }}
                                                    />
                                                ))}
                                                {product.variants.length > 5 && <div className="text-[10px] font-bold text-muted-light mt-0.5">+{product.variants.length - 5}</div>}
                                            </div>
                                        )}
                                        <div className="flex flex-col space-y-1">
                                            <h3 className="text-[14px] font-black tracking-tight leading-tight uppercase italic">
                                                <Link href={`/product/${product.id}`} className="hover:text-primary/60 transition-colors">{product.name}</Link>
                                            </h3>
                                            <div className="flex justify-between items-center pt-1">
                                                <p className="text-[12px] text-muted-light font-medium tracking-wide">
                                                    {product.variants.length} {product.variants.length === 1 ? 'Color' : 'Colores'}
                                                </p>
                                                <div className="text-right">
                                                    {isHotSale ? (
                                                        <div className="flex items-center space-x-3">
                                                            <p className="text-[14px] font-black font-display text-red-600">${product.price}</p>
                                                            <p className="text-[12px] text-muted-light font-medium line-through">${product.original_price}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[14px] font-black font-display text-primary">${product.price}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-black text-base uppercase tracking-wider">Filtros</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-black transition-colors"><X size={20} /></button>
                        </div>
                        <FiltersPanel />
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest mt-6 hover:bg-black/80 transition-all"
                        >
                            Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
