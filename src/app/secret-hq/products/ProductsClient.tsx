'use client'

import { useState } from 'react'
import Image from "next/image"
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Package,
    Layers,
    Trash2,
    Edit3
} from "lucide-react"
import ProductModal from '@/components/admin/ProductModal'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'
import { deleteProduct } from '@/app/actions/admin-actions'

interface ProductsClientProps {
    initialProducts: any[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredProducts = initialProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = () => {
        setSelectedProduct(null)
        setIsProductModalOpen(true)
    }

    const handleEdit = (product: any) => {
        setSelectedProduct(product)
        setIsProductModalOpen(true)
    }

    const handleDeleteClick = (product: any) => {
        setSelectedProduct(product)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedProduct) {
            await deleteProduct(selectedProduct.id)
        }
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-16">
                <div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Archive 01 // Inventory</span>
                    <h1 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Productos
                    </h1>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={16} />
                    <span>Añadir Prenda</span>
                </button>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[#0a0a0a] border border-white/5 p-6 rounded-sm">
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
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border border-white/5 px-8 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white/5 transition-all">
                        <Filter size={14} />
                        <span>Categoría</span>
                    </button>
                    <button className="flex-1 md:flex-none border border-white/5 px-8 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white/5 transition-all">
                        <span>Estado: Todos</span>
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="group bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-700 relative flex flex-col h-[520px]">
                        {/* Image Section */}
                        <div className="relative h-[320px] overflow-hidden bg-[#111] p-4">
                            {product.product_variants && product.product_variants[0] && (
                                <Image
                                    src={product.product_variants[0].main_image}
                                    alt={product.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                                />
                            )}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-all duration-500 z-10">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="w-10 h-10 bg-white text-black flex items-center justify-center shadow-2xl hover:bg-black hover:text-white transition-all"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(product)}
                                    className="w-10 h-10 bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:bg-black transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-400 text-black' : 'bg-rose-500 text-white'
                                    }`}>
                                    {product.stock > 0 ? 'En Existencia' : 'Agotado'}
                                </span>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-8 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">{product.category}</p>
                                    <p className="font-display font-black text-lg italic tracking-tight">${Number(product.price).toFixed(2)}</p>
                                </div>
                                <h3 className="text-[14px] font-black uppercase tracking-tight leading-tight mb-4 group-hover:text-white transition-colors">
                                    {product.name}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-10 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center">
                                        <Layers size={14} className="mr-3" />
                                        <span>{product.product_variants?.length || 0} Var</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Package size={14} className="mr-3" />
                                        <span className={product.stock < 10 ? 'text-amber-400 font-black' : ''}>{product.stock} Uni</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="w-full border border-white/10 py-4 text-[9px] font-black uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-black transition-all"
                                >
                                    Modificar Registro
                                </button>
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
                    <p className="text-white/20 text-[10px] uppercase tracking-widest max-w-sm">No se han encontrado registros en el servidor central con ese criterio.</p>
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
                    description={`ESTA ACCIÓN ELIMINARÁ DE FORMA PERMANENTE EL REGISTRO DE "${selectedProduct?.name?.toUpperCase()}" Y TODAS SUS VARIANTES DEL SERVIDOR CENTRAL.`}
                    onConfirm={confirmDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    )
}
