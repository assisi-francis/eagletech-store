import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EagleTech Store',
  description: 'High-performance e-commerce store and field service booking platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
