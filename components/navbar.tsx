'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { mockProducts } from '@/lib/data';
import { ShoppingCart, Menu, Search, User, Cpu, Zap } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.cartQuantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = mockProducts.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-slate-950 dark:bg-black rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/30 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] group-hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
              <div className="relative flex items-center justify-center w-full h-full">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-200 relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                  {/* Screen Frame */}
                  <rect x="2" y="5" width="20" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="rgba(0, 0, 0, 0.4)" />
                  {/* MacBook Base */}
                  <path d="M1 18h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {/* Trackpad notch indicator */}
                  <path d="M10 18h4" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {/* Eagle Emoji Flipped horizontally */}
                <span className="absolute z-20 text-[15px] scale-x-[-1] -mt-1.5 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                  🦅
                </span>
              </div>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-black text-xl leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 tracking-tight">
                EAGLE<span className="text-slate-900 dark:text-white">TECH</span>
              </span>
              <span className="text-[9px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-0.5">Hardware & Network</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4 bg-muted/30 p-1 rounded-full border border-border/50">
            <Link 
              href="/catalog" 
              className="px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              Catalog
            </Link>
            <Link 
              href="/catalog?category=macbook" 
              className="px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              MacBooks
            </Link>
            <Link 
              href="/catalog?category=starlink" 
              className="px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              Starlink
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 relative">
          
          <div className="hidden sm:flex items-center relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search products, brands..." 
                className="h-9 w-64 rounded-full border border-border bg-muted/50 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full mt-2 w-[400px] right-0 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-4 p-2 hover:bg-muted rounded-xl transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                        <div>
                          <p className="text-sm font-bold line-clamp-1">{product.title}</p>
                          <p className="text-xs text-muted-foreground">{product.brand} • ₦{product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/auth">
            <Button variant="ghost" size="icon" className="relative group">
              <User className="w-5 h-5 group-hover:text-primary transition-colors" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="relative border-border bg-transparent">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
