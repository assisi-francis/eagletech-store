
import { supabase } from "@/lib/supabase";
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { HeroSection, SectionHeader } from './client-components'; // We'll extract client stuff

const categoryMap: Record<string, string> = {
  'dell-xps-15': 'Laptops',
  'google-pixel-8-pro': 'Phones',
  'crucial-x9-pro': 'Accessories',
  'sandisk-ultra-1tb': 'Accessories',
  'orico-enclosure': 'Accessories',
  'starlink-standard': 'Networking'
};
const brandMap: Record<string, string> = {
  'dell-xps-15': 'Dell',
  'google-pixel-8-pro': 'Google',
  'crucial-x9-pro': 'Crucial',
  'sandisk-ultra-1tb': 'SanDisk',
  'orico-enclosure': 'Orico',
  'starlink-standard': 'SpaceX'
};

export const revalidate = 0; // Disable caching so it always fetches fresh data

export default async function HomePage() {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(20);
  
  const mockProducts = (data || []).map((p: any) => ({ 
    ...p, 
    category: categoryMap[p.slug] || "Other", 
    brand: brandMap[p.slug] 
  }));

  const trendingProducts = mockProducts.filter((p: any) => p.category !== 'Accessories' && p.category !== 'Services');
  const accessoryProducts = mockProducts.filter((p: any) => p.category === 'Accessories');

  return (
    <div className="pb-24">
      <HeroSection />

      <section className="container mx-auto px-4 pt-20">
        <SectionHeader title="Trending Now" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 pt-20">
        <SectionHeader title="Essential Accessories" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessoryProducts.slice(0, 4).map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="rounded-3xl p-8 md:p-16 relative overflow-hidden bg-slate-900 shadow-2xl shadow-blue-900/20">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/1/1d/SpaceX_Starlink_User_Terminal_v2_%2851740775162%29.jpg')" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
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
        </div>
      </section>
    </div>
  );
}
