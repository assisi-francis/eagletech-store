import dynamic from 'next/dynamic';

const CheckoutClient = dynamic(() => import('@/components/checkout-client'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  )
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
