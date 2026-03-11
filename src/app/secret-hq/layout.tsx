"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Megaphone,
    LogOut,
    Settings,
    Bell,
    Search,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    User,
    Mail,
    Edit3,
    X,
    Save,
    Loader2,
    Tag,
} from "lucide-react";

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isAccessPage = !!(pathname && pathname.includes("/secret-hq/access"));

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && !isAccessPage) {
                router.replace("/secret-hq/access");
                return;
            }
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
                    avatar_url: session.user.user_metadata?.avatar_url || "",
                });
                setEditName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || "");
            }
            setIsAdmin(!!session);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdmin(!!session);
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
                    avatar_url: session.user.user_metadata?.avatar_url || "",
                });
            }
            if (!session && !isAccessPage) {
                router.replace("/secret-hq/access");
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router, isAccessPage]);

    // Close user menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/secret-hq/access");
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMsg("");
        try {
            const updates: any = {
                data: { full_name: editName }
            };
            if (editPassword && editPassword.length >= 6) {
                updates.password = editPassword;
            }
            const { error } = await supabase.auth.updateUser(updates);
            if (error) throw error;
            setUser(u => u ? { ...u, full_name: editName } : u);
            setSaveMsg("✓ Perfil actualizado correctamente");
            setEditPassword("");
        } catch (err: any) {
            setSaveMsg("✗ Error: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isAccessPage) {
        return <div className="min-h-screen bg-black">{children}</div>;
    }

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center space-y-6">
                    <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-black italic text-2xl -rotate-12 animate-pulse">F</div>
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/secret-hq/dashboard', icon: LayoutDashboard },
        { name: 'Productos', href: '/secret-hq/products', icon: Package },
        { name: 'Categorías', href: '/secret-hq/categories', icon: Tag },
        { name: 'Pedidos', href: '/secret-hq/orders', icon: ShoppingBag },
        { name: 'Marketing', href: '/secret-hq/marketing', icon: Megaphone },
        { name: 'Configuración', href: '/secret-hq/settings', icon: Settings },
    ];

    // Display name: prefer full_name, else email username
    const displayName = user?.full_name || user?.email?.split("@")[0] || "Admin";
    const displayEmail = user?.email || "";
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
            {/* ── Sidebar ── */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#090909] border-r border-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex-shrink-0 ${isSidebarOpen ? 'w-[260px]' : 'w-[72px]'}`}
            >
                <div className="flex flex-col h-full">
                    {/* ── Sidebar Header: Logo + Collapse button ── */}
                    <div className={`h-[72px] flex items-center border-b border-white/[0.06] transition-all duration-300 ${isSidebarOpen ? 'px-4 justify-between' : 'px-3 justify-center'}`}>
                        {/* Logo */}
                        <div className={`flex items-center min-w-0 ${isSidebarOpen ? 'flex-1 mr-2' : ''}`}>
                            <div className="shrink-0 w-9 h-9 flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/fenix-logo-white.png"
                                    alt="Fenix Fit"
                                    width={36}
                                    height={36}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <span className={`ml-2.5 font-display text-[13px] font-black italic tracking-tighter uppercase transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'}`}>
                                Fenix HQ
                            </span>
                        </div>

                        {/* Collapse button — top right of sidebar header */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            title={isSidebarOpen ? 'Contraer menú' : 'Expandir menú'}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-sm text-white/25 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 transition-all duration-200"
                        >
                            {isSidebarOpen
                                ? <PanelLeftClose size={15} />
                                : <PanelLeftOpen size={15} />
                            }
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={!isSidebarOpen ? item.name : undefined}
                                    className={`flex items-center px-3 py-3 rounded-sm group transition-all duration-200 relative ${isActive
                                        ? 'bg-white text-black'
                                        : 'text-white/30 hover:text-white hover:bg-white/[0.04]'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-black rounded-full" />
                                    )}
                                    <Icon
                                        size={18}
                                        className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-black' : 'group-hover:scale-110'}`}
                                    />
                                    <span className={`ml-3 text-[11px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}>
                                        {item.name}
                                    </span>
                                    {isActive && isSidebarOpen && (
                                        <ChevronRight className="ml-auto shrink-0 text-black/40" size={14} />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer: Logout only */}
                    <div className="p-3 border-t border-white/[0.06]">
                        <button
                            onClick={handleLogout}
                            title={!isSidebarOpen ? 'Salir del sistema' : undefined}
                            className={`w-full flex items-center px-3 py-3 rounded-sm text-white/25 hover:text-rose-500 hover:bg-rose-500/[0.06] transition-all duration-200 ${!isSidebarOpen ? 'justify-center' : ''}`}
                        >
                            <LogOut size={18} className="shrink-0" />
                            <span className={`ml-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}>
                                Salir del Sistema
                            </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
                {/* Top Header */}
                <header className="h-[72px] border-b border-white/[0.06] bg-[#090909]/80 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center bg-white/[0.04] border border-white/[0.06] px-4 py-2.5 w-full max-w-sm focus-within:border-white/20 transition-all">
                        <Search size={14} className="text-white/20 shrink-0" />
                        <input
                            type="text"
                            placeholder="Buscar en el sistema..."
                            className="bg-transparent border-none focus:ring-0 text-[11px] font-bold tracking-widest text-white ml-3 w-full placeholder:text-white/10 uppercase outline-none"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Bell */}
                        <button className="relative text-white/30 hover:text-white transition-colors p-2">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        </button>

                        {/* User info + settings dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 border border-white/[0.06] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-2 transition-all duration-200"
                            >
                                {/* Avatar */}
                                <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black text-[10px] shrink-0">
                                    {initials}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{displayName}</p>
                                    <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">● Online</p>
                                </div>
                                <Settings size={14} className="text-white/30 shrink-0" />
                            </button>

                            {/* Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0d0d0d] border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User card */}
                                    <div className="px-5 py-4 border-b border-white/5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-white truncate">{displayName}</p>
                                                <p className="text-[9px] text-white/30 truncate mt-0.5">{displayEmail}</p>
                                                <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">● Online</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => { setShowEditModal(true); setShowUserMenu(false); }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.05] transition-all rounded-sm"
                                        >
                                            <Edit3 size={14} />
                                            <span>Editar Perfil</span>
                                        </button>
                                        <Link
                                            href="/secret-hq/settings"
                                            onClick={() => setShowUserMenu(false)}
                                            className="w-full flex items-center space-x-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.05] transition-all rounded-sm"
                                        >
                                            <Settings size={14} />
                                            <span>Configuración CRM</span>
                                        </Link>
                                        <div className="border-t border-white/5 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/[0.05] transition-all rounded-sm"
                                            >
                                                <LogOut size={14} />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page */}
                <section className="flex-1 overflow-y-auto">
                    <div className="p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </section>
            </main>

            {/* ── Edit Profile Modal ── */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-6 border-b border-white/5">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Cuenta</p>
                                <h2 className="font-black text-[15px] uppercase tracking-wider">Editar Perfil</h2>
                            </div>
                            <button onClick={() => { setShowEditModal(false); setSaveMsg(""); }} className="text-white/20 hover:text-white transition-colors p-1">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Current info */}
                        <div className="px-7 py-5 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-base">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest">{displayName}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Mail size={10} className="text-white/20" />
                                        <p className="text-[10px] text-white/30">{displayEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="px-7 py-6 space-y-5">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">
                                    <User size={10} className="inline mr-2" />Nombre completo
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[12px] text-white focus:border-white/30 outline-none transition-all"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">
                                    Nueva contraseña (opcional)
                                </label>
                                <input
                                    type="password"
                                    value={editPassword}
                                    onChange={e => setEditPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[12px] text-white focus:border-white/30 outline-none transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <p className="text-[9px] text-white/20 mt-1">Déjala en blanco para no cambiarla</p>
                            </div>

                            {saveMsg && (
                                <p className={`text-[10px] font-black uppercase tracking-widest ${saveMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {saveMsg}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-7 pb-7 flex gap-3">
                            <button
                                onClick={() => { setShowEditModal(false); setSaveMsg(""); }}
                                className="flex-1 border border-white/10 text-white/30 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="flex-1 bg-white text-black py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
