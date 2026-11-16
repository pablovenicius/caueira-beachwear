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

      {/* vídeo de fundo — atrás do texto em qualquer tamanho de tela.
          O vídeo é vertical (retrato), então "object-contain" sozinho só
          preenche uma faixa estreita numa seção larga. Por isso tem duas
          camadas do mesmo vídeo: uma borrada e ampliada cobrindo a seção
          inteira de ponta a ponta (garante que a foto realmente fique atrás
          do texto, não só numa tira do lado), e por cima a nítida, inteira
          e sem corte, da cabeça aos pés. Degradê claro por cima pra manter
          o texto legível (mais forte no mobile, mais sutil no desktop). */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl">
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <video autoPlay loop muted playsInline poster="/video/hero-poster.jpg" className="absolute inset-0 h-full w-full object-contain object-[75%_center] md:object-right">
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-areia-50 via-areia-50/80 to-areia-50/20 md:via-areia-50/45 md:to-areia-50/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-24">
        <div key={active} className="flex max-w-[480px] flex-col gap-4 animate-[heroFade_0.6s_ease-out] pl-8 md:pl-16">
          <span className="text-[13px] font-medium text-terra/80">{slide.kicker}</span>
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
              className="inline-flex h-[52px] items-center rounded-full bg-mar px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-mar-700"
            >
              {slide.cta}
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
