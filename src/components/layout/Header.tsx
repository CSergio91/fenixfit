"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState, useRef } from "react";
import { getPublicSettings, globalSearch } from "@/app/actions/admin-actions";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

export function Header() {
    const items = useCartStore((state) => state.items);
    const setIsOpen = useCartStore((state) => state.setIsOpen);
    const { settings, loading: loadingSettings, fetchSettings } = useSettingsStore();
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                const results = await globalSearch(searchQuery);
                setSearchResults(results.products);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        };

        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <>
            <div className="bg-primary text-white text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-center py-2.5 px-4 w-full transition-all duration-500 min-h-[35px] flex items-center justify-center">
                {loadingSettings ? (
                    <div className="w-48 h-2 bg-white/20 animate-pulse rounded"></div>
                ) : (
                    settings?.announcement_text || "Free worldwide shipping on orders over $150"
                )}
            </div>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 md:h-24 relative">

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-10">
                            <Link href="/collections" className="text-[11px] font-bold hover:text-primary/60 transition-colors uppercase tracking-[0.15em]">
                                Shop
                            </Link>
                            <Link href="/collections" className="text-[11px] font-bold hover:text-primary/60 transition-colors uppercase tracking-[0.15em]">
                                Collections
                            </Link>
                            <Link href="#" className="text-[11px] font-bold hover:text-primary/60 transition-colors uppercase tracking-[0.15em]">
                                Community
                            </Link>
                        </nav>

                        {/* Mobile Menu Icon */}
                        <div className="flex items-center md:hidden">
                            <button type="button" className="text-primary hover:text-primary/60">
                                <span className="material-icons">menu</span>
                            </button>
                        </div>

                        {/* Logo - Centered and responsive */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full max-w-[120px] md:max-w-[160px] h-full py-2">
                            <Link href="/" className="relative w-full h-full flex items-center justify-center transition-opacity hover:opacity-80">
                                <Image
                                    src="/fenix-logo-black.png"
                                    alt="Fenix Fit Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex flex-1 justify-end md:flex-none items-center space-x-5 lg:space-x-8">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-primary hover:text-primary/60 transition-colors"
                            >
                                <Search size={20} />
                            </button>
                            <button className="hidden md:block text-primary hover:text-primary/60 transition-colors">
                                <span className="material-icons text-[20px]">person_outline</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="text-primary hover:text-primary/60 transition-colors relative"
                            >
                                <span className="material-icons text-[20px]">shopping_bag</span>
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px]">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-white animate-in fade-in slide-in-from-top duration-500 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-12">
                            <div className="w-24"></div>
                            <div className="relative w-full max-w-2xl px-4">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/20" size={24} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH OUR COLLECTIONS..."
                                    className="w-full pl-16 pr-12 py-6 text-2xl md:text-3xl font-display font-light uppercase tracking-tighter border-b-2 border-primary/5 focus:border-primary outline-none transition-all placeholder:text-gray-200"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-primary/20" size={24} />
                                )}
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="w-24 flex justify-end text-primary hover:text-primary/60 transition-all font-bold text-[10px] tracking-[0.2em] uppercase"
                            >
                                <span className="mr-3">Close</span>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="mt-20">
                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="group block"
                                        >
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 block mb-1">Product</span>
                                                        <h3 className="text-lg font-bold tracking-tight uppercase group-hover:text-primary/60 transition-colors leading-tight">
                                                            {product.name}
                                                        </h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black font-display text-primary">{product.price}€</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-all">
                                                    View Details <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery.length >= 2 && !isSearching ? (
                                <div className="text-center py-20">
                                    <p className="text-lg text-primary/20 font-display italic tracking-tight">No results found for "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/20">Enter at least 2 characters to search</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
