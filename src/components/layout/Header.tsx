"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function Header() {
    const items = useCartStore((state) => state.items);
    const setIsOpen = useCartStore((state) => state.setIsOpen);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <>
            <div className="bg-primary text-white text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-center py-2.5 px-4 w-full">
                Free worldwide shipping on orders over $150
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
                                    src="/logo.jpg"
                                    alt="Fenix Fit Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex flex-1 justify-end md:flex-none items-center space-x-5 lg:space-x-8">
                            <button className="text-primary hover:text-primary/60 transition-colors">
                                <span className="material-icons text-[20px]">search</span>
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
        </>
    );
}
