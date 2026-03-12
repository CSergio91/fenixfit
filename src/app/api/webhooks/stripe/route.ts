import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail, sendNewOrderAdminNotification } from '@/lib/resend';

// Force dynamic so Vercel doesn't try to pre-render this route at build time
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    // Instantiate Stripe INSIDE the handler so the env var is read at runtime, not build time
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-02-11' as any,
    });

    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        // Cast to any to access shipping_details (present in API but not always in type defs)
        const sessionAny = session as any;
        const items = JSON.parse(session.metadata?.order_items || '[]');

        const supabase = await createAdminClient();

        // 1. Insert Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                stripe_session_id: session.id,
                customer_email: session.customer_details?.email || '',
                customer_name: session.customer_details?.name || 'Guest',
                total_amount: (session.amount_total || 0) / 100,
                status: 'paid',
                checkout_method: 'stripe',
                shipping_address: sessionAny.shipping_details?.address || {},
                utm_source: session.metadata?.utm_source || null,
                utm_medium: session.metadata?.utm_medium || null,
                utm_campaign: session.metadata?.utm_campaign || null,
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Insert Error:', orderError);
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // 2. Insert Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.p_id,
            variant_id: item.v_id,
            size: item.size,
            quantity: item.qty,
            price_at_time: item.price,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) console.error('Items Insert Error:', itemsError);

        // 3. Update Stock for each item
        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.p_id)
                .single();
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.qty);
                await supabase.from('products').update({ stock: newStock }).eq('id', item.p_id);
            }
        }

        // 4. Send Confirmation Email to Customer
        try {
            await sendOrderConfirmationEmail({
                email: session.customer_details?.email || '',
                orderNumber: order.id.slice(0, 8).toUpperCase(),
                customerName: session.customer_details?.name || 'Cliente',
                totalAmount: (session.amount_total || 0) / 100,
                items: items.map((it: any) => ({
                    name: it.name || 'Producto',
                    size: it.size,
                    quantity: it.qty,
                    price: it.price
                }))
            })
        } catch (emailErr) {
            console.error('Customer Email Error:', emailErr)
        }

        // 5. Notify Admin
        try {
            const { data: settings } = await supabase.from('store_settings').select('contact_email').single()
            if (settings?.contact_email) {
                await sendNewOrderAdminNotification({
                    adminEmail: settings.contact_email,
                    orderNumber: order.id.slice(0, 8).toUpperCase(),
                    customerName: session.customer_details?.name || 'Cliente',
                    totalAmount: (session.amount_total || 0) / 100
                })
            }
        } catch (adminErr) {
            console.error('Admin Notification Error:', adminErr)
        }
    }

    return NextResponse.json({ received: true });
}
