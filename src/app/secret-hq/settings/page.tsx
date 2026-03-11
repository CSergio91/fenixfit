import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
    let settings = null;

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single();

        if (!error && data) {
            settings = data;
        }
    } catch (e) {
        console.warn('Settings table potentially missing', e);
    }

    return <SettingsClient initialSettings={settings} />;
}
