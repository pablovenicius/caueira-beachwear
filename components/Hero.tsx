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
    dot: 'bg-sol',
  },
  {
    kicker: 'Maiôs · peça única',
    title: 'Linhas que\nabraçam.',
    body: 'Caimento sem marcas, tecido que não desbota e proteção UV50+ em cada peça.',
    cta: 'Ver maiôs',
    href: '/categoria/maios',
    dot: 'bg-terra',
  },
  {
    kicker: 'Só esta semana',
    title: 'Fim de tarde\nem promoção.',
    body: 'Até 15% off em peças selecionadas enquanto durar o estoque.',
    cta: 'Ver promoções',
    href: '/categoria/promocoes',
    dot: 'bg-mar-100',
  },
];

const ROTATE_MS = 5500;

/**
 * Layout pedido pelo cliente, igual à referência (print do site da Bautz):
 * fundo claro, foto/vídeo sangrando a partir da direita com um degradê que
 * funde na cor de fundo (em vez de um painel escuro por cima), texto direto
 * no fundo, ícones sociais fixos na borda esquerda e um CTA em pill com um
 * pontinho decorativo no canto — sem caixa, sem vidro.
 *
 * O vídeo de fundo por enquanto é o gerado (sol/mar) — está preparado pra
 * trocar pelos arquivos reais (mulher na praia) assim que o cliente mandar,
 * bastando substituir /public/video/hero-video.mp4|webm|hero-poster.jpg.
 */
export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section aria-label="Destaques" className="relative min-h-[520px] overflow-hidden bg-areia-50 md:min-h-[640px]">
      {/* ícones sociais fixos na borda esquerda — só desktop, como na referência */}
      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        <a href="https://instagram.com/caueirabeachwear" target="_blank" rel="noreferrer" aria-label="Instagram"
          className="text-terra transition hover:text-terra-700">
          <InstagramIcon />
        </a>
        <a href="https://instagram.com/caueirabeachwear" target="_blank" rel="noreferrer" aria-label="Instagram"
          className="text-tinta/60 transition hover:text-tinta">
          <InstagramIcon />
        </a>
        <a href="https://wa.me/5579999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp"
          className="text-mar transition hover:text-mar-700">
          <WhatsAppIcon />
        </a>
      </div>

      {/* vídeo — nítido, corpo inteiro, sem corte e sem borrão. No mobile
          sangra por trás do texto (mais perto do centro); no desktop fica
          ancorado à direita, numa moldura com friso dourado fino — leitura
          de "fotografia emoldurada", a mesma linguagem de joalheria da
          referência do cliente, em vez de tentar fingir uma foto larga que
          o material de origem (retrato) não tem. */}
      <div className="absolute inset-0 md:hidden" aria-hidden>
        <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="h-full w-full object-contain object-[75%_center]">
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-areia-50 via-areia-50/80 to-areia-50/20" />
      </div>

      <div className="absolute inset-y-6 right-6 hidden w-[44%] overflow-hidden rounded-sm shadow-glow ring-1 ring-sol/40 md:block">
        <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="h-full w-full object-cover object-top">
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        {/* friso dourado fino por dentro da moldura */}
        <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-sol/60" aria-hidden />
      </div>
      <div className="absolute inset-y-6 right-6 hidden w-[44%] bg-gradient-to-r from-areia-50 via-areia-50/10 to-transparent md:block" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-24">
        <div key={active} className="flex max-w-[480px] flex-col gap-4 animate-[heroFade_0.6s_ease-out] pl-8 md:pl-16">
          <span className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-terra/80">
            <span className="h-1.5 w-1.5 rounded-full bg-sol pulse-dot" aria-hidden />
            {slide.kicker}
          </span>
          <h1 className="whitespace-pre-line text-pretty font-display text-[38px] leading-[1.05] text-terra md:text-[54px]">
            {slide.title}
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-tinta/75">{slide.body}</p>

          <div className="flex items-center gap-3 pt-1">
            <span className="h-px w-9 bg-gradient-to-r from-mar to-sol" aria-hidden />
            <span className="text-[13px] text-mar">Peças pensadas pro seu verão inteiro</span>
          </div>

          <div className="relative mt-2 w-fit">
            <Link
              href={slide.href}
              className="group group/cta relative inline-flex h-[52px] items-center overflow-hidden rounded-full bg-mar px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <span className="relative z-[1]">{slide.cta}</span>
              <span className="absolute inset-0 -z-0 bg-mar-700 opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100" aria-hidden />
              <span className="shimmer-sweep" aria-hidden />
            </Link>
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-sol" aria-hidden />
          </div>

          <div className="mt-1 flex gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Ver destaque ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${s.dot}`}
                style={{ width: i === active ? 22 : 8, opacity: i === active ? 1 : 0.5 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* pista de rolagem — toque discreto, some sozinha ao primeiro scroll
          via o próprio ciclo de vida do componente (não precisa de JS: é só
          decorativa e unobtrusive o bastante pra ficar sempre). */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-mar/50 md:flex" aria-hidden>
        <span>Role</span>
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-mar/50 to-transparent" />
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.38a9.87 9.87 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
    </svg>
  );
}
