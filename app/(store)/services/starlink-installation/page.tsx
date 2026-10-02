'use client';

import { motion } from 'framer-motion';
import { mockProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StarlinkInstallationPage() {
  const installationServices = mockProducts.filter(
    (p) => p.is_service && p.slug.includes('starlink') || p.slug.includes('setup')
  );

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-12 max-w-3xl">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary px-0 mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Store
          </Link>
        </Button>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Starlink Installation Plans</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          Choose the perfect installation package for your Starlink kit. Our certified engineers will ensure optimal placement, weather-proofing, and maximum speed for your location.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" /> 100% Signal Optimization Guarantee
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" /> Professional Cable Routing
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" /> Post-Installation Support
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" /> Same-Day Availability
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {installationServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={service} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
