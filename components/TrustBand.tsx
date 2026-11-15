const POINTS = [
  {
    title: 'Frete grátis acima de R$ 399',
    body: 'Calculado automaticamente no fechamento do pedido.',
  },
  {
    title: 'Troca grátis em até 30 dias',
    body: 'Não serviu ou não era bem o que você esperava? Trocamos sem custo.',
  },
  {
    title: '5% de desconto no Pix',
    body: 'Ou em até 3x sem juros no cartão, do jeito que preferir pagar.',
  },
];

/**
 * O único bloco de cor cheia da página — todo o resto da loja fica em tons
 * claros de areia, então este respiro escuro é o momento "de revista" entre
 * a vitrine e as avaliações.
 */
export function TrustBand() {
  return (
    <section aria-label="Por que comprar na Caueira" className="border-y border-sol/15 bg-mar-700 py-16 text-areia-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_1fr] md:gap-16">
        <div className="flex flex-col gap-4">
          <p className="font-display text-pretty text-3xl italic leading-tight md:text-4xl">
            Peças pensadas pra um dia inteiro de sol, água salgada e areia — sem perder a forma.
          </p>
          <p className="max-w-prose text-[15px] leading-relaxed text-areia-50/80">
            Cada biquíni e maiô passa por três lavagens de teste antes de chegar na loja. Se alguma peça não
            aguentar o seu verão, a troca é por nossa conta.
          </p>
        </div>

        <dl className="flex flex-col gap-6">
          {POINTS.map((p) => (
            <div key={p.title} className="border-t border-areia-50/20 pt-5 first:border-t-0 first:pt-0">
              <dt className="text-lg">{p.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-areia-50/75">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
