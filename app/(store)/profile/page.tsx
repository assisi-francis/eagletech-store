'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerConfirmReceiptAction } from '@/app/actions/orders';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { mockProducts } from '@/lib/data';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut, Fingerprint, ShieldCheck, Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  
  const handleConfirmReceipt = async (orderId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await customerConfirmReceiptAction(orderId, session?.access_token || '');
      if (res.success) {
        toast.success('Thank you! Order marked as delivered.');
        setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: 'DELIVERED' } : o));
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm receipt');
    }
  };

  useEffect(() => {
    if (wishlistItems.length > 0) {
      supabase.from('products').select('*').in('slug', wishlistItems).then(({ data }) => setWishlistProducts(data || []));
    } else {
      setWishlistProducts([]);
    }
  }, [wishlistItems]);

  useEffect(() => {
    async function getUserAndOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
        
        // Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (ordersData) {
          setOrders(ordersData);
        }
        
        // Fetch Wishlist
        await useWishlistStore.getState().fetchWishlist(user.id);
      }
      setLoading(false);
    }
    getUserAndOrders();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            PROCESSING
          </div>
        );
      case 'SHIPPED':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
            <Clock className="w-3 h-3 mr-1.5" />
            SHIPPED
          </div>
        );
      case 'DELIVERED':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            DELIVERED
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">
            {status}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
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
                  <div className="min-w-0">
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
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unique Account ID</p>
                    <p className="font-medium text-xs font-mono truncate text-muted-foreground">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Dashboard */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Recent Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-card border border-border/50 rounded-3xl p-12 text-center shadow-sm">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">When you place an order, it will appear here along with its tracking status.</p>
              <Link href="/">
                <Button className="rounded-xl px-8">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Order Meta */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">₦{order.total_amount.toLocaleString()}</span>
                        {getStatusBadge(order.order_status)}
                      </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      {(order.order_status === 'SHIPPED' || order.order_status === 'ARRIVED') && (
                        <div className="pt-2">
                          <Button size="sm" onClick={() => handleConfirmReceipt(order.id)} className="w-full sm:w-auto gap-2">
                            <CheckCircle2 className="w-4 h-4" /> I have received my order
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Order Details Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Paystack Ref</p>
                        <p className="text-sm font-mono">{order.paystack_reference}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Shipping To</p>
                        <p className="text-sm line-clamp-2">{order.shipping_address}</p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Dashboard */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">My Wishlist</h2>
          </div>

          {(() => {
            

            if (wishlistProducts.length === 0) {
              return (
                <div className="bg-card border border-border/50 rounded-3xl p-12 text-center shadow-sm">
                  <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">Save items you love so you don't lose track of them.</p>
                  <Link href="/">
                    <Button className="rounded-xl px-8">Explore Products</Button>
                  </Link>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlistProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
                      <div className="aspect-square bg-muted/30 rounded-xl mb-4 overflow-hidden relative">
                        <img src={product.images?.[0] || ''} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (user) useWishlistStore.getState().toggleWishlist(product.slug, user.id);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">{product.title}</h3>
                      <p className="text-primary font-bold mt-auto">₦{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8">
          <Button 
            variant="destructive" 
            className="rounded-xl px-8 py-6 font-semibold shadow-lg shadow-destructive/20"
            onClick={async () => {
              try {
                await supabase.auth.signOut();
              } catch (e) {
                console.error('Sign out error:', e);
              } finally {
                useCartStore.getState().clearCart();
                window.location.href = '/auth';
              }
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
