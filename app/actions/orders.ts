'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderStatusEmail } from '@/lib/brevo';

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const cookieStore = cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 1. Verify the session on the server securely
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
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

export async function getAllOrdersAdminAction() {
  try {
    const cookieStore = cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 1. Verify the session on the server securely
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
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
