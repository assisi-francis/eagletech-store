import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EagleTech Store',
  description: 'High-performance e-commerce store and field service booking platform.',
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
