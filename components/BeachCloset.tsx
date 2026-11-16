'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Reveal } from '@/components/Reveal';

const DRAWERS = [
  { label: 'Biquínis', hint: 'A coleção toda', href: '/categoria/biquinis' },
  { label: 'Maiôs', hint: 'Peça única', href: '/categoria/maios' },
  { label: 'Saídas de praia', hint: 'Pra depois do mar', href: '/categoria/saidas-de-praia' },
  { label: 'Lançamentos', hint: 'Acabou de chegar', href: '/categoria/lancamentos' },
  { label: 'Promoções', hint: 'Até 15% off', href: '/categoria/promocoes' },
];

/**
 * Primeira tela da home: uma porta de vidro fechada, com a praia por trás.
 * Rolar a página "abre" a porta (progresso ligado ao scroll, não a um
 * clique) e revela a cena — aí entra o closet de praia interativo, com uma
 * gaveta por categoria. Clicar numa gaveta abre ela e leva pra categoria.
 *
 * Tudo construído em CSS/SVG (sem fotos — nenhuma ferramenta de geração de
 * imagem disponível neste ambiente, decisão validada com o cliente). A
 * porta imita uma porta branca com vidraça (como a referência que o
 * cliente trouxe) e o closet usa os tons bege/couro/madeira da segunda
 * referência, em vez de ilustrar algo genérico.
 */
export function BeachCloset() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const beachLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      if (leftRef.current) leftRef.current.style.transform = `translateX(${-p * 102}%)`;
      if (rightRef.current) rightRef.current.style.transform = `translateX(${p * 102}%)`;
      if (glowRef.current) glowRef.current.style.opacity = String(Math.min(1, p * 1.4));
      if (introRef.current) introRef.current.style.opacity = String(Math.max(0, 1 - p * 2.2));
      if (beachLabelRef.current) beachLabelRef.current.style.opacity = String(Math.max(0, p * 2.4 - 1.2));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      {/* ---- tela 1: a porta, pinada enquanto rola ---- */}
      <section ref={wrapRef} aria-label="Abra seu closet de verão" className="relative h-[230vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-noite">
          {/* a praia, sempre atrás da porta */}
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute inset-0 bg-gradient-to-b from-ceu from-0% via-ceu-700 via-55% to-mar to-85%" />
            <div className="absolute left-1/2 top-[14%] h-24 w-24 -translate-x-1/2 rounded-full bg-sol shadow-glow md:h-32 md:w-32" />
            <div
              className="absolute left-1/2 top-[14%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sol/25 blur-2xl md:h-72 md:w-72"
              aria-hidden
            />
            <div className="absolute inset-x-0 top-[62%] h-px bg-areia-50/40" />
            <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-b from-areia-200 to-areia-300" />
            {/* palmeiras simples, só decoração */}
            <PalmIcon className="absolute bottom-[22%] left-[8%] h-28 w-28 text-terra-700/70 md:h-40 md:w-40" />
            <PalmIcon className="absolute bottom-[24%] right-[10%] h-20 w-20 scale-x-[-1] text-terra-700/50 md:h-28 md:w-28" />
          </div>

          {/* luz vazando conforme a porta abre */}
          <div ref={glowRef} className="pointer-events-none absolute inset-0 bg-sol/10 opacity-0" aria-hidden />
          <span className="grain-overlay" aria-hidden />

          {/* texto de boas-vindas, acima da praia revelada */}
          <div
            ref={beachLabelRef}
            className="pointer-events-none absolute inset-x-0 bottom-[30%] z-[5] text-center opacity-0"
          >
            <p className="text-gradient-sunset font-display text-3xl italic md:text-5xl">Bem-vinda ao seu closet</p>
          </div>

          {/* as duas folhas da porta — branca, com vidraça, feito a referência */}
          <div ref={leftRef} className="absolute inset-y-0 left-0 z-10 w-1/2 will-change-transform">
            <DoorLeaf />
          </div>
          <div ref={rightRef} className="absolute inset-y-0 right-0 z-10 w-1/2 will-change-transform">
            <DoorLeaf flip />
          </div>

          {/* conteúdo sobre a porta fechada — some conforme ela abre */}
          <div ref={introRef} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="text-gradient-sunset font-display text-6xl italic md:text-8xl">Caueira</span>
            <p className="max-w-[26ch] text-[15px] leading-relaxed text-areia-50/75 md:text-base">
              Role pra abrir a porta e escolher sua próxima peça de verão.
            </p>
            <div className="mt-4 flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-areia-50/60">
              <span>Role pra abrir</span>
              <span className="h-9 w-px animate-pulse bg-gradient-to-b from-sol/70 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- tela 2: o closet em si, com uma gaveta por categoria ---- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-areia-300 via-areia-100 to-areia-50 pb-20 pt-14 md:pb-28 md:pt-20">
        <span className="grain-overlay" aria-hidden />

        {/* spots de teto, como na referência do closet */}
        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center gap-16 md:gap-28" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-sol/70 shadow-glow blur-[1px]" />
          <span className="h-2 w-2 rounded-full bg-sol/70 shadow-glow blur-[1px]" />
          <span className="h-2 w-2 rounded-full bg-sol/70 shadow-glow blur-[1px]" />
        </div>

        <div className="relative mx-auto max-w-lg px-6 text-center">
          <Reveal className="flex flex-col items-center gap-2">
            <span className="text-[13px] font-medium uppercase tracking-[0.18em] text-terra/80">Seu closet de praia</span>
            <h2 className="font-display text-pretty text-3xl text-tinta md:text-[42px]">Abra uma gaveta pra começar</h2>
          </Reveal>
        </div>

        {/* o armário — tons bege/couro/madeira, como na referência */}
        <Reveal delay={100} className="relative mx-auto mt-10 w-full max-w-md px-6">
          <div className="rounded-sm bg-gradient-to-b from-areia-200 to-areia-100 p-3 shadow-glow ring-1 ring-terra/20 md:p-4">
            <div className="flex flex-col gap-2.5">
              {DRAWERS.map((d, i) => (
                <DrawerRow key={d.label} index={i} {...d} />
              ))}
            </div>
          </div>

          {/* piso de madeira, como no chão da referência */}
          <div
            className="mx-auto mt-2 h-10 w-full rounded-b-sm"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #D6CBB2 0 46px, #C9BB9B 46px 48px), linear-gradient(180deg, #E8E0CF, #D6CBB2)',
              backgroundBlendMode: 'multiply',
            }}
            aria-hidden
          />
        </Reveal>
      </section>
    </>
  );
}

