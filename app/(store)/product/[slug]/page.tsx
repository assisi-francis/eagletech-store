'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find((p) => p.slug === params.slug);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary px-0"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted border border-border/50 shadow-xl"
        >
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-lg font-medium text-muted-foreground">
              No Image
            </div>
          )}
          {product.brand && (
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-black shadow-md backdrop-blur-md">
              {product.brand}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert">
            <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="pt-4 pb-8 border-t border-b border-border/40 space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>1 Year Warranty Included</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Truck className="w-5 h-5 text-blue-500" />
              <span>Free Delivery in Lagos</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              <span>7-Day Return Policy</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => addItem(product)}
              className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
