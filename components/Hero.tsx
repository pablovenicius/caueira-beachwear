'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

const HEROES = [
  {
    kicker: 'Coleção verão',
    title: 'Pele no sol,\npés n’areia.',
    body: 'Biquínis e maiôs modelados pra se mover com você — do mergulho ao fim de tarde.',
    cta: 'Ver coleção',
    href: '/categoria/lancamentos',
    sky: 'radial-gradient(130% 100% at 15% 100%, #FFB238 0%, #FF5B3C 38%, #B8311A 62%, #0B2436 100%)',
  },
  {
    kicker: 'Maiôs · peça única',
    title: 'Linhas que\nabraçam.',
    body: 'Caimento sem marcas, tecido que não desbota e proteção UV50+ em cada peça.',
    cta: 'Ver maiôs',
    href: '/categoria/maios',
    sky: 'radial-gradient(130% 100% at 85% 100%, #FFB238 0%, #FF5B3C 36%, #93301B 64%, #061722 100%)',
  },
  {
    kicker: 'Só esta semana',
    title: 'Fim de tarde\nem promoção.',
    body: 'Até 15% off em peças selecionadas enquanto durar o estoque.',
    cta: 'Ver promoções',
    href: '/categoria/promocoes',
    sky: 'radial-gradient(130% 100% at 15% 100%, #FFCF6B 0%, #FF5B3C 40%, #0B2436 100%)',
  },
];

/**
 * Painéis em scroll-snap horizontal — no touch, dá pra arrastar com o dedo
 * como num carrossel de app de verdade, não só esperar o timer ou acertar
 * uma bolinha minúscula. O título sangra até a borda esquerda da tela
 * (sem padding simétrico) pra parecer recorte editorial, não um cartão
 * centralizado genérico.
 */
export function Hero() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section aria-label="Destaques" className="relative">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="no-scrollbar flex h-[78vh] max-h-[680px] min-h-[460px] snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {HEROES.map((hero) => (
          <div key={hero.title} className="relative flex h-full w-full shrink-0 snap-center items-end overflow-hidden">
            <div className="absolute inset-0" style={{ background: hero.sky }} />
            <div className="absolute inset-0 bg-gradient-to-t from-mar-700/70 via-transparent to-transparent" />

            <div className="relative flex w-full flex-col gap-3 py-12 pl-5 pr-8 md:py-16 md:pl-10">
              <span className="text-[13px] font-medium text-areia-50/80">{hero.kicker}</span>
              <h1 className="whitespace-pre-line text-pretty font-display text-[56px] italic leading-[0.96] text-areia-50 md:text-[104px]">
                {hero.title}
              </h1>
              <p className="max-w-[300px] text-[15px] leading-relaxed text-areia-50/85 md:max-w-sm">{hero.body}</p>
              <Link href={hero.href}
                className="mt-2 inline-flex h-[50px] w-fit items-center bg-areia-50 px-7 text-sm font-semibold text-tinta transition hover:bg-white">
                {hero.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-1.5">
        {HEROES.map((h, i) => (
          <span key={h.title} aria-hidden className="h-1 rounded-full bg-areia-50 transition-all duration-300"
            style={{ width: i === active ? 24 : 7, opacity: i === active ? 1 : 0.45 }} />
        ))}
      </div>
    </section>
  );
}
