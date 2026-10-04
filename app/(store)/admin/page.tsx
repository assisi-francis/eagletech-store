'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { updateOrderStatusAction, getAllOrdersAdminAction } from '@/app/actions/orders';
import { Button } from '@/components/ui/button';
import { Package, Plus, Search, CheckCircle2, Truck, LayoutDashboard, Star, Megaphone } from 'lucide-react';
import { toast } from 'sonner';


const CATEGORY_MAP: Record<string, { subcategories: string[], brands: string[] }> = {
  'Laptops': { subcategories: ['MacBooks', 'HP', 'Dell', 'Asus'], brands: ['Apple', 'HP', 'Dell', 'Asus'] },
  'Phones': { subcategories: ['iPhones', 'Samsung', 'Google Pixels', 'Xiaomi'], brands: ['Apple', 'Samsung', 'Google', 'Xiaomi'] },
  'Accessories': { subcategories: ['Mouse', 'SSDs', 'HDDs', 'SanDisk flash drives', 'SSD Enclosure', 'HDD enclosure 3.0'], brands: ['Logitech', 'Razer', 'Samsung', 'Crucial', 'Seagate', 'SanDisk', 'UGREEN', 'Orico'] },
  'Networking': { subcategories: ['Starlink', 'Routers'], brands: ['SpaceX', 'TP-Link'] },
  'Security': { subcategories: ['CCTV'], brands: ['Ubiquiti'] }
};


