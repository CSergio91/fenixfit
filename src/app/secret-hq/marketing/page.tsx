import { createClient } from "@/lib/supabase/server";
import MarketingClient from "./MarketingClient";

export default async function AdminMarketingPage() {
    const supabase = await createClient();
    const { data: assets } = await supabase
        .from('marketing_assets')
        .select('*')
        .order('priority', { ascending: true });

    return <MarketingClient initialAssets={assets || []} />;
}
