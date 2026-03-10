export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    original_price: number | null
                    stock: number
                    category: string | null
                    sizes: string[]
                    features: string[]
                    badges: string[]
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    original_price?: number | null
                    stock?: number
                    category?: string | null
                    sizes?: string[]
                    features?: string[]
                    badges?: string[]
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    original_price?: number | null
                    stock?: number
                    category?: string | null
                    sizes?: string[]
                    features?: string[]
                    badges?: string[]
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    color_name: string
                    color_hex: string
                    main_image: string
                    hover_image: string | null
                    gallery_images: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    color_name: string
                    color_hex: string
                    main_image: string
                    hover_image?: string | null
                    gallery_images?: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    color_name?: string
                    color_hex?: string
                    main_image?: string
                    hover_image?: string | null
                    gallery_images?: string[]
                    created_at?: string
                }
            }
            marketing_assets: {
                Row: {
                    id: string
                    type: string
                    image_url: string
                    target_url: string | null
                    title: string | null
                    description: string | null
                    is_active: boolean
                    priority: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    type: string
                    image_url: string
                    target_url?: string | null
                    title?: string | null
                    description?: string | null
                    is_active?: boolean
                    priority?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    type?: string
                    image_url?: string
                    target_url?: string | null
                    title?: string | null
                    description?: string | null
                    is_active?: boolean
                    priority?: number
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    stripe_session_id: string | null
                    customer_email: string
                    customer_name: string | null
                    total_amount: number
                    status: string
                    shipping_address: Json | null
                    utm_source: string | null
                    utm_medium: string | null
                    utm_campaign: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    stripe_session_id?: string | null
                    customer_email: string
                    customer_name?: string | null
                    total_amount: number
                    status?: string
                    shipping_address?: Json | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    stripe_session_id?: string | null
                    customer_email?: string
                    customer_name?: string | null
                    total_amount?: number
                    status?: string
                    shipping_address?: Json | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    created_at?: string
                }
            }
        }
    }
}
