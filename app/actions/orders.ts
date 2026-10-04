'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderStatusEmail } from '@/lib/brevo';

export async function updateOrderStatusAction(orderId: string, status: string, token: string) {
  try {
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Verify the session using the provided JWT token
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user || user.email !== 'doncyco123@gmail.com') {
      throw new Error('Forbidden: Admin access only');
    }

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

export async function getAllOrdersAdminAction(token: string) {
  try {
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Verify the session securely
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 2. Hard verify the admin email
    if (user.email !== 'doncyco123@gmail.com') {
      throw new Error('Forbidden: Admin access only');
    }

    // 3. Since verified, use the service role key to fetch all orders safely
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, orders };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function customerConfirmReceiptAction(orderId: string, token: string) {
  try {
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Verify the session
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 2. Make sure the order actually belongs to this user
    const { data: order, error: fetchError } = await supabaseServer
      .from('orders')
      .select('user_id')
      .eq('id', orderId)
      .single();

    if (fetchError || order?.user_id !== user.id) {
      throw new Error('Order not found or forbidden');
    }

    // 3. Update to DELIVERED
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ order_status: 'DELIVERED' })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
