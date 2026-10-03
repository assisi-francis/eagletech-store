'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { mockProducts } from '@/lib/data';
import Link from 'next/link';
import { Heart, Search, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

const categoryGroups = [
  { name: 'All', subcategories: [] },
  { name: 'Laptops', subcategories: ['MacBooks', 'HP', 'Dell', 'Asus'] },
  { name: 'Phones', subcategories: ['iPhones', 'Samsung', 'Google Pixels', 'Xiaomi'] },
  { name: 'Accessories', subcategories: ['Mouse', 'SSDs', 'HDDs', 'SanDisk flash drives', 'SSD Enclosure', 'HDD enclosure 2.0', 'HDD enclosure 3.0'] },
  { name: 'Networking', subcategories: ['Starlink', 'Routers'] },
  { name: 'Security', subcategories: ['CCTV'] }
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'All');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categoryParam && categoryParam !== 'All' ? categoryParam : null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(5000000);
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      setExpandedCategory(categoryParam);
      setActiveSubcategory(null);
    }
  }, [categoryParam]);

  const wishlistItems = useWishlistStore((state) => state.items);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || (product.category || '').toLowerCase() === activeCategory.toLowerCase();
      const matchesSubcategory = !activeSubcategory || (product.subcategory || '').toLowerCase() === activeSubcategory.toLowerCase();
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= priceRange;
      return matchesCategory && matchesSubcategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, activeSubcategory, searchQuery, priceRange]);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'All') {
      setActiveCategory('All');
      setActiveSubcategory(null);
      setExpandedCategory(null);
    } else {
      if (expandedCategory === categoryName) {
        // Toggle close
        setExpandedCategory(null);
      } else {
        // Expand
        setExpandedCategory(categoryName);
        setActiveCategory(categoryName);
        setActiveSubcategory(null);
      }
    }
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
  };

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

            {/* Categories & Subcategories */}
            <div className="space-y-3 mb-8">
              <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-3">Categories</h4>
              <div className="space-y-1">
                {categoryGroups.map((group) => (
                  <div key={group.name} className="flex flex-col">
                    <button
                      onClick={() => handleCategoryClick(group.name)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${activeCategory === group.name && !activeSubcategory ? 'bg-primary text-primary-foreground font-medium shadow-md' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                    >
                      <span>{group.name}</span>
                      {group.subcategories.length > 0 && (
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategory === group.name ? 'rotate-90' : ''}`} />
                      )}
                    </button>
                    
                    {/* Subcategories Dropdown */}
                    {expandedCategory === group.name && group.subcategories.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-2">
                        {group.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => handleSubcategoryClick(group.name, sub)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${activeSubcategory === sub ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
          <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h1 className="text-2xl font-bold">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h1>
              {activeSubcategory && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" /> {activeSubcategory}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium bg-card px-3 py-1 rounded-full border border-border">{filteredProducts.length} Results</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-card border border-border/50 rounded-3xl p-16 text-center shadow-sm">
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setActiveCategory('All'); setActiveSubcategory(null); setExpandedCategory(null); setSearchQuery(''); setPriceRange(5000000); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <div className="bg-card border border-border/50 rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="aspect-square bg-muted/30 rounded-2xl mb-4 overflow-hidden relative">
                      <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 p-4" />
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toast.error('Please view the product to save it to your wishlist.');
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Heart className={`w-4 h-4 ${wishlistItems.includes(product.slug) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-foreground'}`} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <span className="text-[10px] font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {product.subcategory}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <p className="font-black text-lg">₦{product.price.toLocaleString()}</p>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ChevronRight className="w-4 h-4" />
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/10 pt-8 pb-24 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
