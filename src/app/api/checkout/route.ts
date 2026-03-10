import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-11' as any,
});

export async function POST(req: Request) {
    try {
        const { items, customerEmail, utmParams } = await req.json();

        // Create line items for Stripe
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    images: [item.variant.main_image || item.variant.mainImage],
                    description: `Color: ${item.variant.color_name || item.variant.colorName} | Size: ${item.size}`,
                },
                unit_amount: Math.round(item.product.price * 100), // In cents
            },
            quantity: item.quantity,
        }));

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/`,
            metadata: {
                utm_source: utmParams?.source || '',
                utm_medium: utmParams?.medium || '',
                utm_campaign: utmParams?.campaign || '',
                // Store items as string for webhook handling
                order_items: JSON.stringify(items.map((it: any) => ({
                    p_id: it.product.id,
                    v_id: it.variant.id,
                    size: it.size,
                    qty: it.quantity,
                    price: it.product.price
                })))
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'ES', 'GB', 'MX'],
            },
            billing_address_collection: 'required',
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
