import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';
import { CommandMenu } from '@/components/command-menu';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster position="bottom-right" richColors />
      <CommandMenu />
    </div>
  );
}
