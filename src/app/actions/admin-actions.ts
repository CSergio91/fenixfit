'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
    sendOrderConfirmationEmail,
    sendPromotionalEmail as resendPromo,
    sendOrderStatusUpdateEmail,
    sendNewOrderAdminNotification
} from '@/lib/resend'

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
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()

    // Fetch order details before update to send email
    const { data: order } = await supabase
        .from('orders')
        .select('customer_email, customer_name, id')
        .eq('id', orderId)
        .single()

    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) throw new Error(error.message)

    // Notify customer
    if (order?.customer_email) {
        try {
            await sendOrderStatusUpdateEmail({
                email: order.customer_email,
                orderNumber: (order.id as string).slice(0, 8).toUpperCase(),
                customerName: order.customer_name,
                newStatus: status
            })
        } catch (e) {
            console.error('Error sending status update email:', e)
        }
    }

    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

export async function deleteOrder(orderId: string) {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()
    await supabase.from('order_items').delete().eq('order_id', orderId)
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/dashboard')
    return { success: true }
}

// Confirm WhatsApp order: set to 'confirmed' and deduct stock
export async function confirmWhatsappOrder(orderId: string) {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()

    // Fetch order and items
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, price, stock))')
        .eq('id', orderId)
        .single()

    if (orderErr) throw new Error(orderErr.message)

    // Deduct stock
    for (const item of order.order_items || []) {
        const currentStock = item.products?.stock || 0
        const newStock = Math.max(0, currentStock - (item.quantity || 1))
        await supabase.from('products').update({ stock: newStock }).eq('id', item.product_id)
    }

    const { error } = await supabase.from('orders').update({ status: 'confirmed' }).eq('id', orderId)
    if (error) throw new Error(error.message)

    // Send Confirmation Email to Customer
    try {
        await sendOrderConfirmationEmail({
            email: order.customer_email,
            orderNumber: (order.id as string).slice(0, 8).toUpperCase(),
            customerName: order.customer_name,
            totalAmount: order.total_amount,
            items: order.order_items.map((item: any) => ({
                name: item.products?.name || 'Producto',
                size: item.size,
                quantity: item.quantity,
                price: item.price_at_time
            }))
        })
    } catch (e) {
        console.error('Error sending confirmation email:', e)
    }

    // Automatically save as customer if confirmed
    try {
        await saveAsCustomer(orderId)
    } catch (e) {
        console.error('Error saving as customer during confirmation:', e)
    }

    // NEW: Real-time notification for CONFIRMED order
    try {
        await supabase.from('notifications').insert({
            title: 'PEDIDO CONFIRMADO',
            message: `Pedido #${(order.id as string).slice(0, 8).toUpperCase()} - ${order.customer_name} confirmado.`,
            type: 'order'
        })
    } catch (notifErr) {
        console.error('Real-time Notification Error:', notifErr)
    }

    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/products')
    revalidatePath('/secret-hq/dashboard')
    revalidatePath('/secret-hq/customers')
    return { success: true }
}

// Create a pending WhatsApp order
export async function createWhatsappOrder(orderData: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    accepts_marketing?: boolean
    shipping_address?: {
        street?: string
        city?: string
        postal_code?: string
        country?: string
    }
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
            accepts_marketing: orderData.accepts_marketing || false,
            shipping_address: orderData.shipping_address || {}
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

    // Notify Admin about NEW order
    try {
        const { data: settings } = await supabase.from('store_settings').select('contact_email').single()
        if (settings?.contact_email) {
            await sendNewOrderAdminNotification({
                adminEmail: settings.contact_email,
                orderNumber: order.id.slice(0, 8).toUpperCase(),
                customerName: order.customer_name,
                totalAmount: order.total_amount
            })
        }
    } catch (e) {
        console.error('Error sending admin notification:', e)
    }

    // NEW: Real-time notification for NEW WHATSAPP order
    try {
        await supabase.from('notifications').insert({
            title: 'NUEVO WHATSAPP',
            message: `Pedido #${order.id.slice(0, 8).toUpperCase()} - ${order.customer_name} - ${order.total_amount}€`,
            type: 'order'
        })
    } catch (notifErr) {
        console.error('Real-time Notification Error:', notifErr)
    }

    revalidatePath('/secret-hq/orders')
    return order
}

