import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = { title: 'Trocas e devoluções' };

export default function TrocasEDevolucoesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="font-display text-3xl font-normal text-tinta">Trocas e devoluções</h1>

        <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-tinta/80">
          <p>
            Você tem até <strong className="font-medium text-tinta">30 dias corridos</strong>, a partir do recebimento, pra
            trocar qualquer peça que não serviu ou não era bem o que esperava — sem custo de frete pra você.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Como pedir uma troca</h2>
            <ol className="flex list-decimal flex-col gap-1.5 pl-5">
              <li>Fale com a gente pelo WhatsApp ou e-mail (no rodapé desta página) com o número do pedido.</li>
              <li>Combinamos o tamanho/cor novos e o jeito mais fácil de devolver a peça atual.</li>
              <li>Assim que a peça original chegar de volta, enviamos a troca em até 3 dias úteis.</li>
            </ol>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Condições da peça</h2>
            <p>
              Pra aceitar a troca, a peça precisa estar sem uso, com a etiqueta e a parte de proteção de higiene
              (quando aplicável) intactas, e na embalagem original.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Arrependimento da compra</h2>
            <p>
              Se preferir devolver e ser reembolsada em vez de trocar, isso também está garantido em até 7 dias
              corridos do recebimento, conforme o Código de Defesa do Consumidor (art. 49) para compras feitas fora
              de loja física. O reembolso é feito no mesmo meio de pagamento usado na compra.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Peça com defeito</h2>
            <p>
              Recebeu alguma peça com defeito de fabricação? Nos avise em até 90 dias (prazo legal pra produtos
              duráveis) e resolvemos com troca, conserto ou reembolso — o que fizer mais sentido pro seu caso.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
