import { getActiveProducts } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ShopGrid } from '@/components/ShopGrid';
import { Testimonials } from '@/components/Testimonials';

// Revalida a listagem a cada 60s — tempo o bastante pra refletir mudanças
// feitas no /admin sem recarregar a cada clique.
export const revalidate = 60;

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <>
      <div className="bg-cafe py-2 text-center text-xs uppercase tracking-wider text-areia-50">
        Frete grátis acima de R$ 399 · 3x sem juros · 5% off no PIX · Troca grátis em 30 dias
      </div>

      <Header />

      <main>
        <Hero />
        <ShopGrid title="Mais desejados" subtitle="Peças em destaque no momento" products={products} />
        <Testimonials />
      </main>

      <Footer />
      <CartDrawer />
    </>
  );
}
