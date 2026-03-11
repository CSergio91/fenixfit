'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
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

    if (error) throw new Error(error.message)

    if (variantsData && variantsData.length > 0) {
        if (productData.id) {
            await supabase.from('product_variants').delete().eq('product_id', productData.id)
        }
        const variantsToInsert = variantsData.map(v => ({
            product_id: product.id,
            color_name: v.color_name,
            color_hex: v.color_hex,
            main_image: v.main_image,
            hover_image: v.hover_image,
            gallery_images: v.gallery_images || []
        }))
        const { error: variantError } = await supabase.from('product_variants').insert(variantsToInsert)
        if (variantError) throw new Error(variantError.message)
    }

    revalidatePath('/secret-hq/products')
    revalidatePath('/collections')
    revalidatePath(`/product/${product.id}`)
    return product
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/products')
    revalidatePath('/collections')
    return { success: true }
}

// Adjust stock by +/- delta
export async function adjustStock(productId: string, delta: number) {
    const supabase = await createClient()
    const { data: product, error: fetchErr } = await supabase
        .from('products').select('stock').eq('id', productId).single()
    if (fetchErr) throw new Error(fetchErr.message)

    const newStock = Math.max(0, (product.stock || 0) + delta)
    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', productId)
    if (error) throw new Error(error.message)

    revalidatePath('/secret-hq/products')
    revalidatePath('/secret-hq/dashboard')
    return { stock: newStock }
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

export async function deleteOrder(orderId: string) {
    const supabase = await createClient()
    await supabase.from('order_items').delete().eq('order_id', orderId)
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

// Confirm WhatsApp order: set to 'confirmed' and deduct stock
export async function confirmWhatsappOrder(orderId: string) {
    const supabase = await createClient()
    const { data: items, error: itemsErr } = await supabase
        .from('order_items')
        .select('*, products(stock)')
        .eq('order_id', orderId)
    if (itemsErr) throw new Error(itemsErr.message)

    for (const item of items || []) {
        const currentStock = item.products?.stock || 0
        const newStock = Math.max(0, currentStock - (item.quantity || 1))
        await supabase.from('products').update({ stock: newStock }).eq('id', item.product_id)
    }

    const { error } = await supabase.from('orders').update({ status: 'confirmed' }).eq('id', orderId)
    if (error) throw new Error(error.message)

    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/products')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

// Create a pending WhatsApp order
export async function createWhatsappOrder(orderData: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    items: Array<{ product_id: string; variant_id?: string; size: string; quantity: number; price: number; product_name?: string }>
    total_amount: number
}) {
    const supabase = await createAdminClient()
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
            customer_email: orderData.customer_email,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone || null,
            total_amount: orderData.total_amount,
            status: 'pending_whatsapp',
            checkout_method: 'whatsapp',
            shipping_address: {}
        })
        .select()
        .single()
    if (orderErr) throw new Error(orderErr.message)

    await supabase.from('order_items').insert(
        orderData.items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            size: item.size,
            quantity: item.quantity,
            price_at_time: item.price,
        }))
    )

    revalidatePath('/secret-hq/orders')
    return order
}

// ─── MARKETING ────────────────────────────────────────────────────────────────
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
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/marketing')
    revalidatePath('/')
    return data
}

export async function deleteMarketingAsset(assetId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('marketing_assets').delete().eq('id', assetId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/marketing')
    revalidatePath('/')
    return { success: true }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
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
            checkout_type: settingsData.checkout_type || 'stripe',
            updated_at: new Date().toISOString()
        })
        .select()
        .single()
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/settings')
    revalidatePath('/')
    return data
}

export async function getPublicSettings() {
    try {
        const supabase = await createAdminClient()
        const { data } = await supabase
            .from('store_settings')
            .select('checkout_type, whatsapp_number, currency, store_name')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single()
        return data
    } catch {
        return null
    }
}