// ─── MARKETING ────────────────────────────────────────────────────────────────
export async function upsertMarketingAsset(assetData: any) {
    const supabase = await createClient()
    const { data: asset, error } = await supabase
        .from('marketing_assets')
        .upsert({
            id: assetData.id || undefined,
            type: assetData.type,
            image_url: assetData.image_url,
            target_url: assetData.target_url,
            title: assetData.title,
            description: assetData.description,
            is_active: assetData.is_active ?? true,
            priority: assetData.priority || 0,
            product_id: assetData.product_id || null,
            sale_price: assetData.sale_price || null
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    // If there's a product linked and a sale price, update the product table
    if (assetData.product_id && assetData.sale_price && assetData.is_active) {
        const { data: product } = await supabase
            .from('products')
            .select('price')
            .eq('id', assetData.product_id)
            .single()

        if (product && product.price !== assetData.sale_price) {
            await supabase
                .from('products')
                .update({
                    original_price: product.price, // move current price to original
                    price: assetData.sale_price // set new sale price
                })
                .eq('id', assetData.product_id)
        }
    }

    revalidatePath('/secret-hq/marketing')
    revalidatePath('/secret-hq/products')
    revalidatePath('/')
    return asset
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
            announcement_text: settingsData.announcement_text,
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
        const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000001')
            .single()
        if (error) {
            console.error('getPublicSettings Error:', error.message)
            return null
        }
        return data
    } catch (err: any) {
        console.error('getPublicSettings Catch Error:', err.message)
        return null
    }
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return data || []
}

export async function upsertCategory(categoryData: {
    id?: string
    name: string
    slug: string
    description?: string
    sizes: string[]
    colors: { name: string; hex: string }[]
    is_active: boolean
    sort_order?: number
}) {
    const supabase = await createClient()
    const payload: any = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || null,
        sizes: categoryData.sizes,
        colors: categoryData.colors,
        is_active: categoryData.is_active,
        sort_order: categoryData.sort_order ?? 0,
        updated_at: new Date().toISOString(),
    }
    if (categoryData.id) payload.id = categoryData.id

    const { data, error } = await supabase
        .from('categories')
        .upsert(payload)
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/categories')
    revalidatePath('/collections')
    return data
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/categories')
    revalidatePath('/collections')
}

