import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import QueryClientContextProvider from '@/contexts/query-client-provider';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Luv Findr',
  description: 'Luv Findr',
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '900', '1000'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <QueryClientContextProvider>
          <Navbar />
          {children}
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
