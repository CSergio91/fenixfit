"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Share2, Link as LinkIcon, Instagram, Facebook, Twitter, Truck, CreditCard, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { DbProduct } from "@/services/productService";

export default function ProductClient({ product }: { product: DbProduct }) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(selectedVariant?.main_image || "");
    const [shareMsg, setShareMsg] = useState("");
    const addItem = useCartStore((state) => state.addItem);
    const settings = useSettingsStore((state) => state.settings);
    const currency = settings?.currency || '€';

    if (!product || !selectedVariant) return null;

    const handleShare = async () => {
        const shareData = {
            title: `Check out ${product.name} on Fenix Fit`,
            text: `Check out this amazing ${product.name} - now for only ${product.price}${currency}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareMsg("✓ Link copiado!");
                setTimeout(() => setShareMsg(""), 2000);
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

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
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-6">
                                <span className="text-2xl md:text-3xl font-black font-display text-primary">{product.price}{currency}</span>
                                {product.original_price && (
                                    <span className="text-lg text-muted-light line-through font-medium">{product.original_price}{currency}</span>
                                )}
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/60 transition-all border-b border-black/5 pb-1"
                            >
                                <Share2 size={14} />
                                <span>{shareMsg || "Compartir"}</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-8 p-4 bg-gray-50/50 border border-gray-100 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-primary/60">
                        <div className="flex items-center">
                            <Truck size={14} className="mr-2" />
                            Free Worldwide Shipping
                        </div>
                        <div className="flex items-center opacity-40">
                            <CreditCard size={14} className="mr-2" />
                            3x Klarna / PayPal
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
                                {selectedSize && <ArrowRight size={14} className="ml-2" />}
                            </button>
                        </div>

                        {/* Details accordions */}
                        <div className="border-t border-gray-100 pt-10 space-y-6">
                            <div className="group cursor-pointer">
                                <div className="flex justify-between items-center py-2 font-black uppercase tracking-[0.2em] text-[11px]">
                                    <span>Descripción del Producto</span>
                                    <ChevronDown size={14} />
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

                            {/* Social Share */}
                            <div className="pt-8 flex items-center space-x-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Share fenix</span>
                                <div className="flex space-x-4">
                                    <button onClick={handleShare} className="text-primary hover:text-primary/50 transition-all"><Instagram size={16} /></button>
                                    <button onClick={handleShare} className="text-primary hover:text-primary/50 transition-all">
                                        <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.33 6.16-1.43 1.71-3.5 2.8-5.71 3.11-2.22.31-4.52.08-6.52-1.01-2-1.1-3.58-2.91-4.32-5.02-.74-2.11-.68-4.48.17-6.55 1.12-2.72 3.65-4.68 6.55-5.18 0 1.34-.01 2.68.01 4.02-1.39.19-2.7.9-3.56 1.99-.86 1.09-1.2 2.53-.94 3.91.26 1.38 1.06 2.58 2.23 3.3 1.17.72 2.6.96 3.94.66 1.34-.3 2.52-1.12 3.25-2.26.73-1.14 1.04-2.5 0-4.04.01-6.19.01-12.38.01-18.57z"></path>
                                        </svg>
                                    </button>
                                    <button onClick={handleShare} className="text-primary hover:text-primary/50 transition-all"><Facebook size={16} /></button>
                                    <button onClick={handleShare} className="text-primary hover:text-primary/50 transition-all"><Twitter size={16} /></button>
                                    <button onClick={handleShare} className="text-primary hover:text-primary/50 transition-all"><LinkIcon size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
