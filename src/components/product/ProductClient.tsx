"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DbProduct } from "@/services/productService";

export default function ProductClient({ product }: { product: DbProduct }) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(selectedVariant?.main_image || "");
    const addItem = useCartStore((state) => state.addItem);
    const settings = useSettingsStore((state) => state.settings);
    const currency = settings?.currency || '$';

    if (!product || !selectedVariant) return null;

    // Update active image when variant changes
    const handleVariantChange = (variant: any) => {
        setSelectedVariant(variant);
        setActiveImage(variant.main_image);
    };

    const images = selectedVariant.gallery_images?.length > 0
        ? [selectedVariant.main_image, ...selectedVariant.gallery_images]
        : [selectedVariant.main_image, selectedVariant.hover_image || selectedVariant.main_image];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
            {/* Breadcrumbs */}
            <nav className="flex text-[10px] font-black uppercase tracking-[0.2em] text-muted-light mb-12">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-3 opacity-30">/</span>
                <Link href={`/collections?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-primary">{product.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                {/* Product Gallery */}
                <div className="lg:w-3/5 flex flex-col-reverse md:flex-row gap-6">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:w-20 lg:w-24 scrollbar-hide py-1 md:py-0">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`w-16 h-20 md:w-full md:h-24 lg:h-32 flex-shrink-0 relative overflow-hidden bg-gray-50 ${activeImage === img ? 'ring-2 ring-primary ring-offset-2 opacity-100 shadow-lg' : 'opacity-40 hover:opacity-100'} transition-all duration-300`}
                            >
                                <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 relative aspect-[3/4] md:aspect-auto md:h-[calc(100vh-220px)] lg:h-[850px] bg-gray-50 overflow-hidden shadow-sm">
                        <Image
                            src={activeImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-500"
                            priority
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-2/5 md:sticky md:top-36 md:h-fit">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(product.original_price && product.original_price > product.price) && (
                                <span className="inline-block bg-red-600 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest shadow-sm">
                                    HOT SALE
                                </span>
                            )}
                            {product.stock < 10 && (
                                <span className="inline-block bg-primary text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest shadow-sm">
                                    LAST UNITS
                                </span>
                            )}
                            {product.badges && product.badges.map(badge => (
                                <span key={badge} className="inline-block bg-gray-100 text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-widest shadow-sm">
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tighter leading-tight uppercase italic">{product.name}</h1>
                        <div className="flex items-center space-x-6">
                            <span className="text-2xl md:text-3xl font-black font-display text-primary">{currency}{product.price}</span>
                            {product.original_price && (
                                <span className="text-lg text-muted-light line-through font-medium">{currency}{product.original_price}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Color */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Color: <span className="text-muted-light">{selectedVariant.color_name}</span></span>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantChange(v)}
                                        className={`w-11 h-11 rounded-full border-2 ${selectedVariant.id === v.id ? 'border-primary ring-2 ring-offset-4 ring-primary' : 'border-gray-100'} transition-all duration-300 shadow-sm`}
                                        style={{ backgroundColor: v.color_hex }}
                                    >
                                        <span className="sr-only">{v.color_name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Selecciona Talla</span>
                                <button className="text-[10px] font-bold uppercase tracking-widest underline text-muted-light hover:text-primary transition-colors">
                                    Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-4 text-[11px] font-black transition-all border-2 tracking-widest ${selectedSize === size ? 'border-primary bg-primary text-white shadow-xl' : 'border-gray-100 text-muted-light hover:border-black hover:text-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4">
                            <button
                                disabled={!selectedSize}
                                onClick={() => {
                                    if (selectedSize) {
                                        // Legacy conversion for the store (uses mainImage/colorName etc)
                                        const legacyItem = {
                                            ...product,
                                            variants: product.variants.map(v => ({ ...v, mainImage: v.main_image, colorName: v.color_name, colorHex: v.color_hex }))
                                        };
                                        const legacyVariant = { ...selectedVariant, mainImage: selectedVariant.main_image, colorName: selectedVariant.color_name, colorHex: selectedVariant.color_hex };
                                        addItem(legacyItem as any, legacyVariant as any, selectedSize);
                                    }
                                }}
                                className="w-full bg-primary text-white py-5 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-black transition-all shadow-2xl disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                            >
                                <span>{selectedSize ? "Añadir a la Bolsa" : "Selecciona una Talla"}</span>
                                {selectedSize && <span className="material-icons text-sm">arrow_forward</span>}
                            </button>
                        </div>

                        {/* Details accordions */}
                        <div className="border-t border-gray-100 pt-10 space-y-6">
                            <div className="group cursor-pointer">
                                <div className="flex justify-between items-center py-2 font-black uppercase tracking-[0.2em] text-[11px]">
                                    <span>Descripción del Producto</span>
                                    <span className="material-icons text-sm">remove</span>
                                </div>
                                <div className="text-muted-light text-sm font-light py-4 leading-relaxed pr-6">
                                    <p className="mb-6">{product.description}</p>
                                    <ul className="space-y-3">
                                        {product.features && product.features.map((f, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="w-1.5 h-1.5 bg-primary/20 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
