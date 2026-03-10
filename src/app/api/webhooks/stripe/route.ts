import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-11' as any,
});

export async function POST(req: Request) {
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
                shipping_address: session.shipping_details?.address || {},
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

        // 3. Update Stock (Simple version for demo)
        for (const item of items) {
            await supabase.rpc('decrement_stock', { p_id: item.p_id, qty: item.qty });
        }

        if (itemsError) console.error('Items Insert Error:', itemsError);
    }

    return NextResponse.json({ received: true });
}
