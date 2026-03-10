import { notFound } from "next/navigation";
import { productService } from "@/services/productService";
import ProductClient from "@/components/product/ProductClient";

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
