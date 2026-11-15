import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ProductDetail } from '@/components/ProductDetail';

export const revalidate = 60;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);
  return { title: product?.name ?? 'Produto' };
}

export default async function ProdutoPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
      <CartDrawer />
      <BottomNav />
      <WhatsAppButton hideOnMobile />
    </>
  );
}
