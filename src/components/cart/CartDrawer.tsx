"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
    const { isOpen, setIsOpen, items, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleCheckout = () => {
        clearCart();
        setIsOpen(false);
        router.push("/checkout/success");
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px] transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[440px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-8 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <h2 className="font-display text-2xl font-bold tracking-tight">Your Bag</h2>
                        <span className="bg-gray-100 text-[11px] font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-primary transition-colors p-2 -mr-2"
                    >
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <span className="material-icons text-3xl text-gray-300">shopping_bag</span>
                            </div>
                            <p className="text-lg font-bold mb-2">Your bag is empty.</p>
                            <p className="text-muted-light text-sm mb-10 max-w-[240px]">Seems like you haven&apos;t found your next workout essential yet.</p>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/collections");
                                }}
                                className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-900 transition-all shadow-lg"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-8">
                            {items.map((item) => (
                                <li key={item.id} className="flex space-x-6">
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden">
                                        <Image
                                            src={item.variant.mainImage}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[13px] font-bold pr-4 leading-tight">
                                                    <Link href={`/product/${item.product.id}`} onClick={() => setIsOpen(false)} className="hover:text-primary/60 transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-[13px] font-bold font-display">${item.product.price}</p>
                                            </div>
                                            <div className="flex items-center space-x-3 text-[11px] text-muted-light uppercase tracking-wider font-semibold">
                                                <span>{item.variant.colorName}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>Size {item.size}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="material-icons text-xs">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-[12px] font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="material-icons text-xs">add</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-muted-light hover:text-red-500 transition-colors flex items-center"
                                            >
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-8 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Subtotal</span>
                            <span className="text-2xl font-black font-display">${getCartTotal()}</span>
                        </div>
                        <p className="text-[11px] text-muted-light mb-8 leading-relaxed font-medium">Shipping and taxes calculated at checkout. Free shipping on orders over $150.</p>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-xl flex justify-between items-center px-8"
                        >
                            <span>Proceed to Checkout</span>
                            <span className="material-icons text-sm">arrow_forward</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
