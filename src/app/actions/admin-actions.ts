'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// PRODUCTS
export async function upsertProduct(productData: any, variantsData: any[]) {
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .upsert({
            id: productData.id || undefined,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            original_price: productData.original_price,
            stock: productData.stock,
            category: productData.category,
            sizes: productData.sizes || [],
            features: productData.features || [],
            badges: productData.badges || [],
            is_active: productData.is_active ?? true
        })
        .select()
        .single()

    if (error) {
        console.error('Error upserting product:', error)
        throw new Error(error.message)
    }

    // Save variants
    if (variantsData && variantsData.length > 0) {
        // First delete existing variants if this is an update
        if (productData.id) {
            await supabase
                .from('product_variants')
                .delete()
                .eq('product_id', productData.id)
        }

        const variantsToInsert = variantsData.map(v => ({
            product_id: product.id,
            color_name: v.color_name,
            color_hex: v.color_hex,
            main_image: v.main_image,
            hover_image: v.hover_image,
            gallery_images: v.gallery_images || []
        }))

        const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantsToInsert)

        if (variantError) {
            console.error('Error saving variants:', variantError)
            throw new Error(variantError.message)
        }
    }

    revalidatePath('/secret-hq/products')
    revalidatePath('/collections')
    revalidatePath(`/product/${product.id}`)
    return product
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    if (error) {
        console.error('Error deleting product:', error)
        throw new Error(error.message)
    }

    revalidatePath('/secret-hq/products')
    revalidatePath('/collections')
    return { success: true }
}

// ORDERS
export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating order status:', error)
        throw new Error(error.message)
    }

    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

// MARKETING
export async function upsertMarketingAsset(assetData: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('marketing_assets')
        .upsert({
            id: assetData.id || undefined,
            type: assetData.type,
            image_url: assetData.image_url,
            target_url: assetData.target_url,
            title: assetData.title,
            description: assetData.description,
            is_active: assetData.is_active ?? true,
            priority: assetData.priority || 0
        })
        .select()
        .single()

    if (error) {
        console.error('Error upserting marketing asset:', error)
        throw new Error(error.message)
    }

    revalidatePath('/secret-hq/marketing')
    revalidatePath('/')
    return data
}

export async function deleteMarketingAsset(assetId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('marketing_assets')
        .delete()
        .eq('id', assetId)

    if (error) {
        console.error('Error deleting marketing asset:', error)
        throw new Error(error.message)
    }

    revalidatePath('/secret-hq/marketing')
    revalidatePath('/')
    return { success: true }
}

// SETTINGS
export async function upsertSettings(settingsData: any) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('store_settings')
        .upsert({
            id: '00000000-0000-0000-0000-000000000001',
            store_name: settingsData.store_name,
            contact_email: settingsData.contact_email,
            contact_phone: settingsData.contact_phone,
            address: settingsData.address,
            instagram_url: settingsData.instagram_url,
            whatsapp_number: settingsData.whatsapp_number,
            currency: settingsData.currency,
            shipping_fee: settingsData.shipping_fee,
            updated_at: new Date().toISOString()
        })
        .select()
        .single()

    if (error) {
        console.error('Error upserting settings:', error)
        // Throw with full message so client can detect table-missing errors
        throw new Error(error.message)
    }

    revalidatePath('/secret-hq/settings')
    revalidatePath('/')
    return data
}
