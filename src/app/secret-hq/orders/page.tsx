import { createClient } from "@/lib/supabase/server";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = []

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
                *,
                order_items (
                    *,
                    products (*),
                    product_variants (*)
                )
            `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      orders = data;
    }

    const { data: settings } = await supabase.from('store_settings').select('currency, contact_email').single();
    const currency = settings?.currency || 'USD';

    // Role fetch
    const { data: { user } } = await supabase.auth.getUser();
    let role = null;
    if (user) {
      const { data: staff } = await supabase.from('staff').select('role').eq('email', user.email).maybeSingle();
      role = staff?.role || (user.email === settings?.contact_email ? 'owner' : 'moderator');
    }

    return <OrdersClient initialOrders={orders} currency={currency} role={role} />;
  } catch (err) {
    console.error('Error fetching orders:', err);
    return <OrdersClient initialOrders={[]} currency="USD" role={null} />;
  }
}
