import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderConfirmationEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ success: false, message: 'Missing secret key' }, { status: 500 });
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const { reference, customer } = event.data;

      // Ensure this matches the query specified in the PRD
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'SUCCESSFUL' })
        .eq('paystack_reference', reference)
        .select('*, profiles(full_name), order_items(*, products(title))')
        .single();

      if (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      if (order) {
        // Send email via Brevo
        await sendOrderConfirmationEmail({
          email: customer.email || '',
          customerName: order.profiles?.full_name || 'Valued Customer',
          orderId: order.id,
          totalAmount: order.total_amount,
          items: order.order_items.map((item: any) => ({
            name: item.products?.title || 'Unknown Item',
            quantity: item.quantity,
            price: item.price
          }))
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
