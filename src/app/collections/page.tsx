import { productService } from "@/services/productService";
import Image from "next/image";
import Link from "next/link";
import CollectionsClient from "@/components/collections/CollectionsClient";

export default async function CollectionsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const products = await productService.getAllProducts();
    const resolvedSearchParams = await searchParams;
    const activeCategory = resolvedSearchParams.category || "All";

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

    const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))] as string[];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 block mb-4">Shop the Edit</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase italic">All Products</h1>
                    <p className="text-muted-light text-[13px] font-medium tracking-wide">
                        {filteredProducts.length} ESSENTIALS FOUND
                    </p>
                </div>
                <div className="flex items-center space-x-6 mt-8 md:mt-0">
                    <div className="hidden md:flex items-center space-x-3 group cursor-pointer">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">Sort by:</span>
                        <select className="bg-transparent border-none text-[11px] font-black focus:ring-0 uppercase tracking-[0.1em] cursor-pointer outline-none p-0">
                            <option>Recommended</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
                {/* Sidebar Filters */}
                <div className="hidden md:block w-56 flex-shrink-0">
                    <div className="sticky top-36">
                        <div className="mb-12">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Category</h3>
                            <ul className="space-y-5">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <Link
                                            href={`/collections?category=${cat}`}
                                            className={`text-[13px] tracking-wide transition-all uppercase block ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'font-black text-primary translate-x-1' : 'font-medium text-muted-light hover:text-primary hover:translate-x-1'}`}
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Size</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {["XS", "S", "M", "L", "XL"].map(size => (
                                    <button key={size} className="border border-gray-100 py-3 text-[10px] font-bold hover:border-black transition-all uppercase tracking-widest">
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {filteredProducts.map((product) => {
                            const variant = product.variants[0];
                            const isHotSale = product.original_price && product.original_price > product.price;

                            return (
                                <div key={product.id} className="group relative">
                                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 mb-6 shadow-sm">
                                        {variant && (
                                            <Image
                                                src={variant.main_image}
                                                alt={product.name}
                                                fill
                                                className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                            <button className="w-full bg-white text-primary py-4 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-black hover:text-white transition-all">
                                                Quick Add
                                            </button>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-6 left-6 flex flex-col space-y-2">
                                            {product.badges && product.badges.map((badge, idx) => (
                                                <span key={idx} className="bg-primary text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest">{badge}</span>
                                            ))}
                                            {isHotSale && (
                                                <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest">Sale</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Swatches */}
                                    {product.variants.length > 1 && (
                                        <div className="flex space-x-2 mb-4">
                                            {product.variants.slice(0, 4).map(v => (
                                                <div key={v.id} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: v.color_hex }}></div>
                                            ))}
                                            {product.variants.length > 4 && (
                                                <div className="text-[10px] font-bold text-muted-light mt-0.5">+{product.variants.length - 4}</div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-col space-y-1">
                                        <h3 className="text-[14px] font-black tracking-tight leading-tight uppercase italic">
                                            <Link href={`/product/${product.id}`} className="hover:text-primary/60 transition-colors">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="flex justify-between items-center pt-1">
                                            <p className="text-[12px] text-muted-light font-medium tracking-wide">
                                                {product.variants.length} {product.variants.length === 1 ? 'Color' : 'Colors'}
                                            </p>
                                            <div className="text-right">
                                                {isHotSale ? (
                                                    <div className="flex items-center space-x-3">
                                                        <p className="text-[14px] font-black font-display text-red-600">${product.price}</p>
                                                        <p className="text-[12px] text-muted-light font-medium line-through">${product.original_price}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-[14px] font-black font-display text-primary">${product.price}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl">
                            <h3 className="text-2xl font-black mb-3 italic uppercase">Sin resultados</h3>
                            <p className="text-muted-light text-sm max-w-xs mx-auto mb-10">No encontramos productos en esta categoría. Intenta con otra selección.</p>
                            <Link
                                href="/collections"
                                className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-5 hover:bg-gray-800 transition-all shadow-lg inline-block"
                            >
                                Ver Todo
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
