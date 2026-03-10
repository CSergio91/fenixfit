import { createClient } from "@/lib/supabase/server";
import OrdersClient from "./OrdersClient";

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
  } catch (err) {
    console.error('Error fetching orders:', err);
  }

  return <OrdersClient initialOrders={orders} />;
}
