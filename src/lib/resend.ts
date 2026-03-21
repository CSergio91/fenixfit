import { Resend } from 'resend';

const resend = new Resend((process.env.RESEND_API_KEY || 're_fallback_key_for_build').trim());

export async function sendOrderConfirmationEmail({
    email,
    orderNumber,
    customerName,
    totalAmount,
    items,
    fromEmail
}: {
    email: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    items: any[];
    fromEmail?: string;
}) {
    try {
        console.log('--- ENVIANDO CORREO DE CONFIRMACIÓN ---');
        console.log('Para:', email);
        const { data, error } = await resend.emails.send({
            from: fromEmail || 'Fenix Fit <pedidos@fenixfit.es>',
            to: [email],
            subject: `Confirmación de Pedido #${orderNumber} - Fenix Fit`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; color: #000;">
                    <div style="background: #000; padding: 40px; text-align: center;">
                        <h1 style="color: #fff; text-transform: uppercase; font-style: italic; letter-spacing: 2px;">Fenix Fit</h1>
                    </div>
                    <div style="padding: 40px; border: 1px solid #eee;">
                        <h2 style="text-transform: uppercase; font-Weight: 900; font-size: 24px;">¡Gracias por tu compra, ${customerName}!</h2>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Tu pedido <strong>#${orderNumber}</strong> ha sido confirmado y está siendo procesado. 
                            Te enviaremos otro correo cuando tu paquete esté en camino.
                        </p>
                        
                        <div style="margin-top: 40px; border-top: 2px solid #000; pt-20px;">
                            <h3 style="text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Resumen del Pedido</h3>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                ${items.map(item => `
                                    <tr>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">
                                            ${item.name} (Talla: ${item.size}) x ${item.quantity}
                                        </td>
                                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                                            ${((item.price || item.price_at_time || 0) * item.quantity).toFixed(2)}€
                                        </td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td style="padding: 20px 0; font-size: 16px; font-weight: 900; text-transform: uppercase;">Total</td>
                                    <td style="padding: 20px 0; text-align: right; font-size: 18px; font-weight: 900;">${totalAmount.toFixed(2)}€</td>
                                </tr>
                            </table>
                        </div>

                        <div style="margin-top: 40px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Ver mi pedido</a>
                        </div>
                    </div>
                    <div style="padding: 40px; text-align: center; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                        &copy; ${new Date().getFullYear()} Fenix Fit. Todos los derechos reservados.
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email caught error:', err);
        return { success: false, error: err };
    }
}

export async function sendPromotionalEmail({
    email,
    promoTitle,
    promoDescription,
    promoImage,
    targetUrl
}: {
    email: string;
    promoTitle: string;
    promoDescription: string;
    promoImage?: string;
    targetUrl?: string;
}) {
    try {
        console.log('--- ENVIANDO CORREO PROMOCIONAL ---');
        const { data, error } = await resend.emails.send({
            from: 'Fenix Fit <marketing@fenixfit.es>',
            to: [email],
            subject: promoTitle,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; color: #000;">
                    <div style="background: #000; padding: 40px; text-align: center;">
                        <h1 style="color: #fff; text-transform: uppercase; font-style: italic; letter-spacing: 2px;">Fenix Fit</h1>
                    </div>
                    ${promoImage ? `<img src="${promoImage}" alt="Promo Banner" style="width: 100%; height: auto; display: block;" />` : ''}
                    <div style="padding: 40px; border: 1px solid #eee; text-align: center;">
                        <h2 style="text-transform: uppercase; font-weight: 900; font-size: 28px; margin-bottom: 20px;">${promoTitle}</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            ${promoDescription}
                        </p>
                        ${targetUrl ? `
                            <a href="${targetUrl}" style="background: #000; color: #fff; padding: 18px 40px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Ver Colección</a>
                        ` : ''}
                    </div>
                    <div style="padding: 40px; text-align: center; color: #999; font-size: 10px; line-height: 1.5;">
                        <p>&copy; ${new Date().getFullYear()} Fenix Fit. Todos los derechos reservados.</p>
                        <p style="margin-top: 20px;">Recibes este correo porque aceptaste recibir comunicaciones comerciales de Fenix Fit.<br/>Si no deseas recibir más correos, puedes gestionar tu cuenta en nuestra web.</p>
                    </div>
                </div>
            `
        });

        if (error) return { success: false, error };
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err };
    }
}

export async function sendOrderStatusUpdateEmail({
    email,
    orderNumber,
    customerName,
    newStatus,
    trackingUrl
}: {
    email: string;
    orderNumber: string;
    customerName: string;
    newStatus: string;
    trackingUrl?: string;
}) {
    const statusMessages: Record<string, string> = {
        'confirmed': 'Tu pedido ha sido confirmado y está preparándose.',
        'shipped': '¡Tu pedido está en camino!',
        'delivered': 'Tu pedido ha sido entregado.',
        'cancelled': 'Tu pedido ha sido cancelado.',
        'paid': 'Hemos recibido tu pago correctamente.'
    };

    const message = statusMessages[newStatus] || `El estado de tu pedido #${orderNumber} ha cambiado a: ${newStatus}`;

    try {
        console.log('--- ENVIANDO ACTUALIZACION DE PEDIDO ---');
        const { data, error } = await resend.emails.send({
            from: 'Fenix Fit <pedidos@fenixfit.es>',
            to: [email],
            subject: `Actualización de tu pedido #${orderNumber} - Fenix Fit`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff; color: #000;">
                    <div style="background: #000; padding: 40px; text-align: center;">
                        <h1 style="color: #fff; text-transform: uppercase; font-style: italic; letter-spacing: 2px;">Fenix Fit</h1>
                    </div>
                    <div style="padding: 40px; border: 1px solid #eee; text-align: center;">
                        <h2 style="text-transform: uppercase; font-weight: 900; font-size: 24px;">Hola ${customerName},</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                            ${message}
                        </p>
                        ${trackingUrl ? `
                            <a href="${trackingUrl}" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: inline-block; margin-top: 20px;">Seguir mi paquete</a>
                        ` : ''}
                    </div>
                    <div style="padding: 40px; text-align: center; color: #999; font-size: 11px;">
                        &copy; ${new Date().getFullYear()} Fenix Fit. Todos los derechos reservados.
                    </div>
                </div>
            `
        });

        return { success: !error, data, error };
    } catch (err) {
        return { success: false, error: err };
    }
}

export async function sendNewOrderAdminNotification({
    adminEmail,
    orderNumber,
    customerName,
    totalAmount
}: {
    adminEmail: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
}) {
    try {
        console.log('--- ENVIANDO NOTIFICACION ADM ---');
        await resend.emails.send({
            from: 'Fenix Fit System <admin@fenixfit.es>',
            to: [adminEmail],
            subject: `🚨 ¡NUEVO PEDIDO RECIBIDO! #${orderNumber}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 40px;">
                    <div style="background: #fff; padding: 40px; border: 1px solid #eee;">
                        <h1 style="font-size: 20px; font-weight: 900; text-transform: uppercase; color: #e11d48;">Venta Realizada</h1>
                        <p style="font-size: 14px; margin-top: 20px;">Se ha registrado un nuevo pedido en la tienda.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                        <div style="background: #f3f4f6; padding: 20px;">
                            <p style="margin: 5px 0; font-size: 12px; color: #666;">PEDIDO:</p>
                            <p style="margin: 0; font-weight: bold;">#${orderNumber}</p>
                            
                            <p style="margin: 20px 0 5px 0; font-size: 12px; color: #666;">CLIENTE:</p>
                            <p style="margin: 0; font-weight: bold;">${customerName}</p>
                            
                            <p style="margin: 20px 0 5px 0; font-size: 12px; color: #666;">TOTAL:</p>
                            <p style="margin: 0; font-weight: bold; font-size: 18px;">${totalAmount.toFixed(2)}€</p>
                        </div>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/secret-hq/orders" style="display: block; margin-top: 30px; text-align: center; background: #000; color: #fff; padding: 15px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px;">Gestionar en el CRM</a>
                    </div>
                </div>
            `
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
}

