'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Package, Plus, Search, CheckCircle2, Truck, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('macbook');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkAdminAndFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setIsAdmin(true);

      // Fetch all orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (ordersData) {
        setOrders(ordersData);
      }
      setLoading(false);
    }
    checkAdminAndFetch();
  }, [router]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
    } else {
      toast.success(`Order marked as ${status}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: status } : o));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { error } = await supabase
      .from('products')
      .insert([{
        title,
        slug,
        price: Number(price),
        category,
        images: [imageUrl],
        specs: { "Brand": "Apple" }
      }]);

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Product created successfully!');
      setTitle('');
      setPrice('');
      setImageUrl('');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-12">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Orders */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5" /> Recent Orders
            </h2>
            
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No orders found.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {orders.map(order => (
                    <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="font-bold">₦{order.total_amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                        <p className="text-sm mt-1">{order.shipping_address}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.order_status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          order.order_status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.order_status}
                        </span>

                        {order.order_status === 'PENDING' && (
                          <Button size="sm" className="rounded-xl ml-2" onClick={() => updateOrderStatus(order.id, 'SHIPPED')}>
                            <Truck className="w-4 h-4 mr-1" /> Ship
                          </Button>
                        )}
                        {order.order_status === 'SHIPPED' && (
                          <Button size="sm" variant="outline" className="rounded-xl ml-2" onClick={() => updateOrderStatus(order.id, 'DELIVERED')}>
                            <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" /> Deliver
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Add Product */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Product
            </h2>

            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (₦)</label>
                  <input 
                    type="number" 
                    required 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="macbook">MacBook</option>
                    <option value="starlink">Starlink</option>
                    <option value="cctv">CCTV</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Image URL</label>
                  <input 
                    type="url" 
                    required 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full h-10 px-3 mt-1 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl mt-4 font-bold">
                  {isSubmitting ? 'Adding...' : 'Add to Database'}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
