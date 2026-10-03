'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { usePaystackPayment } from 'react-paystack';
import { ShieldCheck, Truck, CreditCard, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || ''
        }));
      }
    });

    if (items.length === 0) {
      router.push('/');
    }
  }, [items.length, router]);

  const totalAmount = getTotal();
  const shippingCost = totalAmount >= 1000000 ? 0 : 15000;
  const finalTotal = totalAmount + shippingCost;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: finalTotal * 100, // Paystack amount is in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder', // Prevent crash if missing
    currency: 'NGN' as const,
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = async (reference: any) => {
    try {
      // Create order in Supabase
      if (user) {
        await supabase.from('orders').insert({
          user_id: user.id,
          total_amount: finalTotal,
          payment_status: 'SUCCESSFUL',
          order_status: 'PROCESSING',
          paystack_reference: reference.reference,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state}`
        });
      }

      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      router.push('/profile'); // Redirect to profile to see order history (soon)
    } catch (error) {
      console.error(error);
      toast.error('Order placed, but failed to save details.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    toast.error('Payment cancelled');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    initializePayment({ 
      onSuccess: handleSuccess, 
      onClose: handleClose 
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="text" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="08012345678"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Street Address <span className="text-destructive">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="123 Tech Avenue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Lagos"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">State/Province <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="text" 
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Lagos State"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {isLoading ? 'Processing...' : `Pay ₦${finalTotal.toLocaleString()}`}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Payments are 100% securely processed by Paystack</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
              <h3 className="font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.cartQuantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">₦{(item.price * item.cartQuantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Shipping
                  </span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-500 font-bold">Free</span>
                    ) : (
                      `₦${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                    Add ₦{(1000000 - totalAmount).toLocaleString()} more to your cart to get <span className="text-emerald-500 font-bold">Free Shipping</span>!
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-border/50">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 flex items-start gap-3 text-sm">
              <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fast Nationwide Delivery</p>
                <p className="text-muted-foreground text-xs mt-1">Orders usually arrive within 2-4 business days.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
