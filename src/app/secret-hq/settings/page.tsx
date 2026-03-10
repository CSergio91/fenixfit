import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    // Attempt to fetch settings, but handle error if table doesn't exist yet
    let settings = null;
    try {
        const { data } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single();
        settings = data;
    } catch (e) {
        console.warn('Settings table potentially missing', e);
    }

    return <SettingsClient initialSettings={settings} />;
}
