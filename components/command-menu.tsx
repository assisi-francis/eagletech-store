'use client'
import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { mockProducts } from '@/lib/data'
import { Search } from 'lucide-react'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/60 backdrop-blur-md transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 mx-4">
        <div className="flex items-center px-4 py-3 border-b border-border/50 bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <Command.Input 
            autoFocus
            placeholder="Search products, brands, or categories..." 
            className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60 focus:ring-0 p-2"
          />
        </div>
        
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="py-12 text-center text-muted-foreground text-sm font-medium">
            No products found.
          </Command.Empty>

          <Command.Group heading="Products" className="text-xs font-semibold text-muted-foreground px-2 py-3 uppercase tracking-wider">
            {mockProducts.map((product) => (
              <Command.Item
                key={product.id}
                value={product.title + ' ' + product.brand + ' ' + (product as any).category}
                onSelect={() => {
                  router.push(`/product/${product.id}`) 
                  setOpen(false)
                }}
                className="flex items-center gap-4 p-3 mt-1 rounded-xl cursor-pointer hover:bg-primary/5 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-white flex-shrink-0 overflow-hidden shadow-sm border border-border/30">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground group-aria-selected:text-primary">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </div>
                <span className="font-bold text-sm">₦{product.price.toLocaleString()}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  )
}
