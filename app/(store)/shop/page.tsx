'use client';

import { useState, useMemo } from 'react';
import { mockProducts } from '@/lib/data';
import Link from 'next/link';
import { Heart, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

const categories = ['All', 'macbook', 'starlink', 'cctv', 'networking'];

export default function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const [activeCategory, setActiveCategory] = useState(searchParams.category || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(3000000);
  
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= priceRange;
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, searchQuery, priceRange]);

  return (
    <div className="min-h-screen bg-muted/10 pt-8 pb-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Filters
            </h3>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground font-medium shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Max Price</h4>
                <span className="text-sm font-bold text-primary">₦{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="5000000" 
                step="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {activeCategory === 'All' ? 'All Products' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">{filteredProducts.length} Results</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceRange(5000000); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <div className="bg-card border border-border/50 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="aspect-square bg-muted/30 rounded-2xl mb-4 overflow-hidden relative">
                      <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                      
                      {/* Interactive Wishlist Button (Stop Propagation so it doesn't click the link) */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app we need the user ID here, but for UI sake:
                          toast.error('Please view the product to save it to your wishlist.');
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Heart className={`w-4 h-4 ${wishlistItems.includes(product.slug) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-foreground'}`} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {product.category}
                        </span>
                        {product.id % 2 === 0 && <span className="text-[10px] font-bold tracking-wider uppercase text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">In Stock</span>}
                      </div>
                      
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <p className="font-black text-lg">₦{product.price.toLocaleString()}</p>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
