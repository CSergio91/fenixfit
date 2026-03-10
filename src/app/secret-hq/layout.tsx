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
    Menu,
    X
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

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/secret-hq/access");
                return;
            }
            setIsAdmin(true);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/secret-hq/access");
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/secret-hq/access");
    };

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/secret-hq/dashboard', icon: LayoutDashboard },
        { name: 'Productos', href: '/secret-hq/products', icon: Package },
        { name: 'Pedidos', href: '/secret-hq/orders', icon: ShoppingBag },
        { name: 'Marketing', href: '/secret-hq/marketing', icon: Megaphone },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0a0a0a] border-r border-white/5 transition-all duration-500 ease-vault-in-out ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo Section */}
                    <div className="h-24 flex items-center px-8 border-b border-white/5">
                        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic -rotate-12 flex-shrink-0">F</div>
                        <span className={`ml-4 font-display text-lg font-black italic tracking-tighter uppercase transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                            Fenix HQ
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-10 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-4 px-4 py-4 rounded-sm group transition-all duration-300 text-[11px] font-black uppercase tracking-widest ${isActive ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-black' : 'group-hover:scale-110 transition-transform'} />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                    {isActive && isSidebarOpen && <ChevronRight className="ml-auto" size={14} />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Nav */}
                    <div className="p-4 space-y-2 border-t border-white/5">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full flex items-center space-x-4 px-4 py-4 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                            {isSidebarOpen && <span>Contraer</span>}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-4 px-4 py-4 text-white/40 hover:text-red-500 transition-all text-[11px] font-black uppercase tracking-widest"
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Salir del Sistema</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-24 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-3xl flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center bg-white/5 border border-white/5 rounded-full px-5 py-2.5 w-full max-w-md focus-within:ring-1 ring-white/20 transition-all">
                        <Search size={16} className="text-white/20" />
                        <input
                            type="text"
                            placeholder="BUSCAR EN EL ARCHIVO..."
                            className="bg-transparent border-none focus:ring-0 text-[11px] font-bold tracking-widest text-white ml-4 w-full placeholder:text-white/10 uppercase"
                        />
                    </div>

                    <div className="flex items-center space-x-8">
                        <button className="relative text-white/40 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-4 border-l border-white/5 pl-8">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest">Admin Central</p>
                                <p className="text-[9px] text-white/20 font-bold uppercase">Online</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 flex items-center justify-center">
                                <Settings size={18} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <section className="flex-1 overflow-y-auto bg-[grid-white/[0.01]] bg-[size:50px_50px]">
                    <div className="p-12 max-w-7xl mx-auto">
                        {children}
                    </div>
                </section>

                {/* Decorative Grid Lines */}
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5 pointer-events-none" />
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />
            </main>
        </div>
    );
}
