import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Branding & About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tight">EagleTech</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premier destination for premium hardware, smartphones, and certified Starlink installations across West Africa.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Shop Hardware</Link>
              </li>
              <li>
                <Link href="/services/starlink-installation" className="hover:text-white transition-colors">Starlink Installation</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">Tech Support</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Device Repairs</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Network Setup</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">Consulting</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span>12 Tech Avenue, Victoria Island, Lagos, Nigeria</span>
              </li>
              <li>
                <span>+234 800 EAGLE TECH</span>
              </li>
              <li>
                <a href="mailto:support@eagletech.com" className="hover:text-white transition-colors">support@eagletech.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EagleTech Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