/**
 * Uma folha de porta branca com vidraça — stiles e travessas pintadas,
 * janela central com caixilho em cruz e um leve brilho de vidro, painel
 * inferior sólido. `flip` espelha a folha pra montar o par (maçaneta
 * sempre do lado de dentro, perto da fresta central).
 */
function DoorLeaf({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative h-full w-full ${flip ? 'scale-x-[-1]' : ''}`}>
      {/* stile externo */}
      <div className="absolute inset-y-0 left-0 w-[11%] bg-gradient-to-r from-areia-200 to-areia-50 shadow-[inset_-2px_0_3px_rgba(0,0,0,0.08)]" />
      {/* stile interno, junto da fresta */}
      <div className="absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-areia-200 to-areia-50" />
      {/* travessa superior */}
      <div className="absolute inset-x-0 top-0 h-[5%] bg-areia-50" />
      {/* travessa entre vidraça e painel */}
      <div className="absolute inset-x-0 top-[52%] h-[6%] bg-gradient-to-b from-areia-50 to-areia-100 shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)]" />
      {/* rodapé */}
      <div className="absolute inset-x-0 bottom-0 h-[3%] bg-areia-100" />

      {/* vidraça — deixa a praia (atrás) aparecer, com caixilho em cruz */}
      <div className="absolute left-[11%] right-[5%] top-[5%] h-[47%] overflow-hidden">
        <div className="absolute inset-0 bg-ceu/8" />
        <div className="absolute inset-x-0 top-1/2 h-[3.5%] -translate-y-1/2 bg-areia-50" />
        <div className="absolute inset-y-0 left-1/2 w-[3.5%] -translate-x-1/2 bg-areia-50" />
        {/* brilho de vidro */}
        <div className="absolute -inset-y-6 left-[-15%] w-[26%] rotate-[10deg] bg-areia-50/25 blur-[2px]" />
      </div>

      {/* painel inferior, sólido, com relevo */}
      <div className="absolute inset-x-[11%] bottom-[7%] top-[61%] rounded-[2px] bg-gradient-to-br from-areia-100 to-areia-200 shadow-[inset_0_2px_5px_rgba(0,0,0,0.14),inset_0_-2px_4px_rgba(255,255,255,0.5)]" />

      {/* maçaneta — sempre perto da fresta central */}
      <div className="absolute right-[9%] top-1/2 h-9 w-2.5 -translate-y-1/2 rounded-full bg-sol shadow-glow md:h-12" />
    </div>
  );
}

function DrawerRow({ label, hint, href, index }: { label: string; hint: string; href: string; index: number }) {
  return (
    <Reveal delay={150 + index * 70}>
      <Link
        href={href}
        className="group relative flex items-center justify-between overflow-hidden rounded-[2px] bg-gradient-to-b from-areia-50 to-areia-100 px-5 py-4 ring-1 ring-terra/15 transition-all duration-300 hover:translate-x-2 hover:shadow-glow md:px-6 md:py-5"
      >
        <span className="flex items-center gap-3">
          <LeatherPull />
          <span className="flex flex-col items-start text-left">
            <span className="font-display text-lg text-tinta md:text-xl">{label}</span>
            <span className="text-[12px] text-tinta/55">{hint}</span>
          </span>
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-terra/30 text-terra transition group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-rosa group-hover:to-sol group-hover:text-noite">
          <ArrowIcon />
        </span>
        <span className="shimmer-sweep" aria-hidden />
      </Link>
    </Reveal>
  );
}

/** Puxador de couro — a mesma alça em formato de D da referência do closet. */
function LeatherPull() {
  return (
    <svg aria-hidden width="20" height="28" viewBox="0 0 20 28" fill="none" className="shrink-0">
      <path d="M5 6c0-3 10-3 10 0v9c0 3-10 3-10 0V6Z" fill="#C17F4A" fillOpacity="0.85" />
      <path d="M5 6c0-3 10-3 10 0v9c0 3-10 3-10 0V6Z" stroke="#8A5425" strokeWidth="1" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PalmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M50 95V45" />
      <path d="M50 48c-10-14-28-18-40-12 6 14 24 20 40 12Z" />
      <path d="M50 44c4-16 20-24 34-20-2 16-18 26-34 20Z" />
      <path d="M50 42c-2-16 8-28 22-30 2 16-6 30-22 30Z" />
      <path d="M50 46c10-10 26-10 36-2-8 12-24 14-36 2Z" />
    </svg>
  );
}
