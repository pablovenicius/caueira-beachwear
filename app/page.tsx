import { getActiveProducts } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawer } from '@/components/CartDrawer';
import { ShopGrid } from '@/components/ShopGrid';
import { TrustBand } from '@/components/TrustBand';
import { Testimonials } from '@/components/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// Revalida a listagem a cada 60s — tempo o bastante pra refletir mudanças
// feitas no /admin sem recarregar a cada clique.
export const revalidate = 60;

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />

      <main>
        <Hero />
        <ShopGrid title="Mais desejados" subtitle="Peças em destaque no momento" products={products} />
        <TrustBand />
        <Testimonials />
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav />
      <WhatsAppButton />
    </>
  );
}
