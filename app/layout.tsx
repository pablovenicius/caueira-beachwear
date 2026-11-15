import type { Metadata, Viewport } from 'next';
import { Fraunces, Archivo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});
const archivo = Archivo({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-archivo', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#0C0D10',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: 'Caueira Beachwear — Biquínis e Moda Praia', template: '%s | Caueira Beachwear' },
  description: 'Biquínis, maiôs e saídas de praia com proteção UV50+. Frete grátis acima de R$ 399 e 5% off no PIX.',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Caueira Beachwear', images: ['/og-image.png'] },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${archivo.variable}`}>
      <body className="bg-areia-50 font-sans text-tinta antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
