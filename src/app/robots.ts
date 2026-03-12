import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/secret-hq/', '/api/', '/checkout/'],
        },
        sitemap: 'https://fenixfit.es/sitemap.xml',
    }
}
