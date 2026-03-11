import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Política de Privacidad | Fenix Fit",
    description: "Política de privacidad y cookies de Fenix Fit. Información sobre el tratamiento de datos personales, tus derechos y cómo gestionamos tus datos de forma segura.",
    openGraph: {
        title: "Política de Privacidad | Fenix Fit",
        description: "Información sobre el tratamiento de tus datos personales por parte de Fenix Fit.",
    },
};

const sections = [
    {
        num: "01",
        title: "Identidad del Responsable",
        content: [
            { label: "Nombre comercial", value: "Fenix Fit" },
            { label: "Email de contacto", value: "info@fenixfit.es", link: "mailto:info@fenixfit.es" },
            { label: "Sitio web", value: "www.fenixfit.es", link: "https://www.fenixfit.es" },
            { label: "Marco legal", value: "RGPD (UE) 2016/679 · LOPDGDD 3/2018 · LSSI-CE 34/2002" },
        ]
    },
    {
        num: "02",
        title: "Datos que se Recogen",
        body: `A través del sitio web podemos recoger los siguientes datos personales:\n\n• Datos identificativos: nombre y apellidos.\n• Datos de contacto: correo electrónico y teléfono.\n• Dirección de envío: calle, ciudad, código postal y país.\n• Información del pedido: productos, cantidades y precios.\n• Datos de navegación obtenidos a través de cookies técnicas y analíticas.`
    },
    {
        num: "03",
        title: "Finalidad del Tratamiento",
        body: `Los datos personales que recopilamos tienen las siguientes finalidades:\n\n• Gestionar y procesar los pedidos realizados en la tienda.\n• Comunicarnos contigo en relación a tu pedido, envío o incidencia.\n• Envío de comunicaciones comerciales si has dado tu consentimiento expreso.\n• Obtener estadísticas anónimas de uso y navegación mediante cookies analíticas.\n• Garantizar la seguridad del sitio y prevenir usos fraudulentos.`
    },
    {
        num: "04",
        title: "Base Jurídica del Tratamiento",
        body: `El tratamiento de tus datos se basa en:\n\n• Consentimiento explícito del usuario al aceptar las condiciones de compra o al aceptar cookies.\n• Ejecución de un contrato de compraventa (el pedido).\n• Obligaciones legales que nos aplican como empresa.\n• Interés legítimo para mantener la seguridad del sitio web.`
    },
    {
        num: "05",
        title: "Destinatarios de los Datos",
        body: `No cedemos tus datos a terceros salvo:\n\n• Empresas de mensajería / transporte, para gestionar la entrega de tu pedido.\n• Proveedores de pago (Stripe), que aplican sus propias políticas de privacidad y seguridad.\n• Proveedores tecnológicos como Supabase (alojamiento de base de datos).\n• En caso de obligación legal.\n\nEn el caso de proveedores estadounidenses, las transferencias se amparan en Cláusulas Contractuales Tipo aprobadas por la Comisión Europea.`
    },
    {
        num: "06",
        title: "Conservación de los Datos",
        body: `Los datos personales se conservarán:\n\n• Durante el tiempo necesario para cumplir la finalidad para la que fueron recabados.\n• Durante el período legal de conservación de información fiscal y mercantil (mínimo 5 años).\n• Hasta que el usuario solicite su supresión o retire su consentimiento, cuando sea aplicable.`
    },
    {
        num: "07",
        title: "Derechos del Usuario",
        body: `Como usuario, tienes derecho a:\n\n• Acceder a tus datos personales.\n• Solicitar su rectificación si son inexactos.\n• Solicitar su supresión (derecho al olvido).\n• Solicitar la limitación del tratamiento.\n• Oponerte al tratamiento de tus datos.\n• Solicitar la portabilidad de los datos.\n\nPuedes ejercer estos derechos enviando un email a info@fenixfit.es adjuntando una copia de tu documento de identidad.\n\nSi consideras que tus derechos han sido vulnerados, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`
    },
    {
        num: "08",
        title: "Seguridad de los Datos",
        body: `Fenix Fit ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su pérdida, mal uso, alteración, acceso no autorizado o robo.\n\nTodas las transacciones de pago se realizan a través de plataformas certificadas con cifrado SSL y estándares PCI-DSS.`
    },
    {
        num: "09",
        title: "Política de Cookies",
        body: `Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al visitar nuestra web.\n\nTipos de cookies que utilizamos:\n\n• Cookies técnicas (necesarias): permiten el funcionamiento básico de la web, como la gestión del carrito de compra y la sesión de usuario. No requieren consentimiento.\n• Cookies analíticas: nos permiten medir el uso del sitio web de forma anónima (ej. Google Analytics con IP anonimizada). Requieren tu consentimiento.\n• Cookies de preferencias: guardan tus preferencias de idioma, moneda, etc.\n\nPuedes gestionar o rechazar las cookies desde el panel de preferencias que aparece al acceder al sitio, o eliminarlas desde la configuración de tu navegador.`
    },
    {
        num: "10",
        title: "Cambios en la Política",
        body: `Fenix Fit se reserva el derecho a modificar esta Política de Privacidad para adaptarla a novedades legislativas o cambios en el servicio. Te recomendamos revisar periódicamente esta página.\n\nÚltima actualización: marzo de 2026.`
    },
];

