import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = { title: 'Perguntas frequentes' };

const FAQ = [
  {
    q: 'Quanto tempo leva pra chegar o meu pedido?',
    a: 'O prazo varia pela sua região e aparece no checkout antes de você confirmar a compra. Em geral, capitais do Nordeste e Sudeste recebem entre 3 e 7 dias úteis após a confirmação do pagamento.',
  },
  {
    q: 'Qual o prazo pra troca?',
    a: '30 dias corridos a partir do recebimento, sem custo de frete pra você. Veja o passo a passo na nossa página de trocas e devoluções.',
  },
  {
    q: 'Como sei qual o meu tamanho?',
    a: 'As peças seguem a numeração P, M, G e GG padrão brasileira. Se tiver dúvida entre dois tamanhos, manda uma mensagem no WhatsApp com suas medidas que te ajudamos a escolher.',
  },
  {
    q: 'Quais formas de pagamento vocês aceitam?',
    a: 'Pix (com 5% de desconto), cartão de crédito em até 3x sem juros, e boleto — tudo processado com segurança pelo Mercado Pago.',
  },
  {
    q: 'Como acompanho meu pedido?',
    a: 'Acesse "Meus pedidos" no menu da sua conta, no topo do site, pra ver o status de pagamento e os dados de entrega de cada compra.',
  },
  {
    q: 'As peças têm proteção UV?',
    a: 'Sim — o tecido de todas as peças tem proteção UV50+, ideal pra longas horas de sol.',
  },
];

export default function AjudaPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="font-display text-3xl font-normal text-tinta">Perguntas frequentes</h1>

        <div className="flex flex-col divide-y divide-areia-300 border-y border-areia-300">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-tinta">
                {item.q}
                <span aria-hidden className="flex-none text-tinta/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2.5 text-[15px] leading-relaxed text-tinta/75">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="text-[15px] text-tinta/70">
          Não encontrou o que procurava?{' '}
          <Link href="/politicas/trocas-e-devolucoes" className="text-mar underline">Veja nossa política de trocas</Link>{' '}
          ou fale com a gente pelo WhatsApp, no canto da tela.
        </p>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
