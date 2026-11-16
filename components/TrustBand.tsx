import { CountUpStat } from '@/components/CountUpStat';
import { Reveal } from '@/components/Reveal';

const STATS = [
  { value: '+50', label: 'mil clientes satisfeitas' },
  { value: '30', label: 'dias pra trocar sem custo' },
  { value: '5%', label: 'de desconto à vista no Pix' },
  { value: 'UV50+', label: 'de proteção em cada peça' },
];

/**
 * Referência do cliente (site da Bautz): em vez do bloco de cor cheia que
 * a loja tinha antes, uma faixa clara com números grandes em serifada —
 * o mesmo recurso que a Bautz usa pra credibilidade ("+50 anos de mercado").
 */
export function TrustBand() {
  return (
    <section aria-label="Por que comprar na Caueira" className="border-y border-areia-200 bg-areia-100 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-center font-display text-3xl text-tinta md:text-4xl">
          Peças pensadas pra um dia inteiro de sol, água salgada e areia — sem perder a forma.
        </p>

        <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} as="div" className="flex flex-col items-center gap-1.5 text-center">
              <dt className="font-display text-4xl text-terra md:text-5xl">
                <CountUpStat value={s.value} />
              </dt>
              <dd className="max-w-[12ch] text-[13px] leading-snug text-mar">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
