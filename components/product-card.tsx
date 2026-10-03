'use client';

import { Product } from '@/types';
import { Button } from './ui/button';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-3 shadow-md backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/30"
    >
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-sm font-medium text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Brand Badge */}
          {product.brand && (
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black shadow-sm backdrop-blur-md">
              {product.brand}
            </div>
          )}
          
          {/* Inner gradient shadow for a premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        <div className="flex flex-1 flex-col pt-5 pb-2 px-2">
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-foreground">{product.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </Link>
        
        <div className="mt-6 flex items-center justify-between px-2 pb-1">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-primary">₦{product.price.toLocaleString()}</span>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
              toast.success(`${product.title} added to cart!`);
            }} 
            size="icon"
            className="h-11 w-11 rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 z-10 relative"
          >
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </Button>
        </div>
    </motion.div>
  );
}
