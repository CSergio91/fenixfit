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
    Users,
} from "lucide-react";
import { globalSearch, getCurrentUserRole } from "@/app/actions/admin-actions";

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
    const [role, setRole] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ products: any[], orders: any[] }>({ products: [], orders: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

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

                // Fetch role using Server Action to avoid RLS recursion
                const userRole = await getCurrentUserRole();
                setRole(userRole || 'moderator');
            }
            setIsAdmin(!!session);
        };
        checkUser();

        // Real-time notifications using the dedicated table
        const channel = supabase
            .channel('notifications-realtime')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications'
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                // Play striking "Cash Register" sound
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3');
                    audio.volume = 0.7;
                    audio.play();
                } catch (e) {
                    console.log('Audio error:', e);
                }
            })
            .subscribe();

        // Initial fetch of unread notifications
        const fetchUnread = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('is_read', false)
                .order('created_at', { ascending: false })
                .limit(20);
            if (data) setNotifications(data);
        };
        fetchUnread();

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

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, [supabase, router, isAccessPage]);

    // Close user menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                const results = await globalSearch(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
                setShowSearchResults(true);
            } else {
                setSearchResults({ products: [], orders: [] });
                setShowSearchResults(false);
            }
        };

        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    // Access control for moderators
    useEffect(() => {
        if (role === 'moderator' && pathname) {
            const forbiddenPaths = ['/secret-hq/settings', '/secret-hq/categories', '/secret-hq/marketing'];
            if (forbiddenPaths.some(p => pathname.startsWith(p))) {
                router.replace('/secret-hq/dashboard');
            }
        }
    }, [role, pathname, router]);

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

    const allNavItems = [
        { name: 'Dashboard', href: '/secret-hq/dashboard', icon: LayoutDashboard },
        { name: 'Productos', href: '/secret-hq/products', icon: Package },
        { name: 'Categorías', href: '/secret-hq/categories', icon: Tag },
        { name: 'Pedidos', href: '/secret-hq/orders', icon: ShoppingBag },
        { name: 'Clientes', href: '/secret-hq/customers', icon: Users },
        { name: 'Marketing', href: '/secret-hq/marketing', icon: Megaphone },
        { name: 'Configuración', href: '/secret-hq/settings', icon: Settings },
    ];

    const navItems = allNavItems.filter(item => {
        if (role === 'moderator') {
            // Moderators can only see Dashboard, Products, Orders and Customers
            return ['Dashboard', 'Productos', 'Pedidos', 'Clientes'].includes(item.name);
        }
        return true;
    });

    // Display name: prefer full_name, else email username
    const displayName = user?.full_name || user?.email?.split("@")[0] || "Admin";
    const displayEmail = user?.email || "";
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
            {/* ── Sidebar ── */}
            <aside
                className={`hidden lg:flex fixed lg:static inset-y-0 left-0 z-50 bg-[#090909] border-r border-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex-shrink-0 ${isSidebarOpen ? 'w-[260px]' : 'w-[72px]'}`}
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
                                    className={`group flex items-center px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${isActive
                                        ? "text-white bg-white/[0.08]"
                                        : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                                        }`}
                                >
                                    <Icon
                                        size={22}
                                        className={`mr-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                                            }`}
                                    />
                                    <span className={isSidebarOpen ? "opacity-100" : "opacity-0 invisible"}>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
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
                    <div className="relative group flex-1 max-w-sm" ref={searchRef}>
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.06] px-4 py-2.5 w-full focus-within:border-white/20 transition-all">
                            <Search size={14} className="text-white/20 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                placeholder="Buscar en el sistema..."
                                className="bg-transparent border-none focus:ring-0 text-[11px] font-bold tracking-widest text-white ml-3 w-full placeholder:text-white/10 uppercase outline-none"
                            />
                            {isSearching && <Loader2 size={12} className="animate-spin text-white/20" />}
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-[#0d0d0d] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-[70vh] overflow-y-auto">
                                    {searchResults.products.length === 0 && searchResults.orders.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">No se encontraron resultados</p>
                                        </div>
                                    ) : (
                                        <>
                                            {searchResults.products.length > 0 && (
                                                <div className="p-2 border-b border-white/5">
                                                    <p className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Productos</p>
                                                    {searchResults.products.map(p => (
                                                        <Link
                                                            key={p.id}
                                                            href="/secret-hq/products"
                                                            onClick={() => setShowSearchResults(false)}
                                                            className="flex items-center justify-between px-3 py-3 hover:bg-white/[0.03] transition-all group"
                                                        >
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-white/60 group-hover:text-white">{p.name}</span>
                                                            <span className="text-[9px] font-black text-emerald-400">{p.price}€</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {searchResults.orders.length > 0 && (
                                                <div className="p-2">
                                                    <p className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Pedidos</p>
                                                    {searchResults.orders.map(o => (
                                                        <Link
                                                            key={o.id}
                                                            href="/secret-hq/orders"
                                                            onClick={() => setShowSearchResults(false)}
                                                            className="flex flex-col px-3 py-3 hover:bg-white/[0.03] transition-all group"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 group-hover:text-white">{o.customer_name}</span>
                                                                <span className="text-[9px] font-black text-white/40">{o.total_amount}€</span>
                                                            </div>
                                                            <span className="text-[8px] text-white/20 mt-1">{o.customer_email}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Bell */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative transition-colors p-2 ${notifications.length > 0 ? 'text-white' : 'text-white/30 hover:text-white'}`}
                            >
                                <Bell size={18} className={notifications.length > 0 ? 'animate-bounce' : ''} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d0d0d] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Notificaciones</p>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={async () => {
                                                    await supabase.from('notifications').update({ is_read: true }).in('id', notifications.map(n => n.id));
                                                    setNotifications([]);
                                                }}
                                                className="text-[8px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300"
                                            >
                                                Marcar todo como leído
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">No hay notificaciones</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <Link
                                                    key={notif.id}
                                                    href={notif.type === 'new_order' ? "/secret-hq/orders" : "#"}
                                                    onClick={() => setShowNotifications(false)}
                                                    className="flex flex-col px-5 py-4 hover:bg-white/[0.03] transition-all border-b border-white/5 group"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">{notif.title}</span>
                                                        <span className="text-[8px] text-white/20 uppercase tracking-widest">{new Date(notif.created_at).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest mt-1 text-white/80 group-hover:text-white line-clamp-2 leading-relaxed">{notif.message}</p>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <Link
                                            href="/secret-hq/orders"
                                            onClick={() => setShowNotifications(false)}
                                            className="block py-3 text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/[0.02] border-t border-white/5"
                                        >
                                            Ver todos los pedidos
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

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
                <section className="flex-1 overflow-y-auto pb-24 lg:pb-0">
                    <div className="p-4 sm:p-10 max-w-7xl mx-auto">
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

            {/* ── Mobile Bottom Nav ── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#090909]/95 backdrop-blur-md border-t border-white/[0.06] z-50 pb-safe pb-4 pt-2 overflow-x-auto no-scrollbar">
                <div className="flex justify-start sm:justify-around items-center min-w-max px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center p-2 min-w-[75px] transition-all duration-200 ${isActive ? 'text-white' : 'text-white/30 hover:text-white/70'}`}
                            >
                                <Icon size={20} className={`mb-1 transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
                                <span className="text-[8px] font-black uppercase tracking-wider">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
