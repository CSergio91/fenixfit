import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/data/products';

export interface CartItem {
    id: string; // Unique ID for the cart item (product.id + variant.id + size)
    product: Product;
    variant: ProductVariant;
    size: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, variant: ProductVariant, size: string) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    setIsOpen: (isOpen: boolean) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, variant, size) => {
                const id = `${product.id}-${variant.id}-${size}`;
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                            ),
                            isOpen: true, // Open cart when adding
                        };
                    }
                    return { items: [...state.items, { id, product, variant, size, quantity: 1 }], isOpen: true };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }));
            },

            setIsOpen: (isOpen) => set({ isOpen }),

            clearCart: () => set({ items: [] }),

            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            },

            getCartCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'fenix-fit-cart-v1',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
