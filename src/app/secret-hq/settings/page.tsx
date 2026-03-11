import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    let settings = null;
    let staff: any[] = [];
    let currentRole: string | null = null;

    try {
        const supabase = await createClient();

        // Settings
        const { data: sData } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single();

        if (sData) settings = sData;

        // Staff
        const { data: stData } = await supabase.from('staff').select('*').order('role', { ascending: false });
        if (stData) staff = stData;

        // Role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            currentRole = staff.find(s => s.email === user.email)?.role || null;
            if (!currentRole && settings?.contact_email === user.email) currentRole = 'owner';
        }

    } catch (e) {
        console.warn('Settings or Staff table potentially missing', e);
    }

    return <SettingsClient initialSettings={settings} staffMembers={staff} currentRole={currentRole} />;
}
