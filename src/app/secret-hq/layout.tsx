"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
    ChevronLeft,
    ChevronFirst,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

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

    const isAccessPage = !!(pathname && pathname.includes("/secret-hq/access"));

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && !isAccessPage) {
                router.replace("/secret-hq/access");
            }
            setIsAdmin(!!session);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdmin(!!session);
            if (!session && !isAccessPage) {
                router.replace("/secret-hq/access");
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router, isAccessPage]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/secret-hq/access");
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
        { name: 'Pedidos', href: '/secret-hq/orders', icon: ShoppingBag },
        { name: 'Marketing', href: '/secret-hq/marketing', icon: Megaphone },
        { name: 'Configuración', href: '/secret-hq/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
            {/* ── Sidebar ── */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#090909] border-r border-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex-shrink-0 ${isSidebarOpen ? 'w-[260px]' : 'w-[72px]'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`h-[72px] flex items-center border-b border-white/[0.06] transition-all duration-300 ${isSidebarOpen ? 'px-6 justify-between' : 'px-4 justify-center'}`}>
                        <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black italic text-lg -rotate-6 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                F
                            </div>
                            <span className={`font-display text-base font-black italic tracking-tighter uppercase transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'}`}>
                                Fenix HQ
                            </span>
                        </div>
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

                    {/* Footer */}
                    <div className="p-3 space-y-1 border-t border-white/[0.06]">
                        {/* ── COLLAPSE BUTTON ── */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            title={isSidebarOpen ? 'Contraer menú' : 'Expandir menú'}
                            className={`w-full flex items-center px-3 py-3 rounded-sm text-white/25 hover:text-white hover:bg-white/[0.06] transition-all duration-200 group ${!isSidebarOpen ? 'justify-center' : ''}`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 transition-all duration-300 shrink-0 ${!isSidebarOpen ? 'bg-white/5 group-hover:bg-white group-hover:text-black' : ''}`}>
                                {isSidebarOpen
                                    ? <PanelLeftClose size={15} />
                                    : <PanelLeftOpen size={15} />
                                }
                            </div>
                            <span className={`ml-3 text-[10px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}`}>
                                Contraer
                            </span>
                        </button>

                        {/* Logout */}
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

                    <div className="flex items-center space-x-6">
                        <button className="relative text-white/30 hover:text-white transition-colors p-2">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        </button>
                        <div className="flex items-center space-x-3 border-l border-white/[0.06] pl-6">
                            <div className="hidden sm:block text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest">Admin</p>
                                <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">● Online</p>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/30 transition-all">
                                <Settings size={16} className="text-white/40" />
                            </div>
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
        </div>
    );
}
