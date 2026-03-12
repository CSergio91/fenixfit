import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // revalidate every hour
// Not forcing dynamic to allow Next.js to determine static/dynamic optimization safely during build.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()

    // Base URLs
    const baseUrl = 'https://fenixfit.es'

    const routes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/collections`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/envios`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/devoluciones`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacidad`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        }
    ]

    // Add Dynamic Products
    try {
        const { data: products } = await supabase
            .from('products')
            .select('id, updated_at')
            .eq('is_active', true)

        if (products) {
            const productRoutes = products.map((product) => ({
                url: `${baseUrl}/product/${product.id}`,
                lastModified: new Date(product.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            }))

            routes.push(...productRoutes)
        }
    } catch (error) {
        console.error('Sitemap generation error:', error)
    }

    return routes
}
