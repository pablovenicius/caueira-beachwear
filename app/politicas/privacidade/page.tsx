import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = { title: 'Política de privacidade' };

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <h1 className="font-display text-3xl font-normal text-tinta">Política de privacidade</h1>
        <p className="text-sm text-tinta/50">Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</p>

        <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-tinta/80">
          <p>
            A Caueira Beachwear respeita sua privacidade e trata seus dados pessoais de acordo com a Lei Geral de
            Proteção de Dados (LGPD — Lei nº 13.709/2018). Esta página explica quais dados coletamos, pra que
            servem e quais direitos você tem sobre eles.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Quais dados coletamos</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Nome, e-mail e senha, quando você cria uma conta.</li>
              <li>Telefone e endereço de entrega, quando você faz um pedido.</li>
              <li>Histórico de pedidos e itens comprados.</li>
              <li>Dados de pagamento são processados direto pelo Mercado Pago — não guardamos número de cartão em nenhum momento.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Para que usamos esses dados</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Processar e entregar seus pedidos.</li>
              <li>Avisar sobre o status da compra (confirmação de pagamento, envio).</li>
              <li>Responder dúvidas e pedidos de troca.</li>
              <li>Enviar novidades por e-mail, só se você se inscrever na newsletter — você pode cancelar quando quiser.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Com quem compartilhamos</h2>
            <p>
              Só com quem precisa pra concluir a compra: o Mercado Pago (pagamento) e a transportadora (entrega).
              Não vendemos nem alugamos seus dados pra terceiros.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-normal text-tinta">Seus direitos</h2>
            <p>
              Você pode pedir a qualquer momento pra ver, corrigir ou apagar seus dados, ou pra saber com quem eles
              foram compartilhados. É só falar com a gente pelos contatos no rodapé do site.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <BottomNav />
    </>
  );
}
