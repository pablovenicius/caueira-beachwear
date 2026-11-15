'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const ROTATE_MS = 5500;

/**
 * O hero deixou de ser três painéis de cor que o visitante tinha que
 * arrastar — agora é um único vídeo de fundo (gerado especialmente pra
 * marca: sol, luz e mar, num loop perfeito de 8s, sem repetição visível)
 * com um painel de vidro (glass) sobrepondo a mensagem. O texto alterna
 * sozinho a cada ~5,5s com um fade — um único momento de movimento
 * orquestrado, em vez de animação espalhada pela página. Os pontinhos
 * embaixo continuam clicáveis pra quem quiser pular direto pra uma oferta.
 */
export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section aria-label="Destaques" className="relative h-[86vh] max-h-[760px] min-h-[520px] overflow-hidden bg-mar-700">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/video/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/hero-video.webm" type="video/webm" />
        <source src="/video/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-mar-700/85 via-mar-700/15 to-mar-700/35" />

      <div className="relative flex h-full w-full items-end px-5 pb-16 md:items-center md:px-10 md:pb-0">
        <div
          key={active}
          className="w-full max-w-[420px] animate-[heroFade_0.6s_ease-out] rounded-sm border border-sol/25 bg-mar-700/55 p-6 shadow-glow backdrop-blur-md md:max-w-[460px] md:p-8"
        >
          <span className="text-[13px] font-medium text-sol/90">{slide.kicker}</span>
          <h1 className="mt-2 whitespace-pre-line text-pretty font-display text-[42px] italic leading-[0.98] text-areia-50 md:text-[64px]">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-areia-50/80">{slide.body}</p>
          <Link
            href={slide.href}
            className="mt-5 inline-flex h-[48px] w-fit items-center border border-sol/40 bg-areia-50 px-7 text-sm font-semibold text-tinta transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1.5 md:bottom-7">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-label={`Ver destaque ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className="h-1 rounded-full bg-sol transition-all duration-300"
            style={{ width: i === active ? 26 : 7, opacity: i === active ? 1 : 0.4 }}
          />
        ))}
      </div>
    </section>
  );
}
