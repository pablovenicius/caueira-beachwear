import { getActiveProducts } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawer } from '@/components/CartDrawer';
import { ShopGrid } from '@/components/ShopGrid';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { TrustBand } from '@/components/TrustBand';
import { Testimonials } from '@/components/Testimonials';
import { WhatsAppButton } from '@/components/WhatsAppButton';

// Revalida a listagem a cada 60s — tempo o bastante pra refletir mudanças
// feitas no /admin sem recarregar a cada clique.
export const revalidate = 60;

export default async function Home() {
  const products = await getActiveProducts();

  // Imagens reais dos blocos de colagem (CategoryShowcase) — pega as duas
  // primeiras fotos de cada categoria já carregada, pra não depender de
  // assets extras só pra essa vitrine editorial.
  const byCategory = (cat: string) => products.filter((p) => p.category === cat && p.image_url);
  const biquinis = byCategory('Biquínis');
  const maios = byCategory('Maiôs');

  // Sem uma segunda foto distinta, a colagem fica com um bloco neutro em vez de
  // repetir a mesma imagem (e não duplicar a foto que já aparece em "Mais desejados").
  const foto = (p?: (typeof products)[number]) =>
    p?.image_url ? { src: p.image_url, alt: p.name } : null;
  const fotoSecundaria = (lista: typeof products) =>
    lista[1]?.image_url ? { src: lista[1].image_url, alt: lista[1].name } : null;

  return (
    <>
      <Header />

      <main>
        <Hero />

        <CategoryShowcase
          kicker="Biquínis"
          title="Conjuntos que acompanham cada movimento"
          body="Caimento estudado pra não marcar, tecido com proteção UV50+ e combinações de top e calcinha pensadas pra montar o seu jeito de usar."
          href="/categoria/biquinis"
          mainImage={foto(biquinis[0])}
          secondaryImage={fotoSecundaria(biquinis)}
        />

        <ShopGrid title="Mais desejados" subtitle="Peças em destaque no momento" products={products} />

        <CategoryShowcase
          kicker="Maiôs"
          title="Peça única, caimento impecável"
          body="Sem marcas, sem desbotar — pensado pra quem passa o dia inteiro entre o sol e a água e quer se sentir bem em cada ângulo."
          href="/categoria/maios"
          mainImage={foto(maios[0])}
          secondaryImage={fotoSecundaria(maios)}
          reverse
        />

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