export default function PrivacidadPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero */}
            <section className="relative border-b border-white/5 py-32 px-6 md:px-20 overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Legal // Privacy</span>
                    <h1 className="font-display text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-8">
                        Política de<br />Privacidad
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Shield size={16} className="text-white/20" />
                        <p className="text-white/30 text-[11px] uppercase tracking-widest font-black">Última actualización: marzo de 2026</p>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="py-16 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8">
                        <p className="text-[13px] text-white/50 leading-loose">
                            En cumplimiento de la normativa vigente en materia de protección de datos personales, en particular el <strong className="text-white/70">Reglamento (UE) 2016/679 (RGPD)</strong>, la <strong className="text-white/70">Ley Orgánica 3/2018 (LOPDGDD)</strong> y la <strong className="text-white/70">Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE)</strong>, informamos al usuario sobre el tratamiento de sus datos personales a través de este sitio web.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sections */}
            <section className="py-16 px-6 md:px-20 space-y-2">
                <div className="max-w-5xl mx-auto space-y-2">
                    {sections.map((section) => (
                        <div key={section.num} className="border border-white/5 bg-[#0a0a0a]">
                            <div className="flex items-start space-x-8 p-8">
                                <span className="font-display text-4xl font-black italic text-white/10 shrink-0 leading-none mt-1">{section.num}</span>
                                <div className="flex-1">
                                    <h2 className="font-black text-[14px] uppercase tracking-wider text-white mb-6">{section.title}</h2>
                                    {section.content && (
                                        <div className="space-y-3">
                                            {section.content.map((item) => (
                                                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 w-40 shrink-0">{item.label}</span>
                                                    {item.link
                                                        ? <a href={item.link} className="text-[12px] text-white/60 hover:text-white transition-colors">{item.value}</a>
                                                        : <span className="text-[12px] text-white/50">{item.value}</span>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.body && (
                                        <div className="space-y-2">
                                            {section.body.split('\n').map((line, i) => (
                                                line.trim() === '' ? <div key={i} className="h-2" /> :
                                                    line.startsWith('•') ? (
                                                        <div key={i} className="flex items-start space-x-3">
                                                            <span className="text-white/20 mt-1 shrink-0">·</span>
                                                            <p className="text-[12px] text-white/50 leading-relaxed">{line.slice(1).trim()}</p>
                                                        </div>
                                                    ) : (
                                                        <p key={i} className="text-[12px] text-white/50 leading-relaxed">{line}</p>
                                                    )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className="py-24 px-6 md:px-20 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mb-2">¿Tienes preguntas?</p>
                        <h2 className="font-display text-3xl font-black italic tracking-tighter uppercase">Contacta con nosotros</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="mailto:info@fenixfit.es"
                            className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center space-x-3"
                        >
                            <span>info@fenixfit.es</span>
                            <ArrowRight size={14} />
                        </a>
                        <Link href="/devoluciones" className="border border-white/20 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center space-x-3">
                            <span>Devoluciones</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
