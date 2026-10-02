import { createClient } from '@supabase/supabase-js';

// Note: This must only be used in Server-Side code (API routes, Webhooks)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
