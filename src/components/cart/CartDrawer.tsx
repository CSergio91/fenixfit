"use client";

import { useCartStore } from "@/store/useCartStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, CreditCard, X, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Check } from "lucide-react";
import { getPublicSettings, createWhatsappOrder } from "@/app/actions/admin-actions";
import { useSettingsStore } from "@/store/useSettingsStore";

type CheckoutType = 'stripe' | 'whatsapp' | 'email';

interface StoreSettings {
    checkout_type: CheckoutType;
    whatsapp_number: string;
    store_name: string;
    currency: string;
}

export function CartDrawer() {
    const { isOpen, setIsOpen, items, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { settings, fetchSettings } = useSettingsStore();
    const [step, setStep] = useState<'cart' | 'form'>('cart');

    const {
        customerName, customerEmail, customerPhone,
        addressStreet, addressCity, addressPostal, addressCountry,
        acceptTerms, acceptMarketing, setField
    } = useCheckoutStore();

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && isMounted) {
            fetchSettings();
        }
    }, [isOpen, isMounted, fetchSettings]); // Added fetchSettings to dependency array

    if (!isMounted) return null;

    const total = getCartTotal();
    const checkoutType: CheckoutType = settings?.checkout_type || 'stripe';

    // ── Build WhatsApp message ──────────────────────────────────────
    const buildWhatsappMessage = () => {
        const storeName = settings?.store_name || 'Fenix Fit';
        const lines = items.map(item =>
            `• ${item.quantity}x ${item.product.name} (${item.variant.colorName ?? item.variant.colorName}, Talla: ${item.size}) — ${settings?.currency || '$'}${(item.product.price * item.quantity).toFixed(2)}`
        );
        const addressLine = [addressStreet, addressCity, addressPostal, addressCountry].filter(Boolean).join(', ');
        const msg = [
            `🛍️ *Nuevo Pedido — ${storeName}*`,
            ``,
            ...lines,
            ``,
            `💰 *Total: ${settings?.currency || '$'}${total.toFixed(2)}*`,
            ``,
            `👤 *Datos del cliente:*`,
            `• Nombre: ${customerName}`,
            `• Email: ${customerEmail}`,
            customerPhone ? `• Teléfono: ${customerPhone}` : null,
            ``,
            `📦 *Dirección de envío:*`,
            addressStreet ? `• Calle: ${addressStreet}` : null,
            addressCity ? `• Ciudad: ${addressCity}` : null,
            addressPostal ? `• Código Postal: ${addressPostal}` : null,
            addressCountry ? `• País: ${addressCountry}` : null,
            ``,
            `_Por favor confirma disponibilidad y método de pago._`
        ].filter(l => l !== null).join('\n');
        return msg;
    };

    // ── Handle Stripe Checkout ──────────────────────────────────────
    const handleStripeCheckout = async () => {
        if (!customerEmail || !customerEmail.includes('@')) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        setIsCheckingOut(true);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customerEmail,
                    acceptsMarketing: acceptMarketing,
                    utmParams: {
                        source: urlParams.get('utm_source'),
                        medium: urlParams.get('utm_medium'),
                        campaign: urlParams.get('utm_campaign'),
                    }
                }),
            });
            const { url, error } = await response.json();
            if (error) throw new Error(error);
            window.location.href = url;
        } catch (err: any) {
            alert('Error al iniciar el pago: ' + err.message);
            setIsCheckingOut(false);
        }
    };

    // ── Handle WhatsApp Checkout ────────────────────────────────────
    const handleWhatsappCheckout = async () => {
        if (!customerName.trim()) { alert('Por favor, ingresa tu nombre.'); return; }
        if (!customerEmail || !customerEmail.includes('@')) { alert('Por favor, ingresa un email válido.'); return; }

        setIsCheckingOut(true);
        try {
            // 1. Create pending order in DB
            await createWhatsappOrder({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                accepts_marketing: acceptMarketing,
                total_amount: total,
                shipping_address: {
                    street: addressStreet,
                    city: addressCity,
                    postal_code: addressPostal,
                    country: addressCountry,
                },
                items: items.map(item => ({
                    product_id: item.product.id,
                    variant_id: item.variant.id,
                    product_name: item.product.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.product.price,
                }))
            });

            // 2. Open WhatsApp
            const phone = (settings?.whatsapp_number || '').replace(/[^0-9]/g, '');
            const message = buildWhatsappMessage();
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');

            clearCart();
            setIsOpen(false);
            setStep('cart');
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        if (checkoutType === 'stripe') {
            setStep('form');
        } else if (checkoutType === 'whatsapp' || checkoutType === 'email') {
            setStep('form');
        }
    };

    const handleFormSubmit = () => {
        if (!acceptTerms) {
            alert('Debes aceptar los términos y condiciones para continuar.');
            return;
        }
        if (checkoutType === 'stripe') {
            handleStripeCheckout();
        } else {
            handleWhatsappCheckout();
        }
    };

    const CheckoutIcon = checkoutType === 'stripe' ? CreditCard : MessageCircle;
    const checkoutLabel = checkoutType === 'stripe'
        ? 'Pago con Tarjeta'
        : checkoutType === 'whatsapp'
            ? 'Pedir por WhatsApp'
            : 'Pedir por Email';

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={() => { setIsOpen(false); setStep('cart'); }}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[460px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        {step === 'form' ? (
                            <button
                                onClick={() => setStep('cart')}
                                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center space-x-1"
                            >
                                <span>← Volver</span>
                            </button>
                        ) : (
                            <>
                                <h2 className="font-display text-2xl font-bold tracking-tight">Tu Bolsa</h2>
                                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5">{items.length}</span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => { setIsOpen(false); setStep('cart'); }}
                        className="text-gray-300 hover:text-black transition-colors p-2"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Checkout type badge ── */}
                {items.length > 0 && step === 'cart' && (
                    <div className={`flex items-center justify-center space-x-2 py-2 text-[10px] font-black uppercase tracking-widest ${checkoutType === 'whatsapp' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                        <CheckoutIcon size={12} />
                        <span>Checkout activo: {checkoutType === 'stripe' ? 'Stripe' : checkoutType === 'whatsapp' ? 'WhatsApp Manual' : 'Email'}</span>
                    </div>
                )}

                {/* ── STEP 1: Cart Items ── */}
                {step === 'cart' ? (
                    <>
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center pb-20 space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag size={32} className="text-gray-200" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold mb-2">Tu bolsa está vacía.</p>
                                        <p className="text-gray-400 text-sm max-w-[240px] mx-auto">Aún no has encontrado tu conjunto ideal.</p>
                                    </div>
                                    <button
                                        onClick={() => { setIsOpen(false); router.push("/collections"); }}
                                        className="bg-black text-white text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-800 transition-all"
                                    >
                                        Explorar Colección
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-8">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex space-x-5 group">
                                            <div className="relative w-20 h-28 flex-shrink-0 bg-gray-50 overflow-hidden">
                                                {item.variant.mainImage && (
                                                    <Image
                                                        src={item.variant.mainImage}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <Link
                                                            href={`/product/${item.product.id}`}
                                                            onClick={() => setIsOpen(false)}
                                                            className="text-[13px] font-bold hover:opacity-60 transition-opacity leading-tight pr-2"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="text-[13px] font-bold shrink-0">{settings?.currency || '$'}{(item.product.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                        <div className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.variant.colorHex }} />
                                                        <span>{item.variant.colorName}</span>
                                                        <span>·</span>
                                                        <span>Talla {item.size}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-3">
                                                    <div className="flex items-center border border-gray-200">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center text-[12px] font-bold border-x border-gray-200 py-1">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-gray-100 px-8 pb-8 pt-6 space-y-5 bg-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Subtotal</span>
                                    <span className="text-2xl font-black tracking-tighter">{settings?.currency || '$'}{total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.2em] flex justify-between items-center px-8 hover:bg-gray-900 transition-all group"
                                >
                                    <span>{checkoutLabel}</span>
                                    <CheckoutIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[9px] text-gray-300 text-center uppercase tracking-widest">
                                    {checkoutType === 'stripe' ? 'Pago seguro con Stripe · Klarna' : checkoutType === 'whatsapp' ? 'Confirmarás tu pedido por WhatsApp' : 'Recibirás confirmación por email'}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    /* ── STEP 2: Customer Data Form ── */
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                            {/* Order Summary */}
                            <div className="bg-gray-50 p-6 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Resumen del Pedido</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-[12px]">
                                        <span className="font-semibold text-gray-600">
                                            {item.quantity}× {item.product.name}
                                            <span className="text-gray-400 ml-1">({item.size})</span>
                                        </span>
                                        <span className="font-bold">{settings?.currency || '$'}{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-sm">
                                    <span>Total</span>
                                    <span>{settings?.currency || '$'}{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Customer Fields */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tus datos</p>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Nombre completo *</label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setField('customerName', e.target.value)}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                        placeholder="Juan García"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Email *</label>
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={e => setField('customerEmail', e.target.value)}
                                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>
                                {(checkoutType === 'whatsapp') && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">WhatsApp / Teléfono</label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={e => setField('customerPhone', e.target.value)}
                                            className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                            placeholder="+34 ..."
                                        />
                                    </div>
                                )}

                                {/* Shipping Address */}
                                <div className="pt-2">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex-1 h-px bg-gray-100" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 shrink-0">📦 Dirección de Envío</p>
                                        <div className="flex-1 h-px bg-gray-100" />
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Calle y número *</label>
                                            <input
                                                type="text"
                                                value={addressStreet}
                                                onChange={e => setField('addressStreet', e.target.value)}
                                                className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                                placeholder="Calle Mayor 42, 3ºB"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Ciudad *</label>
                                                <input
                                                    type="text"
                                                    value={addressCity}
                                                    onChange={e => setField('addressCity', e.target.value)}
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                                    placeholder="Madrid"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">C.P. *</label>
                                                <input
                                                    type="text"
                                                    value={addressPostal}
                                                    onChange={e => setField('addressPostal', e.target.value)}
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                                    placeholder="28001"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">País *</label>
                                            <input
                                                type="text"
                                                value={addressCountry}
                                                onChange={e => setField('addressCountry', e.target.value)}
                                                className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                                placeholder="España"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {checkoutType === 'whatsapp' && (
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm">
                                        <div className="flex items-start space-x-3">
                                            <MessageCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-1">Pedido por WhatsApp</p>
                                                <p className="text-[10px] text-emerald-700 leading-relaxed">
                                                    Al confirmar, se abrirá WhatsApp con un mensaje con tu pedido completo y dirección de envío. El vendedor coordinará el pago.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Consents */}
                                <div className="pt-4 space-y-4 border-t border-gray-100">
                                    <label className="flex items-start space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acceptTerms}
                                                onChange={e => setField('acceptTerms', e.target.checked)}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-200 checked:bg-black checked:border-black transition-all"
                                                required
                                            />
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-medium leading-relaxed group-hover:text-black transition-colors">
                                            He leído y acepto los <Link href="/privacidad" className="underline font-bold">Términos y Condiciones</Link> así como la política de privacidad. *
                                        </span>
                                    </label>

                                    <label className="flex items-start space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acceptMarketing}
                                                onChange={e => setField('acceptMarketing', e.target.checked)}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-200 checked:bg-black checked:border-black transition-all"
                                            />
                                            <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="text-[11px] text-gray-500 font-medium leading-relaxed group-hover:text-black transition-colors">
                                            Quiero recibir correos de Fenixfit con nuevas ofertas, lanzamientos y productos exclusivos.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="border-t border-gray-100 px-8 py-6 bg-white">
                            <button
                                onClick={handleFormSubmit}
                                disabled={isCheckingOut}
                                className={`w-full py-5 text-xs font-bold uppercase tracking-[0.2em] flex justify-center items-center space-x-3 transition-all ${checkoutType === 'whatsapp' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-black hover:bg-gray-900 text-white'} disabled:opacity-50`}
                            >
                                {isCheckingOut ? (
                                    <><Loader2 size={16} className="animate-spin" /><span>Procesando...</span></>
                                ) : (
                                    <><CheckoutIcon size={16} /><span>{checkoutLabel}</span></>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
