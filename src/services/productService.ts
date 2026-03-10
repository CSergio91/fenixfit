import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

export type DbProduct = Database['public']['Tables']['products']['Row'] & {
    variants: Database['public']['Tables']['product_variants']['Row'][];
};

export const productService = {
    async getAllProducts() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        variants:product_variants(*)
      `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as DbProduct[];
    },

    async getProductById(id: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        variants:product_variants(*)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as DbProduct;
    },

    async getMarketingAssets(type?: string) {
        const supabase = await createClient();
        let query = supabase
            .from('marketing_assets')
            .select('*')
            .eq('is_active', true)
            .order('priority', { ascending: false });

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }
};
