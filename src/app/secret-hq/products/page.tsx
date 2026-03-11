import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/app/actions/admin-actions";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    let products: any[] = []
    let categories: any[] = []

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                product_variants (*)
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            products = data;
        }

        categories = await getCategories();

        const { data: settings } = await supabase.from('store_settings').select('currency, contact_email').single();
        const currency = settings?.currency || 'USD';

        // Role fetch
        const { data: { user } } = await supabase.auth.getUser();
        let role = null;
        if (user) {
            const { data: staff } = await supabase.from('staff').select('role').eq('email', user.email).maybeSingle();
            role = staff?.role || (user.email === settings?.contact_email ? 'owner' : 'moderator');
        }

        return <ProductsClient initialProducts={products} categories={categories} currency={currency} role={role} />;
    } catch (err) {
        console.error('Error fetching products/categories:', err);
        return <ProductsClient initialProducts={[]} categories={[]} currency="USD" role={null} />;
    }
}
