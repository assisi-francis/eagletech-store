'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderStatusEmail } from '@/lib/brevo';

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select('*, profiles(full_name, email)')
      .single();

    if (error) throw error;

    // Determine customer email and name
    const customerEmail = order.profiles?.email;
    const customerName = order.profiles?.full_name || 'Valued Customer';

    if (customerEmail) {
      await sendOrderStatusEmail({
        email: customerEmail,
        customerName,
        orderId: order.id,
        status
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update order status:', err);
    return { success: false, error: err.message };
  }
}
