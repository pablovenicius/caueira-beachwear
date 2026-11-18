'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    kicker: 'Coleção verão',
    title: 'Pele no sol, pés n’areia.',
    cta: 'Ver coleção',
    href: '/categoria/lancamentos',
  },
  {
    kicker: 'Maiôs · peça única',
    title: 'Linhas que abraçam.',
    cta: 'Ver maiôs',
    href: '/categoria/maios',
  },
  {
    kicker: 'Só esta semana',
    title: 'Fim de tarde em promoção.',
    cta: 'Ver promoções',
    href: '/categoria/promocoes',
  },
];

const ROTATE_MS = 6000;

/**
 * Referência: Lenny Niemeyer. A foto toma a tela inteira — do topo até a
 * borda inferior, sem header reservando altura em cima dela (o Header com
 * transparent=true flutua por cima, sem fundo, até a página rolar). Nada de
 * grade de duas colunas, card rotacionado ou texto gigante em gradiente:
 * uma legenda discreta no canto inferior, do jeito que uma vitrine de moda
 * de alto padrão deixa a imagem falar.
 */
export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section aria-label="Destaques" className="relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden bg-areia-200">
      <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="absolute inset-0 h-full w-full object-cover object-center">
        <source src="/video/hero-video.webm" type="video/webm" />
        <source src="/video/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-tinta/60 via-tinta/5 to-transparent" aria-hidden />

      <div key={active} className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-6 pb-20 md:px-12 md:pb-24">
        <span className="line-rise text-[12px] font-medium uppercase tracking-[0.22em] text-areia-50/80">{slide.kicker}</span>
        <h1 className="line-rise max-w-xl text-pretty font-display text-[30px] italic leading-[1.15] text-areia-50 md:text-[46px]" style={{ animationDelay: '80ms' }}>
          {slide.title}
        </h1>
        <Link
          href={slide.href}
          className="group mt-1 inline-flex w-fit items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-areia-50"
        >
          {slide.cta}
          <span className="h-px w-7 bg-areia-50 transition-all duration-300 group-hover:w-11" aria-hidden />
        </Link>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2 md:bottom-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Ver destaque ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className="h-[2px] rounded-full bg-areia-50 transition-all duration-300"
            style={{ width: i === active ? 26 : 10, opacity: i === active ? 1 : 0.4 }}
          />
        ))}
      </div>
    </section>
  );
}
