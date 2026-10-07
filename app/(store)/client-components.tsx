
'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-32 min-h-[80vh] flex items-center justify-center">
      
      
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none">
        <source src="/video/herovid.mp4" type="video/mp4" />
      </video>



      
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }} className="max-w-4xl mx-auto space-y-8">
          <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold shadow-sm border border-white/20">
            <Star className="w-4 h-4 text-amber-400" /> Leading Tech Retailer in West Africa
          </motion.div>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.1]">
            Upgrade Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x drop-shadow-sm">Digital Experience</span>
          </motion.h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
            Premium hardware, smartphones, and Starlink installations delivered with professional care. Experience the future of technology with EagleTech.
          </motion.p>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full shadow-lg bg-white text-black hover:bg-slate-200 font-bold border-0">
              Shop Hardware
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10 font-bold backdrop-blur-sm">
              <Link href="/services/starlink-installation">
                Book Starlink Setup <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <Button variant="ghost" className="text-primary hover:bg-primary/10">
        View All <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}
