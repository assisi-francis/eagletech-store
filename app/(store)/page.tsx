'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

import { mockProducts } from '@/lib/data';
import Link from 'next/link';

export default function HomePage() {
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllAccessories, setShowAllAccessories] = useState(false);

  const trendingProducts = mockProducts.filter(p => !p.id.startsWith('a') && !p.id.startsWith('s'));
  const accessoryProducts = mockProducts.filter(p => p.id.startsWith('a'));

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 min-h-[80vh] flex items-center justify-center">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video/herovid.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold shadow-sm border border-white/20"
            >
              <Star className="w-4 h-4 text-amber-400" /> Leading Tech Retailer in West Africa
            </motion.div>
            
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.1]"
            >
              Upgrade Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x drop-shadow-sm">
                Digital Experience
              </span>
            </motion.h1>
            
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md"
            >
              Premium hardware, smartphones, and Starlink installations delivered with professional care. Experience the future of technology with EagleTech.
            </motion.p>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full shadow-lg bg-white text-black hover:bg-slate-200 font-bold border-0">
                  Shop Hardware
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="/services/starlink-installation">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10 font-bold backdrop-blur-sm">
                    Book Starlink Setup <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:bg-primary/10"
            onClick={() => setShowAllTrending(!showAllTrending)}
          >
            {showAllTrending ? 'Show Less' : 'View All'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(showAllTrending ? trendingProducts : trendingProducts.slice(0, 4)).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Accessories Section */}
      <section className="container mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Essential Accessories</h2>
          <Button 
            variant="ghost" 
            className="text-primary hover:bg-primary/10"
            onClick={() => setShowAllAccessories(!showAllAccessories)}
          >
            {showAllAccessories ? 'Show Less' : 'View All'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(showAllAccessories ? accessoryProducts : accessoryProducts.slice(0, 4)).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Services Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="rounded-3xl p-8 md:p-16 relative overflow-hidden bg-slate-900 shadow-2xl shadow-blue-900/20">
          {/* Background Image with Shining Effect */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            style={{ 
              backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/1/1d/SpaceX_Starlink_User_Terminal_v2_%2851740775162%29.jpg')" 
            }}
          />
          {/* Glowing Gradients */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          {/* A shining glare effect */}
          <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[200%] bg-white/10 blur-[100px] z-0 transform rotate-12 pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-md">Expert Starlink Installation</h2>
            <p className="text-lg text-blue-50 mb-8 drop-shadow leading-relaxed">
              Don't just buy the hardware. Let our certified engineers handle the roof mounting, cabling, and Wi-Fi access point distribution for your home or office to ensure peak satellite visibility.
            </p>
            <Link href="/services/starlink-installation">
              <Button size="lg" className="rounded-full bg-white text-blue-950 hover:bg-slate-200 font-bold shadow-xl shadow-white/20 border-0 transition-all hover:scale-105">
                Book Installation
              </Button>
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-x-1/4 translate-y-1/4 z-10 text-white drop-shadow-2xl">
            {/* Decorative large icon for service */}
            <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
