'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  {
    kicker: 'Coleção verão',
    title: 'Pele no sol,\npés n’areia.',
    body: 'Biquínis e maiôs modelados pra se mover com você — do mergulho ao fim de tarde.',
    cta: 'Ver coleção',
    href: '/categoria/lancamentos',
  },
  {
    kicker: 'Maiôs · peça única',
    title: 'Linhas que\nabraçam.',
    body: 'Caimento sem marcas, tecido que não desbota e proteção UV50+ em cada peça.',
    cta: 'Ver maiôs',
    href: '/categoria/maios',
  },
  {
    kicker: 'Só esta semana',
    title: 'Fim de tarde\nem promoção.',
    body: 'Até 15% off em peças selecionadas enquanto durar o estoque.',
    cta: 'Ver promoções',
    href: '/categoria/promocoes',
  },
];

const ROTATE_MS = 6000;

/**
 * Quarta reformulação: ruptura real de layout, não um retoque em cima do
 * fundo claro de sempre. Fundo quase-preto (noite), título gigante
 * preenchido com o gradiente da marca, uma luz que segue o cursor
 * revelando o grão por baixo (só desktop, com mouse de verdade), foto
 * levemente rotacionada feito uma polaroid — e a seção inteira termina
 * num corte diagonal, não numa linha reta, pra já avisar que a página não
 * vai ser uma pilha de retângulos.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      spot.style.setProperty('--x', `${e.clientX - rect.left}px`);
      spot.style.setProperty('--y', `${e.clientY - rect.top}px`);
      spot.style.opacity = '1';
    };
    const onLeave = () => {
      spot.style.opacity = '0';
    };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const slide = SLIDES[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Destaques"
      className="relative isolate min-h-[640px] overflow-hidden bg-noite md:min-h-[92vh]"
    >
      {/* luz que segue o cursor — revela o grão por baixo, só onde o mouse
          passa. Decorativa, opacidade 0 até o primeiro movimento. */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hidden md:block"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(232,83,122,0.16), transparent 70%)',
        }}
        aria-hidden
      />
      <span className="grain-overlay" aria-hidden />

      {/* esferas de luz em deriva — mesmo truque do Manifesto, pra ter a
          cara da mesma família visual. */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-rosa/25 blur-3xl orb-float" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sol/20 blur-3xl orb-float-slow" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:px-10 md:py-28">
        <div key={active} className="flex flex-col gap-5">
          <span className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-rosa">
            <span className="h-1.5 w-1.5 rounded-full bg-rosa pulse-dot" aria-hidden />
            {slide.kicker}
          </span>
          <h1 className="text-pretty font-display text-[54px] leading-[0.95] md:text-[88px] lg:text-[104px]">
            {slide.title.split('\n').map((line, i) => (
              <span
                key={`${active}-${i}`}
                className="text-gradient-sunset line-rise"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-areia-200/70">{slide.body}</p>

          <div className="relative mt-2 w-fit">
            <Link
              href={slide.href}
              className="group relative inline-flex h-[54px] items-center overflow-hidden rounded-full border border-sol/40 bg-gradient-to-r from-rosa to-sol px-8 text-sm font-semibold text-noite transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <span className="relative z-[1]">{slide.cta}</span>
              <span className="shimmer-sweep" aria-hidden />
            </Link>
          </div>

          <div className="mt-2 flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ver destaque ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className="h-[3px] rounded-full bg-gradient-to-r from-rosa to-sol transition-all duration-300"
                style={{ width: i === active ? 28 : 10, opacity: i === active ? 1 : 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* foto — levemente rotacionada feito uma polaroid, friso dourado,
            em vez de uma moldura retinha e previsível. */}
        <div className="relative mx-auto hidden aspect-[3/4] w-full max-w-[380px] rotate-[2.5deg] overflow-hidden rounded-sm ring-1 ring-sol/50 shadow-glow transition-transform duration-500 hover:rotate-0 md:block">
          <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="h-full w-full object-cover object-top">
            <source src="/video/hero-video.webm" type="video/webm" />
            <source src="/video/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-areia-50/20" aria-hidden />
        </div>

        {/* mobile: vídeo atrás do texto, sem a moldura rotacionada (não há
            espaço pra girar nada numa tela estreita). */}
        <div className="absolute inset-0 -z-10 md:hidden" aria-hidden>
          <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="h-full w-full object-cover object-top opacity-30">
            <source src="/video/hero-video.webm" type="video/webm" />
            <source src="/video/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/80 to-noite/40" />
        </div>
      </div>
    </section>
  );
}
