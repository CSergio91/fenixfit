import { createClient } from "@/lib/supabase/server";
import CustomersClient from "./CustomersClient";
import { getCustomers } from "@/app/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
    const supabase = await createClient();

    // Fetch customers using the action
    const customers = await getCustomers();

    // Fetch marketing assets to allow sending promos
    const { data: marketingAssets } = await supabase
        .from('marketing_assets')
        .select('*')
        .eq('is_active', true);

    // Settings for currency
    const { data: settings } = await supabase.from('store_settings').select('currency').single();
    const currency = settings?.currency || 'USD';

    return <CustomersClient initialCustomers={customers} initialMarketing={marketingAssets || []} currency={currency} />;
}
