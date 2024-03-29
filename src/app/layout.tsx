import type { Metadata } from 'next';
import { Raleway, Geologica, Lora } from 'next/font/google';

import meta from '@/data/meta';

import './globals.css';
import { Header } from '../layout/Header';
import { Footer } from '@/layout/Footer';

const raleway = Raleway({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
});

const geologica = Geologica({
  subsets: ['cyrillic'],
  weight: ['200', '300', '400', '500', '700'],
  variable: '--font-geologica',
  display: 'swap',
  adjustFontFallback: false,
});
const lora = Lora({
  subsets: ['cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-lora',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = meta;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth">
      <body
        className={`${raleway.variable} ${geologica.variable} ${lora.variable}`}
      >
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