export async function saveAsCustomer(orderId: string) {
    const supabase = await createAdminClient()

    // 1. Get order details
    const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

    if (orderErr || !order) throw new Error('Order not found')

    // 2. Check if customer exists
    const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', order.customer_email)
        .maybeSingle()

    if (existingCustomer) {
        // Update existing customer
        const { error: updateErr } = await supabase
            .from('customers')
            .update({
                name: order.customer_name || existingCustomer.name,
                phone: order.customer_phone || existingCustomer.phone,
                total_spent: Number(existingCustomer.total_spent || 0) + Number(order.total_amount),
                orders_count: (existingCustomer.orders_count || 0) + 1,
                last_order_at: new Date().toISOString(),
                accepts_marketing: order.accepts_marketing || existingCustomer.accepts_marketing,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingCustomer.id)

        if (updateErr) throw updateErr

        // Link order to customer
        await supabase.from('orders').update({ customer_id: existingCustomer.id }).eq('id', orderId)

    } else {
        // Create new customer
        const { data: newCustomer, error: createErr } = await supabase
            .from('customers')
            .insert({
                email: order.customer_email,
                name: order.customer_name,
                phone: order.customer_phone,
                total_spent: order.total_amount,
                orders_count: 1,
                last_order_at: new Date().toISOString(),
                accepts_marketing: order.accepts_marketing
            })
            .select()
            .single()

        if (createErr) throw createErr

        // Link order to customer
        await supabase.from('orders').update({ customer_id: newCustomer.id }).eq('id', orderId)
    }

    revalidatePath('/secret-hq/dashboard')
    revalidatePath('/secret-hq/orders')
    revalidatePath('/secret-hq/customers')
}

export async function getCustomers() {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
}

export async function getCustomerOrders(customerId: string) {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
}

export async function updateCustomer(customerId: string, customerData: any) {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('customers')
        .update({
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
            accepts_marketing: customerData.accepts_marketing,
            updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
        .select()
        .single()
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/customers')
    return data
}

export async function deleteCustomer(customerId: string) {
    const supabase = await createClient()
    // Unlink orders first
    await supabase.from('orders').update({ customer_id: null }).eq('customer_id', customerId)
    const { error } = await supabase.from('customers').delete().eq('id', customerId)
    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/customers')
    return { success: true }
}

// ─── STAFF MANAGEMENT ────────────────────────────────────────────────────────


export async function sendPromotionalEmail(customerEmail: string, promo: any) {
    const result = await resendPromo({
        email: customerEmail,
        promoTitle: promo.title,
        promoDescription: promo.description,
        promoImage: promo.image_url,
        targetUrl: promo.target_url
    })

    if (!result.success) throw new Error('Error al enviar el correo')
    return { success: true }
}

export async function getCurrentUserRole() {
    try {
        const publicClient = await createClient() // Use public client for auth
        const { data: { user } } = await publicClient.auth.getUser()
        if (!user) return null

        // Use Admin Client to read staff table to avoid RLS recursion
        const supabase = await createAdminClient()
        const { data: staff } = await supabase
            .from('staff')
            .select('role')
            .eq('email', user.email)
            .maybeSingle()

        // If no staff entry exists yet and it's the owner email from settings
        if (!staff) {
            const { data: settings } = await supabase
                .from('store_settings')
                .select('contact_email')
                .single()

            if (settings?.contact_email === user.email) {
                // Auto-create owner entry if they are the configured contact email
                await supabase.from('staff').insert({
                    email: user.email,
                    role: 'owner',
                    full_name: user.user_metadata?.full_name || 'Owner'
                })
                return 'owner'
            }
        }

        return staff?.role || null
    } catch (e) {
        console.error('getCurrentUserRole Error:', e)
        return null
    }
}

export async function getStaffMembers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('role', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
}

export async function addStaffMember(staffData: { email: string; role: 'owner' | 'moderator'; full_name?: string }) {
    const supabase = await createClient()

    // Check if current user is owner
    const role = await getCurrentUserRole()
    if (role !== 'owner') throw new Error('No tienes permisos para gestionar el equipo')

    const { data, error } = await supabase
        .from('staff')
        .upsert({
            email: staffData.email.toLowerCase(),
            role: staffData.role,
            full_name: staffData.full_name || null
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/settings')
    return data
}

export async function removeStaffMember(email: string) {
    const supabase = await createClient()

    // Check if current user is owner
    const role = await getCurrentUserRole()
    if (role !== 'owner') throw new Error('No tienes permisos para gestionar el equipo')

    const { error } = await supabase
        .from('staff')
        .delete()
        .eq('email', email)

    if (error) throw new Error(error.message)
    revalidatePath('/secret-hq/settings')
    return { success: true }
}

export async function sendTestEmail(targetEmail: string, fromEmail?: string) {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    return await sendOrderConfirmationEmail({
        email: targetEmail,
        orderNumber: 'TEST-' + Math.random().toString(36).substring(7).toUpperCase(),
        customerName: 'Test User',
        totalAmount: 99.99,
        items: [
            { name: 'Producto de Prueba', size: 'M', quantity: 1, price_at_time: 99.99 }
        ],
        fromEmail
    })
}

export async function createTestNotification() {
    const role = await getCurrentUserRole()
    if (!role) throw new Error('Unauthorized')

    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('notifications')
        .insert({
            title: 'PRUEBA DE SISTEMA',
            message: 'Esta es una notificación de prueba para verificar el funcionamiento en tiempo real.',
            type: 'info'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}


export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { products: [], orders: [], customers: [] }

    const supabase = await createClient()

    // Search products
    const { data: products } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .ilike('name', `%${query}%`)
        .limit(5)

    // Search orders
    const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_name, customer_email, total_amount, status')
        .or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`)
        .limit(5)

    // Search customers
    const { data: customers } = await supabase
        .from('customers')
        .select('id, name, email')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5)

    return {
        products: products || [],
        orders: orders || [],
        customers: customers || []
    }
}
