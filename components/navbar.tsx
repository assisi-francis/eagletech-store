'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { mockProducts } from '@/lib/data';
import { ShoppingCart, Menu, Search, User, Cpu, Zap, LogOut, X, Plus, Minus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { syncCartFromSupabase } from '@/store/useCartStore';

export function Navbar() {
  const { items, removeItem, updateQuantity, getTotal, addItem } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.cartQuantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);
  const cartDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    }
    
    if (isProfileOpen || isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isCartOpen]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) syncCartFromSupabase();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        syncCartFromSupabase();
      } else if (event === 'SIGNED_OUT') {
        useCartStore.getState().clearCart();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const searchResults = mockProducts.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
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

          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || <User className="w-4 h-4" />}
                </div>
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-card border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                      <p className="text-sm font-semibold truncate">{user.user_metadata?.full_name || 'My Account'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-3 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors font-medium"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        Profile
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <button 
                        onClick={async () => {
                          await supabase.auth.signOut();
                          useCartStore.getState().clearCart();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10">
                <User className="w-5 h-5 group-hover:text-primary transition-colors" />
              </Button>
            </Link>
          )}

          <div className="relative" ref={cartDropdownRef}>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border-border bg-transparent"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Dropdown Cart UI */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-card border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-4 py-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    Your Cart
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
                      {itemCount}
                    </span>
                  </h2>
                </div>

                {/* Free Shipping Progress */}
                <div className="px-4 py-3 border-b border-border/50 bg-muted/10">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    {getTotal() >= 1000000 ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Free Premium Shipping Unlocked</span>
                      </div>
                    ) : (
                      <span>Add ₦{(1000000 - getTotal()).toLocaleString()} more for <span className="text-primary">Free Shipping</span></span>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ease-out rounded-full ${getTotal() >= 1000000 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${Math.min((getTotal() / 1000000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                  {items.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-70">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-semibold">Your cart is empty</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-xl object-cover bg-muted border border-border/50" />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-sm font-semibold line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.brand || 'EagleTech'}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-bold text-sm text-primary">₦{(item.price * item.cartQuantity).toLocaleString()}</p>
                            
                            <div className="flex items-center gap-2 bg-muted rounded-full p-0.5 border border-border/50">
                              <button 
                                className="w-5 h-5 rounded-full hover:bg-background flex items-center justify-center transition-colors disabled:opacity-50"
                                onClick={() => {
                                  if (item.cartQuantity > 1) updateQuantity(item.id, item.cartQuantity - 1);
                                  else removeItem(item.id);
                                }}
                              >
                                {item.cartQuantity === 1 ? <Trash2 className="w-3 h-3 text-destructive" /> : <Minus className="w-3 h-3" />}
                              </button>
                              <span className="text-xs font-semibold w-3 text-center">{item.cartQuantity}</span>
                              <button 
                                className="w-5 h-5 rounded-full hover:bg-background flex items-center justify-center transition-colors"
                                onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 1-Click Upsells */}
                {items.length > 0 && (
                  <div className="px-4 py-3 bg-muted/30 border-t border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground mb-2">FREQUENTLY BOUGHT TOGETHER</p>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {mockProducts.filter(p => p.category === 'Accessories').slice(0, 3).map(accessory => (
                        <div key={accessory.id} className="min-w-[120px] p-2 bg-card rounded-xl border border-border/50 flex flex-col gap-2 shrink-0">
                          <img src={accessory.images[0]} className="w-full h-12 object-cover rounded-md bg-muted" />
                          <div>
                            <p className="text-[10px] font-bold line-clamp-1">{accessory.title}</p>
                            <p className="text-[10px] text-primary font-bold">₦{accessory.price.toLocaleString()}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-6 text-[10px] w-full"
                            onClick={() => {
                              addItem(accessory);
                              toast.success(`${accessory.title} added!`);
                            }}
                          >
                            + Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer / Checkout */}
                {items.length > 0 && (
                  <div className="p-4 border-t border-border/50 bg-card shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-3 z-10">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-primary">₦{getTotal().toLocaleString()}</span>
                    </div>
                    
                    <Button className="w-full py-5 text-sm font-bold rounded-xl shadow-lg shadow-primary/20">
                      Secure Checkout
                    </Button>
                    
                    <div className="flex items-center justify-center gap-1.5 pt-1 opacity-60">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-[10px] font-medium">Secured with 256-bit Encryption</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
