import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/services/productService";
import ProductClient from "@/components/product/ProductClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fenixfit.es";

// Generate per-product Open Graph metadata
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    try {
        const product = await productService.getProductById(id);
        if (!product) return {};

        // Use the first variant image as the OG image
        const firstVariant = product.variants?.[0] as any;
        const ogImage =
            firstVariant?.main_image ||
            firstVariant?.mainImage ||
            `${SITE_URL}/logo.jpg`;

        const price = product.price ? `${product.price.toFixed(2)} €` : "";
        const description = product.description
            ? product.description.slice(0, 155)
            : `Descubre ${product.name} en Fenix Fit. Ropa deportiva premium de alta calidad.`;

        return {
            title: `${product.name} | Fenix Fit`,
            description,
            openGraph: {
                title: `${product.name}${price ? ` — ${price}` : ""} | Fenix Fit`,
                description,
                url: `${SITE_URL}/product/${id}`,
                siteName: "Fenix Fit",
                type: "website",
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 1200,
                        alt: product.name,
                    },
                ],
                locale: "es_ES",
            },
            twitter: {
                card: "summary_large_image",
                title: `${product.name} | Fenix Fit`,
                description,
                images: [ogImage],
            },
            alternates: {
                canonical: `${SITE_URL}/product/${id}`,
            },
        };
    } catch {
        return {
            title: "Producto | Fenix Fit",
        };
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const product = await productService.getProductById(id);
        if (!product) {
            notFound();
        }

        return <ProductClient product={product} />;
    } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
    }
}
