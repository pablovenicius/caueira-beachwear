import { Reveal } from '@/components/Reveal';

const VALUES = ['Tecido premium', 'Proteção UV50+', 'Caimento sem marcas', 'Entrega em todo o Brasil'];

/**
 * Bloco de marca em tela cheia, escuro — quebra de propósito o ritmo claro
 * do resto da página (como marcas de alto padrão fazem pra dar peso a uma
 * frase-manifesto). Esferas de luz douradas em lenta deriva + grão sutil
 * dão o acabamento "tech/premium" sem recorrer a imagem nenhuma.
 */
export function Manifesto() {
  return (
    <section className="cut-both relative isolate overflow-hidden bg-noite py-28 text-center md:py-40">
      <div className="pointer-events-none absolute -left-24 top-0 h-[26rem] w-[26rem] rounded-full bg-rosa/20 blur-3xl orb-float" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sol/25 blur-3xl orb-float-slow" aria-hidden />
      <span className="grain-overlay" aria-hidden />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6">
        <Reveal className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-sol" aria-hidden />
          <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-sol">Caueira Beachwear</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-sol" aria-hidden />
        </Reveal>

        <Reveal delay={100}>
          <p className="text-gradient-sunset text-pretty font-display text-[36px] italic leading-[1.15] md:text-[58px] lg:text-[68px]">
            Não vestimos corpos.
            <br />
            Celebramos cada um deles.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-lg text-pretty text-[15px] leading-relaxed text-areia-200/70 md:text-base">
            Cada peça é desenhada pra acompanhar o movimento real de um dia de praia — sem perder forma,
            sem perder cor, sem perder você de vista.
          </p>
        </Reveal>

        <Reveal
          delay={300}
          className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-areia-200/80"
        >
          {VALUES.map((v) => (
            <span
              key={v}
              className="relative pl-6 first:pl-0 before:absolute before:left-0 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-sol/60 first:before:hidden"
            >
              {v}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
