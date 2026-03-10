import { createClient } from "@/lib/supabase/server";
import {
    Megaphone,
    Trash2,
    Eye,
    Edit3,
    Plus,
    ChevronRight,
    Monitor,
    Smartphone,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Image from "next/image";

export default async function AdminMarketingPage() {
    const supabase = await createClient();
    const { data: assets } = await supabase
        .from('marketing_assets')
        .select('*')
        .order('priority', { ascending: true });

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-20">
                <div className="max-w-xl">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Visual Assets // Campaign Mgmt</span>
                    <h1 className="font-display text-6xl md:text-8xl font-black italic tracking-tightest uppercase leading-none mb-8">
                        Marketing
                    </h1>
                    <p className="text-white/20 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Control directo sobre la narrativa visual de Fenix Fit. Gestiona banners, pop-ups y anuncios estratégicos.
                    </p>
                </div>
                <button className="bg-white text-black px-12 py-6 text-[11px] font-black uppercase tracking-[0.25em] flex items-center space-x-4 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1">
                    <Plus size={18} />
                    <span>Nueva Campaña</span>
                </button>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 gap-12">
                {assets?.map((asset) => (
                    <div key={asset.id} className="group flex flex-col xl:flex-row bg-[#080808] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden min-h-[400px]">
                        {/* Visual Preview */}
                        <div className="w-full xl:w-2/5 relative h-80 xl:h-auto overflow-hidden bg-black flex items-center justify-center p-4">
                            <div className="relative w-full h-full border border-white/10 group-hover:scale-105 transition-transform duration-1000">
                                <Image
                                    src={asset.image_url}
                                    alt={asset.title || 'Marketing Asset'}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white uppercase italic font-black font-display text-4xl leading-none">
                                    {asset.title}
                                </div>
                            </div>
                            <div className="absolute top-8 left-8 flex space-x-3">
                                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-black tracking-widest text-white uppercase flex items-center">
                                    <Monitor size={12} className="mr-2" /> DESKTOP
                                </div>
                                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-black tracking-widest text-white/40 uppercase flex items-center">
                                    <Smartphone size={12} className="mr-2" /> MOBILE
                                </div>
                            </div>
                        </div>

                        {/* Asset Details */}
                        <div className="flex-1 p-10 xl:p-16 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-10">
                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Identificación de Activo</label>
                                        <h4 className="text-[13px] font-black uppercase tracking-widest text-white mb-2">{asset.type}</h4>
                                        <p className="text-white/30 text-[11px] font-medium leading-relaxed italic">{asset.description}</p>
                                    </div>

                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Dirección de Destino (URL)</label>
                                        <p className="text-[11px] font-black text-white/60 tracking-tight hover:text-white cursor-pointer transition-colors max-w-sm truncate inline-flex items-center">
                                            {asset.target_url || 'SIN DESTINO CONFIGURADO'}
                                            <ChevronRight size={12} className="ml-2" />
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <label className="text-white/10 text-[9px] uppercase tracking-[0.3em] font-black mb-3 block">Estado de Operación</label>
                                        <div className="flex items-center space-x-6">
                                            <span className={`flex items-center text-[10px] font-black px-4 py-2 uppercase tracking-widest ${asset.is_active ? 'bg-emerald-400/5 text-emerald-400 border border-emerald-400/20' : 'bg-red-500/5 text-red-500 border border-red-500/20'
                                                }`}>
                                                {asset.is_active ? <CheckCircle2 size={14} className="mr-3" /> : <AlertCircle size={14} className="mr-3" />}
                                                {asset.is_active ? 'Activo en Web' : 'Inactivo / Archivo'}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                                Prioridad: <span className="text-white">{asset.priority}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mt-12 pt-10 border-t border-white/5">
                                <button className="flex-1 md:flex-none bg-white/5 border border-white/10 px-10 py-4 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-white hover:text-black transition-all">
                                    <Edit3 size={14} />
                                    <span>Editar Activo</span>
                                </button>
                                <button className="flex-1 md:flex-none border border-white/5 px-10 py-4 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-white/5 transition-all text-white/40">
                                    <Eye size={14} />
                                    <span>Vista Previa</span>
                                </button>
                                <button className="flex-1 md:flex-none border border-red-500/20 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-red-500 hover:text-white transition-all text-red-500/60 ml-auto">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {(!assets || assets.length === 0) && (
                    <div className="py-40 text-center border-2 border-dashed border-white/5">
                        <Megaphone size={48} className="mx-auto mb-8 text-white/10" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20">No hay activos de marketing configurados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
