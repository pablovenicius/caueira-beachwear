import type { Metadata } from 'next';
import { Marcellus, Jost } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-marcellus', display: 'swap' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Caueira Beachwear — Biquínis e Moda Praia', template: '%s | Caueira Beachwear' },
  description: 'Biquínis, maiôs e saídas de praia com proteção UV50+. Frete grátis acima de R$ 399 e 5% off no PIX.',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Caueira Beachwear' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${marcellus.variable} ${jost.variable}`}>
      <body className="bg-areia-50 font-sans text-tinta antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
