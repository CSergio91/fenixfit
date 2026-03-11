'use client'

import { useState, useTransition } from 'react'
import Image from "next/image"
import {
    Plus, Search, Filter, Package, Layers, Trash2, Edit3, Minus,
    AlertTriangle, TrendingDown
} from "lucide-react"
import ProductModal from '@/components/admin/ProductModal'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'
import { deleteProduct, adjustStock } from '@/app/actions/admin-actions'

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState<any[]>(initialProducts)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [stockLoading, setStockLoading] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => { setSelectedProduct(null); setIsProductModalOpen(true) }
    const handleEdit = (p: any) => { setSelectedProduct(p); setIsProductModalOpen(true) }
    const handleDeleteClick = (p: any) => { setSelectedProduct(p); setIsDeleteModalOpen(true) }

    const confirmDelete = async () => {
        if (selectedProduct) {
            await deleteProduct(selectedProduct.id)
            setProducts(prev => prev.filter(p => p.id !== selectedProduct.id))
        }
    }

    const handleStockChange = async (productId: string, delta: number) => {
        setStockLoading(productId)
        try {
            const { stock: newStock } = await adjustStock(productId, delta)
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p))
        } catch (err: any) {
            alert('Error al ajustar stock: ' + err.message)
        } finally {
            setStockLoading(null)
        }
    }

    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
    const outOfStock = products.filter(p => p.stock === 0).length

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-16">
                <div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Archive 01 // Inventory</span>
                    <h1 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Productos</h1>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Stock alerts */}
                    {lowStock > 0 && (
                        <div className="bg-amber-400/5 border border-amber-400/20 px-4 py-2 flex items-center space-x-2">
                            <AlertTriangle size={12} className="text-amber-400" />
                            <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest">{lowStock} Stock Bajo</span>
                        </div>
                    )}
                    {outOfStock > 0 && (
                        <div className="bg-rose-500/5 border border-rose-500/20 px-4 py-2 flex items-center space-x-2">
                            <TrendingDown size={12} className="text-rose-400" />
                            <span className="text-rose-400 text-[9px] font-black uppercase tracking-widest">{outOfStock} Agotados</span>
                        </div>
                    )}
                    <button
                        onClick={handleAdd}
                        className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={16} />
                        <span>Añadir Prenda</span>
                    </button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[#0a0a0a] border border-white/5 p-6">
                <div className="flex items-center bg-white/5 px-6 py-3 border border-white/5 w-full md:max-w-md">
                    <Search size={16} className="text-white/20" />
                    <input
                        type="text"
                        placeholder="Filtrar Archivo..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-[10px] font-black tracking-widest uppercase ml-4 w-full placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center space-x-2 text-white/20 text-[9px] font-black uppercase tracking-widest">
                    <Package size={12} />
                    <span>{products.length} Productos</span>
                    <span className="mx-2">·</span>
                    <span className="text-emerald-400">{products.filter(p => p.stock > 0).length} En Stock</span>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-700 relative flex flex-col">

                        {/* Image */}
                        <div className="relative h-[280px] overflow-hidden bg-[#111]">
                            {product.product_variants?.[0]?.main_image && (
                                <Image
                                    src={product.product_variants[0].main_image}
                                    alt={product.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                                />
                            )}

                            {/* Edit/Delete overlay */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-10">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="w-9 h-9 bg-white text-black flex items-center justify-center shadow-2xl hover:bg-black hover:text-white transition-all"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(product)}
                                    className="w-9 h-9 bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:bg-black transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Stock badge */}
                            <div className="absolute bottom-3 left-3">
                                <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest ${product.stock === 0 ? 'bg-rose-500 text-white' :
                                        product.stock < 10 ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'
                                    }`}>
                                    {product.stock === 0 ? 'Agotado' : product.stock < 10 ? `Solo ${product.stock} left` : 'En Stock'}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">{product.category}</p>
                                    <p className="font-display font-black text-base italic">${Number(product.price).toFixed(2)}</p>
                                </div>
                                <h3 className="text-[13px] font-black uppercase tracking-tight leading-tight mb-4 group-hover:text-white transition-colors">
                                    {product.name}
                                </h3>
                            </div>

                            {/* Color dots */}
                            {product.product_variants?.length > 1 && (
                                <div className="flex items-center space-x-1.5 mb-4">
                                    {product.product_variants.slice(0, 6).map((v: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="w-3 h-3 rounded-full border border-white/10"
                                            style={{ backgroundColor: v.color_hex }}
                                            title={v.color_name}
                                        />
                                    ))}
                                    {product.product_variants.length > 6 && (
                                        <span className="text-[9px] text-white/30 font-black">+{product.product_variants.length - 6}</span>
                                    )}
                                </div>
                            )}

                            {/* ── Stock Control ── */}
                            <div className="border-t border-white/5 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                        <Layers size={12} />
                                        <span>{product.product_variants?.length || 0} Variantes</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                                        <Package size={12} />
                                        <span className={product.stock < 10 ? 'text-amber-400' : ''}>Stock</span>
                                    </div>
                                </div>

                                {/* Stock adjuster */}
                                <div className="flex items-center justify-between bg-white/5 border border-white/5 p-2">
                                    <button
                                        onClick={() => handleStockChange(product.id, -1)}
                                        disabled={stockLoading === product.id || product.stock === 0}
                                        className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <div className="text-center">
                                        <span className={`font-display font-black text-xl italic tabular-nums ${product.stock === 0 ? 'text-rose-400' : product.stock < 10 ? 'text-amber-400' : 'text-white'
                                            }`}>
                                            {stockLoading === product.id ? '...' : product.stock}
                                        </span>
                                        <p className="text-[8px] text-white/20 uppercase tracking-widest">unidades</p>
                                    </div>
                                    <button
                                        onClick={() => handleStockChange(product.id, +1)}
                                        disabled={stockLoading === product.id}
                                        className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Quick adjust buttons (+5, +10) */}
                                <div className="flex gap-2">
                                    {[-5, -10, +5, +10].map(delta => (
                                        <button
                                            key={delta}
                                            onClick={() => handleStockChange(product.id, delta)}
                                            disabled={stockLoading === product.id || (delta < 0 && product.stock + delta < 0)}
                                            className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${delta < 0
                                                    ? 'border-white/5 text-white/20 hover:border-rose-500/30 hover:text-rose-400'
                                                    : 'border-white/5 text-white/20 hover:border-emerald-500/30 hover:text-emerald-400'
                                                }`}
                                        >
                                            {delta > 0 ? `+${delta}` : delta}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Border Accent */}
                        <div className="absolute top-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-1000" />
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-40 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 border border-white/5 animate-pulse">
                        <Package size={40} className="text-white/20" />
                    </div>
                    <h3 className="font-display text-4xl font-black italic tracking-tighter uppercase mb-4">Base Vacía</h3>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest max-w-sm">No se encontraron registros con ese criterio.</p>
                </div>
            )}

            {isProductModalOpen && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setIsProductModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteConfirmModal
                    title="¿ELIMINAR PRODUCTO?"
                    description={`ESTA ACCIÓN ELIMINARÁ PERMANENTEMENTE "${selectedProduct?.name?.toUpperCase()}" Y TODAS SUS VARIANTES.`}
                    onConfirm={confirmDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    )
}
