import { Reveal } from '@/components/Reveal';

const VALUES = ['Tecido premium', 'Proteção UV50+', 'Caimento sem marcas', 'Entrega em todo o Brasil'];

/**
 * Bloco de marca em tela cheia — claro, quieto, generoso em espaço em
 * branco, como a página de manifesto de uma grife de resort wear: a frase
 * em serifada itálica é o centro das atenções, sem fundo escuro, sem
 * gradiente, sem nada competindo com ela.
 */
export function Manifesto() {
  return (
    <section className="relative isolate overflow-hidden bg-areia-50 py-28 text-center md:py-40">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6">
        <Reveal className="flex items-center gap-3">
          <span className="h-px w-8 bg-terra/40" aria-hidden />
          <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-terra">Caueira Beachwear</span>
          <span className="h-px w-8 bg-terra/40" aria-hidden />
        </Reveal>

        <Reveal delay={100}>
          <p className="text-pretty font-display text-[32px] italic leading-[1.2] text-tinta md:text-[52px] lg:text-[60px]">
            Não vestimos corpos.
            <br />
            Celebramos cada um deles.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-lg text-pretty text-[15px] leading-relaxed text-tinta/60 md:text-base">
            Cada peça é desenhada pra acompanhar o movimento real de um dia de praia — sem perder forma,
            sem perder cor, sem perder você de vista.
          </p>
        </Reveal>

        <Reveal
          delay={300}
          className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] uppercase tracking-[0.08em] text-tinta/50"
        >
          {VALUES.map((v) => (
            <span
              key={v}
              className="relative pl-6 first:pl-0 before:absolute before:left-0 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-terra/50 first:before:hidden"
            >
              {v}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
