'use client';

import Link from 'next/link';
import { Mail, ArrowRight, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-border/40 pt-16 pb-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-slate-950 dark:bg-black rounded-lg flex items-center justify-center shadow-sm border border-blue-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
                <span className="absolute z-20 text-[12px] scale-x-[-1] -mt-1 drop-shadow-sm">🦅</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 tracking-tight">
                  EAGLE<span className="text-slate-900 dark:text-white">TECH</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium hardware, reliable networking equipment, and expert field service installations—all in one place.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Github className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=macbook" className="text-sm text-muted-foreground hover:text-primary transition-colors">MacBooks</Link></li>
              <li><Link href="/shop?category=starlink" className="text-sm text-muted-foreground hover:text-primary transition-colors">Starlink Kits</Link></li>
              <li><Link href="/shop?category=cctv" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security Cameras</Link></li>
              <li><Link href="/shop?category=networking" className="text-sm text-muted-foreground hover:text-primary transition-colors">Networking Gear</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Book Installation</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="font-bold mb-4">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground mb-4">Get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-10 pr-12 rounded-full border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EagleTech Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
