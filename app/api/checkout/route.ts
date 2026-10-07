import { NextResponse } from 'next/server';
import { sendOrderPlacedEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, name, installation_notes, shipping_address } = body;

    // Simulate order creation in Supabase
    const orderId = `ord_${Math.random().toString(36).substr(2, 9)}`;
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.cartQuantity,
      0
    );

    // Normally we would:
    // 1. Insert order into supabase (status PENDING)
    // 2. Call Paystack to initialize transaction
    // 3. Return authorization_url to client

    // Send checkout email
    if (email) {
      await sendOrderPlacedEmail({
        email,
        customerName: name,
        orderId,
        totalAmount
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        totalAmount,
        // Mock paystack url
        authorization_url: `https://checkout.paystack.com/${orderId}`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
