import { createClient } from "@/lib/supabase/server";
import {
    TrendingUp,
    Users,
    CreditCard,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Eye,
    CheckCircle2,
    AlertCircle,
    ShoppingBag
} from "lucide-react";
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    // ── Time Windows ────────────────────────────────────────────────
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0)).toISOString();

    // Monthly comparison
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString();

    // ── Data Fetching ───────────────────────────────────────────────

    // 1. Products & Stock
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: outOfStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 0);
    const { data: lowStockProducts } = await supabase.from('products').select('*').lt('stock', 10).order('stock', { ascending: true }).limit(5);

    // 2. Orders & Sales
    const { data: recentOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5);

    // Current month orders
    const { data: currentMonthOrders } = await supabase.from('orders')
        .select('total_amount')
        .gte('created_at', startOfCurrentMonth);

    // Last month orders
    const { data: lastMonthOrders } = await supabase.from('orders')
        .select('total_amount')
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth);

    // Orders today
    const { count: ordersToday } = await supabase.from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfToday);

    // 3. Customers
    const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true });

    const { count: currentMonthCustomers } = await supabase.from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfCurrentMonth);

    const { count: lastMonthCustomers } = await supabase.from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth)
        .lte('created_at', endOfLastMonth);

    // 4. Currency Settings
    const { data: settings } = await supabase.from('store_settings').select('currency').single();
    const currencySymbol = settings?.currency === 'EUR' ? '€' : '$';

    // ── Calculations ────────────────────────────────────────────────

    // Sales Logic
    const currentSales = currentMonthOrders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
    const lastSales = lastMonthOrders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;
    const salesGrowth = lastSales > 0 ? ((currentSales - lastSales) / lastSales) * 100 : 0;

    // Customer Logic
    const customerGrowthPercentage = lastMonthCustomers && lastMonthCustomers > 0
        ? ((currentMonthCustomers! - lastMonthCustomers) / lastMonthCustomers) * 100
        : (currentMonthCustomers || 0) > 0 ? 100 : 0;

    const stats = [
        {
            name: 'Ventas del Mes',
            value: `${currencySymbol}${currentSales.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
            change: `${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(1)}%`,
            trend: salesGrowth >= 0 ? 'up' : 'down',
            icon: CreditCard,
            color: 'text-emerald-400',
            href: '/secret-hq/orders'
        },
        {
            name: 'Pedidos Hoy',
            value: ordersToday || 0,
            change: `+${ordersToday || 0} hoy`,
            trend: 'up',
            icon: ShoppingBag,
            color: 'text-blue-400',
            href: '/secret-hq/orders'
        },
        {
            name: 'Clientes Totales',
            value: totalCustomers || 0,
            change: `${customerGrowthPercentage >= 0 ? '+' : ''}${customerGrowthPercentage.toFixed(1)}%`,
            trend: customerGrowthPercentage >= 0 ? 'up' : 'down',
            icon: Users,
            color: 'text-purple-400',
            href: '/secret-hq/customers'
        },
        {
            name: 'Productos Activos',
            value: productsCount || 0,
            change: outOfStockCount ? `${outOfStockCount} agotados` : 'Stock al día',
            trend: outOfStockCount && outOfStockCount > 0 ? 'down' : 'up',
            icon: Package,
            color: 'text-amber-400',
            href: '/secret-hq/products'
        },
    ];

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Central Command Operations</span>
                    <h1 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        Visión General
                    </h1>
                </div>
                <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-4 rounded-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sincronización en Tiempo Real Activa</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="group bg-[#0a0a0a] border border-white/5 p-10 hover:border-white/20 transition-all duration-500 relative overflow-hidden h-64 flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all" />
                        <div className={`w-14 h-14 bg-white/5 flex items-center justify-center rounded-sm ${stat.color} mb-8`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-3">{stat.name}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-4xl font-black font-display italic tracking-tight">{stat.value}</h3>
                                <span className={`text-[11px] font-black italic px-2 py-1 flex items-center ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-500 bg-rose-500/10'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-12">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] flex items-center">
                            <Clock size={16} className="mr-4 text-white/40" /> Últimos Pedidos
                        </h3>
                        <Link href="/secret-hq/orders" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all underline underline-offset-8">
                            Ver Archivo Completo
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-white/20 text-[9px] uppercase tracking-widest border-b border-white/5">
                                    <th className="pb-6 font-black">Identificador</th>
                                    <th className="pb-6 font-black">Cliente</th>
                                    <th className="pb-6 font-black">Estado</th>
                                    <th className="pb-6 font-black text-right">Inversión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentOrders?.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="group hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-6 font-black font-display text-[13px] tracking-tight text-white/60 hover:text-white transition-colors">
                                            <Link href="/secret-hq/orders" className="block w-full h-full">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="py-6">
                                            <Link href="/secret-hq/orders" className="block group/link">
                                                <p className="text-[11px] font-bold uppercase tracking-widest group-hover/link:text-white transition-colors">{order.customer_name || 'Guest'}</p>
                                                <p className="text-[9px] text-white/20 font-medium tracking-tight uppercase group-hover/link:text-white/40 transition-colors">{order.customer_email}</p>
                                            </Link>
                                        </td>
                                        <td className="py-6">
                                            <span className={`text-[9px] font-black px-3 py-1.5 uppercase tracking-widest flex items-center w-fit ${['paid', 'confirmed', 'shipped'].includes(order.status) ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                                                }`}>
                                                {['paid', 'confirmed', 'shipped'].includes(order.status) ? <CheckCircle2 size={12} className="mr-2" /> : <Clock size={12} className="mr-2" />}
                                                {order.status === 'paid' ? 'Pagado' : order.status === 'confirmed' ? 'Confirmado' : order.status === 'shipped' ? 'Enviado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-6 text-right font-black font-display text-[14px] italic">${Number(order.total_amount).toFixed(0)}</td>
                                    </tr>
                                ))}
                                {(!recentOrders || recentOrders.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-white/10 text-[10px] uppercase font-black tracking-widest">No hay registros de pedidos recientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Alerts Widget */}
                <div className="bg-[#0a0a0a] border border-white/5 p-12">
                    <div className="mb-10 pb-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] flex items-center">
                            <AlertCircle size={16} className="mr-4 text-rose-500" /> Alertas Críticas
                        </h3>
                        <Link href="/secret-hq/products" className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">Ver Inventario</Link>
                    </div>
                    <div className="space-y-6">
                        {lowStockProducts?.map((product) => (
                            <Link
                                key={product.id}
                                href="/secret-hq/products"
                                className="block p-6 bg-white/5 border border-white/5 hover:border-rose-500/20 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-rose-500 transition-colors">{product.name}</p>
                                    <span className={`text-[11px] font-black px-2 py-0.5 ${product.stock <= 0 ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {product.stock} UNI
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-rose-500 h-full transition-all duration-1000"
                                        style={{ width: `${Math.max(5, (product.stock / 10) * 100)}%` }}
                                    ></div>
                                </div>
                            </Link>
                        ))}
                        {(!lowStockProducts || lowStockProducts.length === 0) && (
                            <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                                <CheckCircle2 size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Todo el stock bajo control</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
