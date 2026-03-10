import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
    let products: any[] = []

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
    } catch (err) {
        console.error('Error fetching products:', err);
    }

    return <ProductsClient initialProducts={products} />;
}