const SUBCATEGORY_BRAND_MAP: Record<string, string[]> = {
  'MacBooks': ['Apple'],
  'HP': ['HP'],
  'Dell': ['Dell'],
  'Asus': ['Asus'],
  'iPhones': ['Apple'],
  'Samsung': ['Samsung'],
  'Google Pixels': ['Google'],
  'Xiaomi': ['Xiaomi'],
  'Mouse': ['Logitech', 'Razer'],
  'SSDs': ['Samsung', 'Crucial'],
  'HDDs': ['Seagate'],
  'SanDisk flash drives': ['SanDisk'],
  'SSD Enclosure': ['UGREEN'],
  'HDD enclosure 2.0': ['Orico'],
  'HDD enclosure 3.0': ['Orico'],
  'Starlink': ['SpaceX'],
  'Routers': ['TP-Link'],
  'CCTV': ['Ubiquiti']
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews' | 'campaigns'>('orders');

  // New Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const [isNewSubcategory, setIsNewSubcategory] = useState(false);
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [customBrand, setCustomBrand] = useState('');

  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [desc, setDesc] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campaign Form State
  const [campTitle, setCampTitle] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campDiscount, setCampDiscount] = useState('');
  const [campImage, setCampImage] = useState('');

  useEffect(() => {
    async function checkAdminAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        router.push('/auth');
        return;
      }
      
      if (user.email !== 'doncyco123@gmail.com') {
        toast.error('Unauthorized: Admin access only');
        router.push('/');
        return;
      }

      setIsAdmin(true);
      fetchData(session.access_token);
    }

    checkAdminAndFetch();
  }, [router]);

  async function fetchData(token: string) {
    // Fetch Orders
    const ordersRes = await getAllOrdersAdminAction(token);
    if (ordersRes.success) setOrders(ordersRes.orders);

    // Fetch Pending Reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }); // Fallback if column doesn't exist yet
    if (reviewsData) setReviews(reviewsData);

    // Fetch Campaigns
    const { data: campData } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (campData) setCampaigns(campData);

    setLoading(false);
  }

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await updateOrderStatusAction(orderId, nextStatus, session?.access_token || '');
      if (res.success) {
        toast.success(`Order marked as ${nextStatus}`);
        setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: nextStatus } : o));
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const images = [image1, image2, image3].filter(img => img.trim() !== '');
    const finalCategory = isNewCategory ? customCategory : category;
    const finalSubcategory = isNewSubcategory ? customSubcategory : subcategory;
    const finalBrand = isNewBrand ? customBrand : brand;

    try {
      const { error } = await supabase.from('products').insert({
        title,
        price: Number(price),
        category: finalCategory,
        subcategory: finalSubcategory || null,
        brand: finalBrand || null,
        description: desc,
        stock_quantity: 100,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: images,
        is_service: false
      });

      if (error) throw error;

      toast.success('Product added successfully!');
      setTitle(''); setPrice(''); setCategory('Laptops'); setIsNewCategory(false); setCustomCategory(''); setSubcategory(''); setIsNewSubcategory(false); setCustomSubcategory(''); setBrand(''); setIsNewBrand(false); setCustomBrand(''); setDesc('');
      setImage1(''); setImage2(''); setImage3('');
    } catch (err: any) {
      toast.error('Error adding product: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
      if (error) throw error;
      toast.success('Review approved!');
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err: any) {
      toast.error('Error approving review: ' + err.message);
    }
  };

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('campaigns').insert({
        title: campTitle,
        description: campDesc,
        discount_percentage: Number(campDiscount),
        banner_image: campImage,
        is_active: true
      }).select().single();

      if (error) throw error;
      toast.success('Campaign launched!');
      setCampaigns([data, ...campaigns]);
      setCampTitle(''); setCampDesc(''); setCampDiscount(''); setCampImage('');
    } catch (err: any) {
      toast.error('Error launching campaign: ' + (err.message || 'Make sure the campaigns table is created.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/30"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Admin Command Center</h1>
            <p className="text-muted-foreground">Manage orders, products, reviews, and campaigns.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>Orders & Shipments</Button>
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Add Product</Button>
          <Button variant={activeTab === 'reviews' ? 'default' : 'outline'} onClick={() => setActiveTab('reviews')}>Pending Reviews {reviews.length > 0 && `(${reviews.length})`}</Button>
          <Button variant={activeTab === 'campaigns' ? 'default' : 'outline'} onClick={() => setActiveTab('campaigns')}>Promo Campaigns</Button>
        </div>

        {activeTab === 'orders' && (
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Package className="w-5 h-5" /> Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Payment</th>
                      <th className="px-6 py-3 rounded-r-lg">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0">
                        <td className="px-6 py-4 font-mono text-xs">{order.id.split('-')[0]}...</td>
                        <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold">₦{order.total_amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.payment_status === 'SUCCESSFUL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.order_status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-background border border-border text-xs rounded-lg px-2 py-1 font-bold outline-none"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="ARRIVED">ARRIVED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium">Title</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium">Price (₦)</label>
                  <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  {!isNewCategory ? (
                    <select 
                      required 
                      value={category} 
                      onChange={e => {
                        if (e.target.value === 'new') setIsNewCategory(true);
                        else { setCategory(e.target.value); setSubcategory(''); setBrand(''); setIsNewSubcategory(false); setIsNewBrand(false); }
                      }} 
                      className="w-full bg-background border border-border rounded-xl px-4 py-2"
                    >
                      <option value="Laptops">Laptops</option>
                      <option value="Phones">Phones</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Networking">Networking</option>
                      <option value="Security">Security</option>
                      <option value="new">+ Create New Category...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        required 
                        type="text" 
                        value={customCategory} 
                        onChange={e => setCustomCategory(e.target.value)} 
                        className="w-full bg-background border border-border rounded-xl px-4 py-2" 
                        placeholder="New Category Name" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsNewCategory(false)}
                        className="px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                                <div className="space-y-2">
                  <label className="text-sm font-medium">Subcategory</label>
                  {!isNewSubcategory ? (
                    <select 
                      value={subcategory} 
                      onChange={e => {
                        if (e.target.value === 'new') setIsNewSubcategory(true);
                        else {
                          setSubcategory(e.target.value);
                          setBrand('');
                          setIsNewBrand(false);
                        }
                      }} 
                      className="w-full bg-background border border-border rounded-xl px-4 py-2"
                    >
                      <option value="">Select Subcategory...</option>
                      {CATEGORY_MAP[category]?.subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="new">+ Create New Subcategory...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={customSubcategory} 
                        onChange={e => setCustomSubcategory(e.target.value)} 
                        className="w-full bg-background border border-border rounded-xl px-4 py-2" 
                        placeholder="New Subcategory" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsNewSubcategory(false)}
                        className="px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  {!isNewBrand ? (
                    <select 
                      value={brand} 
                      onChange={e => {
                        if (e.target.value === 'new') setIsNewBrand(true);
                        else setBrand(e.target.value);
                      }} 
                      className="w-full bg-background border border-border rounded-xl px-4 py-2"
                    >
                      <option value="">Select Brand...</option>
                      {(SUBCATEGORY_BRAND_MAP[subcategory] || []).map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                      <option value="new">+ Create New Brand...</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={customBrand} 
                        onChange={e => setCustomBrand(e.target.value)} 
                        className="w-full bg-background border border-border rounded-xl px-4 py-2" 
                        placeholder="New Brand" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setIsNewBrand(false)}
                        className="px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2 h-24" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Images (Up to 3 beautiful images)</label>
                <input required type="url" placeholder="Image URL 1 (Cover)" value={image1} onChange={e => setImage1(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2 mb-2" />
                <input type="url" placeholder="Image URL 2 (Optional)" value={image2} onChange={e => setImage2(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2 mb-2" />
                <input type="url" placeholder="Image URL 3 (Optional)" value={image3} onChange={e => setImage3(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Star className="w-5 h-5" /> Pending Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending reviews.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border border-border/50 rounded-xl p-4 flex items-start justify-between">
                    <div>
                      <p className="font-bold">{review.profiles?.full_name}</p>
                      <p className="text-sm text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                    <Button size="sm" onClick={() => handleApproveReview(review.id)}>Approve</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Megaphone className="w-5 h-5" /> Launch Campaign</h2>
              <form onSubmit={handleAddCampaign} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Title</label>
                  <input required type="text" value={campTitle} onChange={e => setCampTitle(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" placeholder="e.g. Black Friday Mega Sale" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Percentage (%)</label>
                  <input required type="number" min="1" max="99" value={campDiscount} onChange={e => setCampDiscount(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" placeholder="e.g. 20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Description</label>
                  <textarea required value={campDesc} onChange={e => setCampDesc(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2 h-20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Banner Image URL</label>
                  <input required type="url" value={campImage} onChange={e => setCampImage(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2" placeholder="https://..." />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Launching...' : 'Launch Campaign'}
                </Button>
              </form>
            </div>
            
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Active Campaigns</h2>
              {campaigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No active campaigns.</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map(camp => (
                    <div key={camp.id} className="border border-border/50 rounded-xl overflow-hidden relative">
                      {camp.banner_image && <img src={camp.banner_image} className="w-full h-32 object-cover opacity-80" alt={camp.title} />}
                      <div className="p-4 bg-card/95 backdrop-blur absolute bottom-0 left-0 right-0">
                        <h3 className="font-bold">{camp.title} <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs ml-2">{camp.discount_percentage}% OFF</span></h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{camp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
