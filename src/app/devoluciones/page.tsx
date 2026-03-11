import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, CheckCircle2, XCircle, Mail, Clock, AlertTriangle, ArrowRight, Package } from "lucide-react";

export const metadata: Metadata = {
    title: "Cambios y Devoluciones | Fenix Fit",
    description: "Política de cambios y devoluciones de Fenix Fit. 14 días naturales para devolver o cambiar tu pedido, siempre que el producto esté en perfectas condiciones.",
    openGraph: {
        title: "Cambios y Devoluciones | Fenix Fit",
        description: "Tienes 14 días naturales para solicitar un cambio o devolución desde que recibes tu pedido.",
    },
};

const CONDITIONS = [
    { ok: true, text: "El producto está sin usar, en perfectas condiciones." },
    { ok: true, text: "Conserva sus etiquetas originales intactas." },
    { ok: true, text: "Mantiene el embalaje y protección original." },
    { ok: true, text: "La solicitud se realiza dentro del plazo de 14 días naturales desde la recepción." },
    { ok: false, text: "Productos usados, lavados, o con signos de uso." },
    { ok: false, text: "Artículos sin etiqueta o con embalaje dañado." },
    { ok: false, text: "Solicitudes fuera del plazo de 14 días naturales." },
];

const STEPS_RETURN = [
    { step: "01", title: "Contáctanos", desc: "Escríbenos a info@fenixfit.es en los primeros 7 días desde que recibes el pedido, indicando el número de pedido y el motivo." },
    { step: "02", title: "Te indicamos cómo enviar", desc: "Te confirmaremos el proceso y la dirección de envío para que puedas devolver el producto de forma segura." },
    { step: "03", title: "Envías el paquete", desc: "Tú eliges la empresa de mensajería. Solicita siempre un justificante de entrega. Los gastos de devolución corren a cargo del cliente." },
    { step: "04", title: "Revisamos y gestionamos", desc: "Al recibir el artículo, lo inspeccionamos. Si todo está en orden, gestionamos el cambio o la devolución de inmediato." },
];

export default function DevolucionesPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero */}
            <section className="relative border-b border-white/5 py-32 px-6 md:px-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">
                        Returns // Exchanges
                    </span>
                    <h1 className="font-display text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">
                        Cambios y<br />Devoluciones
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
                        Queremos que estés completamente satisfecho/a con tu compra. Si algo no es como esperabas, aquí tienes toda la información para gestionar un cambio o devolución.
                    </p>
                </div>
            </section>

            {/* Main policy */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white text-black p-10 flex flex-col justify-between">
                        <Clock size={32} className="mb-8" />
                        <div>
                            <p className="font-display text-6xl font-black italic mb-2">14</p>
                            <p className="font-black text-[10px] uppercase tracking-widest mb-4">Días naturales</p>
                            <p className="text-[12px] text-black/60 leading-relaxed">
                                Plazo desde la recepción del pedido para solicitar un cambio o devolución, conforme a la Ley General para la Defensa de los Consumidores y Usuarios.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 p-10 flex flex-col justify-between">
                        <RotateCcw size={28} className="text-emerald-400 mb-8" />
                        <div>
                            <p className="font-display text-4xl font-black italic mb-2 text-emerald-400">Cambio</p>
                            <p className="font-black text-[10px] uppercase tracking-widest text-white/40 mb-4">de talla gratuito</p>
                            <p className="text-[12px] text-white/40 leading-relaxed">
                                Si necesitas otra talla, el coste del nuevo envío corre a cargo de Fenix Fit una vez hayamos recibido y verificado el artículo devuelto.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 p-10 flex flex-col justify-between">
                        <Package size={28} className="text-amber-400 mb-8" />
                        <div>
                            <p className="font-display text-4xl font-black italic mb-2 text-amber-400">Gastos</p>
                            <p className="font-black text-[10px] uppercase tracking-widest text-white/40 mb-4">de devolución al cliente</p>
                            <p className="text-[12px] text-white/40 leading-relaxed">
                                Los gastos del envío de vuelta (desde tu domicilio a nuestros almacenes) corren a cargo del cliente. Puedes usar la mensajería que prefieras.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-16">Cómo Gestionar una Devolución</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                        {STEPS_RETURN.map((s, i) => (
                            <div key={s.step} className="relative border border-white/5 p-8 group hover:border-white/20 transition-all duration-500">
                                <span className="font-display text-6xl font-black italic text-white/5 group-hover:text-white/10 transition-colors mb-4 block leading-none">{s.step}</span>
                                <h3 className="font-black text-[12px] uppercase tracking-wider mb-3 text-white/80">{s.title}</h3>
                                <p className="text-white/30 text-[11px] leading-relaxed">{s.desc}</p>
                                {i < STEPS_RETURN.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                                        <ArrowRight size={14} className="text-white/10" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Conditions */}
            <section className="py-24 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-8">Condiciones del Producto</p>
                        <div className="space-y-3">
                            {CONDITIONS.map((c, i) => (
                                <div key={i} className={`flex items-start space-x-4 p-4 border ${c.ok ? 'border-emerald-400/10 bg-emerald-400/5' : 'border-rose-500/10 bg-rose-500/5'}`}>
                                    {c.ok
                                        ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                        : <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />}
                                    <p className={`text-[11px] leading-relaxed ${c.ok ? 'text-white/60' : 'text-white/40'}`}>{c.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-8">Importante</p>
                        <div className="bg-amber-400/5 border border-amber-400/20 p-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                                <p className="font-black text-[11px] uppercase tracking-widest text-amber-400">Reserva el derecho de rechazo</p>
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed">
                                Fenix Fit se reserva el derecho a denegar el cambio o devolución a aquellos usuarios que soliciten el cambio fuera de plazo y/o cuya devolución del producto no cumpla con las condiciones establecidas.
                            </p>
                        </div>
                        <div className="bg-blue-400/5 border border-blue-400/20 p-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Package size={18} className="text-blue-400 shrink-0" />
                                <p className="font-black text-[11px] uppercase tracking-widest text-blue-400">Justificante de entrega</p>
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed">
                                Exige siempre un <strong className="text-white/60">justificante de entrega</strong> a la empresa de mensajería cuando entregues el paquete, de manera que quede constancia de que el producto ha sido depositado correctamente.
                            </p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 p-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Mail size={18} className="text-white/20 shrink-0" />
                                <p className="font-black text-[11px] uppercase tracking-widest text-white">Contáctanos</p>
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-5">
                                Para iniciar el proceso, escríbenos a nuestro email dentro de los primeros <strong className="text-white/60">7 días</strong> desde la recepción del pedido.
                            </p>
                            <a
                                href="mailto:info@fenixfit.es"
                                className="inline-flex items-center space-x-2 bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                            >
                                <span>info@fenixfit.es</span>
                                <ArrowRight size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legal note */}
            <section className="py-16 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8">
                        <p className="text-white/20 text-[9px] uppercase tracking-widest font-black mb-3">Base Legal</p>
                        <p className="text-[11px] text-white/30 leading-relaxed">
                            Nuestra política de devoluciones se rige conforme al <strong className="text-white/50">Real Decreto Legislativo 1/2007, de 16 de noviembre</strong>, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias, que establece un derecho de desistimiento de 14 días naturales desde la recepción del bien.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom links */}
            <section className="py-20 px-6 md:px-20">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mb-2">Más información</p>
                        <h2 className="font-display text-3xl font-black italic tracking-tighter uppercase">Información de Envíos</h2>
                    </div>
                    <Link
                        href="/envios"
                        className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center space-x-3"
                    >
                        <span>Ver Envíos</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
