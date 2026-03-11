import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force dynamic so Vercel doesn't try to pre-render this route at build time
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    // Instantiate Stripe INSIDE the handler so the env var is read at runtime, not build time
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-02-11' as any,
    });

    try {
        const { items, customerEmail, utmParams, acceptsMarketing } = await req.json();

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.NEXT_PUBLIC_BASE_URL ||
            'http://localhost:3000';

        // Create line items for Stripe
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    images: [item.variant.main_image || item.variant.mainImage].filter(Boolean),
                    description: `Color: ${item.variant.color_name || item.variant.colorName} | Talla: ${item.size}`,
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        }));

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail,
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/`,
            metadata: {
                utm_source: utmParams?.source || '',
                utm_medium: utmParams?.medium || '',
                utm_campaign: utmParams?.campaign || '',
                accepts_marketing: acceptsMarketing ? 'true' : 'false',
                order_items: JSON.stringify(items.map((it: any) => ({
                    p_id: it.product.id,
                    v_id: it.variant.id,
                    size: it.size,
                    qty: it.quantity,
                    price: it.product.price,
                })))
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'ES', 'GB', 'MX', 'FR', 'DE', 'IT'],
            },
            billing_address_collection: 'required',
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
