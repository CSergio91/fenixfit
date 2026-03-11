import { getCategories } from "@/app/actions/admin-actions";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    let categories: any[] = [];
    try {
        categories = await getCategories();
    } catch {
        categories = [];
    }
    return <CategoriesClient initialCategories={categories} />;
}
