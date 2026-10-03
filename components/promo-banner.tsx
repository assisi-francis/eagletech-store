'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Megaphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PromoBanner() {
  const [campaign, setCampaign] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .catch(() => ({ data: null }));

      if (data) {
        setCampaign(data);
        setIsVisible(true);
      }
    }
    fetchCampaign();
  }, []);

  if (!campaign) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative bg-emerald-500 text-white overflow-hidden"
        >
          {/* Optional Background Image */}
          {campaign.banner_image && (
            <div className="absolute inset-0 z-0">
              <img src={campaign.banner_image} className="w-full h-full object-cover opacity-20" alt="" />
            </div>
          )}
          <div className="container mx-auto px-4 py-3 relative z-10 flex items-center justify-center text-center">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 animate-pulse">
                <Megaphone className="w-4 h-4 text-white" />
              </span>
              <p className="text-sm md:text-base font-bold">
                {campaign.title} - <span className="text-yellow-300">{campaign.discount_percentage}% OFF!</span>
                <span className="font-normal opacity-90 ml-2 hidden sm:inline">{campaign.description}</span>
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
