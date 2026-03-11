import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, MapPin, AlertTriangle, Package, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Envíos | Fenix Fit",
    description: "Información sobre plazos de entrega, empresas de transporte y gestión de envíos de Fenix Fit. Realizamos envíos a toda España y Europa.",
    openGraph: {
        title: "Envíos | Fenix Fit",
        description: "Plazos de entrega, costes y toda la información sobre los envíos de Fenix Fit.",
    },
};

const SHIPPING_ZONES = [
    {
        zone: "España Peninsular y Baleares",
        time: "3 – 5 días laborables",
        price: "Desde 4,95 €",
        icon: "🇪🇸",
    },
    {
        zone: "Canarias, Ceuta y Melilla",
        time: "5 – 7 días laborables",
        price: "Desde 6,95 €",
        icon: "🌊",
    },
    {
        zone: "Europa",
        time: "7 – 14 días laborables",
        price: "Desde 12,95 €",
        icon: "🌍",
    },
];

const STEPS = [
    { step: "01", title: "Confirmamos tu pedido", desc: "Recibirás un email de confirmación en cuanto validemos tu pago o solicitud de compra." },
    { step: "02", title: "Preparamos tu paquete", desc: "Nuestro equipo prepara, revisa y empaqueta tu pedido con todo el cuidado que merece." },
    { step: "03", title: "Lo enviamos", desc: "El paquete sale de nuestros almacenes. Recibirás el número de seguimiento por email." },
    { step: "04", title: "Llega a tu puerta", desc: "La empresa de transporte lo entrega en la dirección que indicaste. ¡A disfrutarlo!" },
];

export default function EnviosPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero */}
            <section className="relative border-b border-white/5 py-32 px-6 md:px-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">
                        Logística // Delivery
                    </span>
                    <h1 className="font-display text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-8">
                        Envíos
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                        Trabajamos con las mejores empresas de transporte para que tu pedido llegue en perfectas condiciones y en el menor tiempo posible.
                    </p>
                </div>
            </section>

            {/* Process steps */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-16">Proceso de Envío</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                        {STEPS.map((s, i) => (
                            <div key={s.step} className="relative flex flex-col border border-white/5 p-8 group hover:border-white/20 transition-all duration-500">
                                <span className="font-display text-6xl font-black italic text-white/5 group-hover:text-white/10 transition-colors duration-500 mb-4 leading-none">{s.step}</span>
                                <h3 className="font-black text-[13px] uppercase tracking-wider mb-3 text-white/80">{s.title}</h3>
                                <p className="text-white/30 text-[11px] leading-relaxed">{s.desc}</p>
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                        <ArrowRight size={16} className="text-white/10" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shipping zones */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-16">Zonas y Plazos</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SHIPPING_ZONES.map((zone) => (
                            <div key={zone.zone} className="bg-[#0a0a0a] border border-white/5 p-8 hover:border-white/20 transition-all duration-500 group">
                                <div className="text-4xl mb-6">{zone.icon}</div>
                                <h3 className="font-black text-[13px] uppercase tracking-wider text-white mb-4">{zone.zone}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Clock size={14} className="text-white/20 shrink-0" />
                                        <span className="text-[11px] text-white/50">{zone.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Truck size={14} className="text-white/20 shrink-0" />
                                        <span className="text-[11px] text-white/50">{zone.price}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Sujeto a disponibilidad</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Details */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Info boxes */}
                    <div className="space-y-6">
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-8">Información Importante</p>
                        {[
                            {
                                icon: CheckCircle2, color: "text-emerald-400",
                                title: "Envíos tras confirmación",
                                body: "Los envíos se realizarán una vez confirmado el pago o recibido el justificante en caso de transferencia bancaria. No se realiza ningún envío sin confirmar el pedido."
                            },
                            {
                                icon: Package, color: "text-blue-400",
                                title: "Empresa de transporte",
                                body: "Trabajamos con empresas de mensajería de reconocido prestigio. Recibirás un email con el número de seguimiento para que puedas rastrear tu pedido en todo momento."
                            },
                            {
                                icon: MapPin, color: "text-amber-400",
                                title: "Datos de envío correctos",
                                body: "Por favor, revisa que la dirección de envío sea correcta antes de confirmar tu pedido. El tiempo de envío puede verse afectado por errores en los datos de contacto o dirección."
                            },
                        ].map((item) => (
                            <div key={item.title} className="bg-[#0a0a0a] border border-white/5 p-6 flex space-x-5">
                                <item.icon size={20} className={`${item.color} shrink-0 mt-0.5`} />
                                <div>
                                    <p className="font-black text-[12px] uppercase tracking-wider text-white mb-2">{item.title}</p>
                                    <p className="text-[11px] text-white/40 leading-relaxed">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Warning + contact */}
                    <div className="space-y-6">
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-8">Aduanas y Gastos Adicionales</p>
                        <div className="bg-amber-400/5 border border-amber-400/20 p-8 space-y-4">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle size={20} className="text-amber-400 shrink-0" />
                                <p className="font-black text-[12px] uppercase tracking-wider text-amber-400">Importante — Canarias y envíos internacionales</p>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed">
                                Los envíos fuera de la Península Ibérica <strong className="text-white/80">podrían incluir gastos de portes aduaneros (DUA)</strong>. Cualquier gasto adicional derivado del pago de derechos aduaneros y/o arancelarios correrá a cargo del destinatario final.
                            </p>
                            <p className="text-[11px] text-white/30 leading-relaxed">
                                Te recomendamos que compruebes la legislación aduanera de tu país antes de realizar el pedido si resides fuera de España peninsular.
                            </p>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/5 p-8 space-y-4">
                            <p className="font-black text-[12px] uppercase tracking-wider text-white">¿Tienes alguna duda?</p>
                            <p className="text-[11px] text-white/40 leading-relaxed">
                                Si necesitas información sobre el estado de tu pedido o tienes cualquier consulta relacionada con el envío, no dudes en contactarnos.
                            </p>
                            <a
                                href="mailto:info@fenixfit.es"
                                className="inline-flex items-center space-x-2 border border-white/20 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <span>Contactar</span>
                                <ArrowRight size={13} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 md:px-20">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black">También te puede interesar</p>
                        <h2 className="font-display text-3xl font-black italic tracking-tighter uppercase">Cambios y Devoluciones</h2>
                    </div>
                    <Link
                        href="/devoluciones"
                        className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center space-x-3"
                    >
                        <span>Ver Política</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
