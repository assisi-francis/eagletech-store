'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Fingerprint, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const displayName = user.user_metadata?.full_name || 'EagleTech User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="flex items-center space-x-4 mb-8">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black tracking-tight">Your Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-primary" />
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border-4 border-background flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-black text-primary">{initial}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {displayName}
                </h2>
                <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Verified Account
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-sm truncate">{user.email}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member Since</p>
                    <p className="font-medium text-sm truncate">{joinDate}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-4 sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Fingerprint className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unique Account ID</p>
                    <p className="font-medium text-xs font-mono truncate text-muted-foreground">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button 
            variant="outline" 
            className="rounded-xl px-8 py-6 font-semibold"
            onClick={() => router.push('/')}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="destructive" 
            className="rounded-xl px-8 py-6 font-semibold shadow-lg shadow-destructive/20"
            onClick={async () => {
              await supabase.auth.signOut();
              useCartStore.getState().clearCart();
              router.push('/auth');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out Securely
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
