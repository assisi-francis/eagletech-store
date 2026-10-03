'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductReviews } from '@/components/product-reviews';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, ArrowLeft, Heart, ChevronRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const product = mockProducts.find((p) => p.slug === params.slug);
  const addItem = useCartStore((state) => state.addItem);
  
  const { items: wishlistItems, toggleWishlist, fetchWishlist } = useWishlistStore();
  const [user, setUser] = useState<any>(null);
  const isSaved = wishlistItems.includes(params.slug);

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchWishlist(user.id);
      }
    });
  }, [fetchWishlist]);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleSaveForLater = async () => {
    if (!user) {
      toast.error('Please sign in to save products to your wishlist.');
      router.push('/auth');
      return;
    }

    setIsWishlistLoading(true);
    const added = await toggleWishlist(params.slug, user.id);
    setIsWishlistLoading(false);
    
    if (added) {
      toast.success('Saved to your Wishlist!');
    } else {
      toast('Removed from Wishlist');
    }
  };

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Breadcrumbs */}
      <div className="bg-background border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex items-center text-sm text-muted-foreground">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span>{product.category || 'Shop'}</span>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="truncate max-w-[200px] text-foreground font-medium">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white border border-border/50 shadow-sm flex items-center justify-center p-8 group"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImage]} 
                  alt={product.title} 
                  className="h-full w-full object-contain mix-blend-multiply cursor-grab active:cursor-grabbing" 
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50 && activeImage < images.length - 1) {
                      setActiveImage(activeImage + 1);
                    } else if (swipe > 50 && activeImage > 0) {
                      setActiveImage(activeImage - 1);
                    }
                  }}
                />
              </AnimatePresence>
              
              {product.brand && (
                <div className="absolute top-6 left-6 rounded-full bg-background/90 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md border border-border/50">
                  {product.brand}
                </div>
              )}

              <button 
                onClick={handleSaveForLater}
                disabled={isWishlistLoading}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/90 shadow-sm backdrop-blur-md border border-border/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-foreground'} ${isWishlistLoading ? 'opacity-50 animate-pulse' : ''}`} />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl bg-white border-2 overflow-hidden transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border/50 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">{product.title}</h1>
                <div className="flex items-end gap-4">
                  <p className="text-4xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
                  {product.price > 1000000 && (
                    <span className="mb-1 text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-1" /> Ships Free
                    </span>
                  )}
                </div>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>

              <div className="pt-4 space-y-4">
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  className="w-full h-16 text-lg rounded-2xl shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" /> Add to Cart
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-6 border-t border-border/50">
                <div className="flex items-center gap-4 text-sm font-medium p-4 rounded-2xl bg-card border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">1 Year Official Warranty</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Backed by EagleTech Guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium p-4 rounded-2xl bg-card border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">7-Day Free Returns</p>
                    <p className="text-muted-foreground text-xs mt-0.5">No questions asked return policy</p>
                  </div>
                </div>
              </div>

              {/* Specs Tabs */}
              <div className="pt-8">
                <div className="flex gap-6 border-b border-border/50 mb-6">
                  {['specs', 'includes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {tab === 'specs' ? 'Tech Specs' : 'In The Box'}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 'specs' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 py-3 border-b border-border/30">
                        <span className="text-muted-foreground text-sm">Brand</span>
                        <span className="col-span-2 font-medium">{product.brand || 'EagleTech'}</span>
                      </div>
                      <div className="grid grid-cols-3 py-3 border-b border-border/30">
                        <span className="text-muted-foreground text-sm">Category</span>
                        <span className="col-span-2 font-medium">{product.category || 'Electronics'}</span>
                      </div>
                      <div className="grid grid-cols-3 py-3 border-b border-border/30">
                        <span className="text-muted-foreground text-sm">SKU</span>
                        <span className="col-span-2 font-medium font-mono">ET-{product.id}-2024</span>
                      </div>
                      <div className="grid grid-cols-3 py-3 border-b border-border/30">
                        <span className="text-muted-foreground text-sm">Stock Status</span>
                        <span className="col-span-2 font-medium text-emerald-500 flex items-center">
                          <Check className="w-4 h-4 mr-1" /> In Stock ({product.stock_quantity} available)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <Check className="w-5 h-5 text-primary" /> {product.title}
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <Check className="w-5 h-5 text-primary" /> 100W USB-C Power Adapter
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <Check className="w-5 h-5 text-primary" /> USB-C to USB-C Cable (2m)
                      </li>
                      <li className="flex items-center gap-3 text-sm font-medium">
                        <Check className="w-5 h-5 text-primary" /> Quick Start Guide
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productSlug={product.slug} />
        </div>
      </div>
    </div>
  );
}
