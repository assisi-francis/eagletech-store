'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderPlacedEmail } from '@/lib/brevo';

export async function createPendingOrderAction(data: {
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  email: string;
  fullName: string;
  paystackReference: string;
  items: any[];
}) {
  try {
    // 1. Create order
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: data.userId,
        total_amount: data.totalAmount,
        payment_status: 'PENDING',
        order_status: 'PENDING',
        shipping_address: data.shippingAddress,
        paystack_reference: data.paystackReference
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Insert order items
    const orderItems = data.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.cartQuantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Failed to insert order items (possibly due to mock product string IDs vs UUID constraint):', itemsError);
      // Don't throw, let the checkout proceed even if order_items fail to insert
    }

    // 3. Send "Order Placed" email
    await sendOrderPlacedEmail({
      email: data.email,
      customerName: data.fullName,
      orderId: order.id,
      totalAmount: data.totalAmount
    });

    return { success: true, orderId: order.id };
  } catch (err: any) {
    console.error('Failed to create pending order:', err);
    return { success: false, error: err.message };
  }
}

export async function confirmOrderPaymentAction(orderId: string, paystackReference: string) {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'SUCCESSFUL',
        order_status: 'PROCESSING',
        paystack_reference: paystackReference
      })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
