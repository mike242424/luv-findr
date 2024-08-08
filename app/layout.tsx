import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import QueryClientContextProvider from '@/contexts/query-client-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/ui/footer';

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
      <body className={`${nunito.className} flex flex-col min-h-screen`}>
        <QueryClientContextProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
