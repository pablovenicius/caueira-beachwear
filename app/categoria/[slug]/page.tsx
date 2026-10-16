import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getActiveProducts } from '@/lib/supabase';
import type { Category } from '@/types/product';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ShopGrid } from '@/components/ShopGrid';

export const revalidate = 60;

const CATEGORY_MAP: Record<string, Category> = {
  biquinis: 'Biquínis',
  maios: 'Maiôs',
  'saidas-de-praia': 'Saídas de Praia',
};
const TITLES: Record<string, string> = {
  biquinis: 'Biquínis',
  maios: 'Maiôs',
  'saidas-de-praia': 'Saídas de Praia',
  lancamentos: 'Lançamentos',
  promocoes: 'Promoções',
};

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return Object.keys(TITLES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  return { title: TITLES[params.slug] ?? 'Categoria' };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = params;
  if (!TITLES[slug]) notFound();

  // "lançamentos" e "promoções" filtram pela tag em vez de uma categoria real
  const needsFullList = slug === 'lancamentos' || slug === 'promocoes';
  const fetched = needsFullList ? await getActiveProducts() : await getActiveProducts(CATEGORY_MAP[slug]);
  const products =
    slug === 'lancamentos' ? fetched.filter((p) => p.tag === 'Lançamento') :
    slug === 'promocoes' ? fetched.filter((p) => p.tag === 'Promoção') :
    fetched;

  return (
    <>
      <Header />
      <main>
        <ShopGrid
          title={TITLES[slug]}
          subtitle="Peças selecionadas"
          products={products}
          emptyMessage="Nenhuma peça encontrada nessa categoria ainda."
        />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
