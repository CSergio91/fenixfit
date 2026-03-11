import { productService } from "@/services/productService";
import { getCategories } from "@/app/actions/admin-actions";
import CollectionsClient from "./CollectionsClient";

export default async function CollectionsPage() {
    const [products, categories] = await Promise.all([
        productService.getAllProducts(),
        getCategories().catch(() => []),
    ]);
    return <CollectionsClient products={products} categories={categories} />;
}
