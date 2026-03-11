import { createClient } from "@/lib/supabase/server";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
    const supabase = await createClient();

    // Fetch assets, products for selector, and current settings
    const [assetsRes, productsRes, settingsRes] = await Promise.all([
        supabase.from('marketing_assets').select('*').order('priority', { ascending: true }),
        supabase.from('products').select('id, name, price').eq('is_active', true),
        supabase.from('store_settings').select('*').eq('id', '00000000-0000-0000-0000-000000000001').maybeSingle()
    ]);

    return (
        <MarketingClient
            initialAssets={assetsRes.data || []}
            products={productsRes.data || []}
            initialSettings={settingsRes.data || { announcement_text: 'Free worldwide shipping on orders over $150' }}
        />
    );
}
