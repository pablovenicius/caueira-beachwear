'use client';
import { useRef } from 'react';

const TESTIMONIALS = [
  { text: 'Comprei o Sol Poente no M e serviu perfeito. O tecido é grosso, não marca e a cor é ainda mais linda pessoalmente.', name: 'Mariana R.', city: 'Salvador', bought: 'Biquíni Sol Poente · M' },
  { text: 'Poder comprar e trocar sem burocracia mudou tudo pra mim. Chegou em 2 dias.', name: 'Juliana S.', city: 'Recife', bought: 'Biquíni Maré Alta · P' },
  { text: 'O maiô é de outro nível. Acabamento impecável e a proteção UV fez diferença no fim de semana inteiro de sol.', name: 'Camila T.', city: 'Florianópolis', bought: 'Maiô Caueira · G' },
  { text: 'Atendimento atencioso na troca, sem burocracia. Já estou no meu terceiro conjunto.', name: 'Beatriz L.', city: 'Rio de Janeiro', bought: 'Biquíni Coral Dourado · M' },
];

const INSTA = [
  { tone: '#B4694A', handle: '@mari.rios' },
  { tone: '#4F6F73', handle: '@ju.santos' },
  { tone: '#C9A46A', handle: '@camilat' },
  { tone: '#6E4A32', handle: '@bia.l' },
  { tone: '#BBA27E', handle: '@nanda.mar' },
  { tone: '#8C6A4F', handle: '@lu.praia' },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollLeft += dir * el.clientWidth * 0.8;
  };

  return (
    <section aria-label="Avaliações" className="bg-areia-100 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.2em] text-sol-700">Quem usa, ama</span>
            <h2 className="font-display text-2xl font-normal text-tinta md:text-[34px]">4,9 de 5 · 1.284 avaliações</h2>
          </div>
          <div className="flex gap-2">
            <button aria-label="Avaliação anterior" onClick={() => scroll(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-areia-300 text-lg">‹</button>
            <button aria-label="Próxima avaliação" onClick={() => scroll(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-areia-300 text-lg">›</button>
          </div>
        </div>

        <div ref={ref} className="flex gap-4 overflow-x-auto pb-1.5 [scroll-behavior:smooth] [scroll-snap-type:x_mandatory]">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex w-[84%] flex-none scroll-ml-0 flex-col gap-3.5 rounded bg-areia-50 p-6 [scroll-snap-align:start] md:w-[340px]">
              <div className="text-sol" aria-label="5 estrelas">★★★★★</div>
              <blockquote className="text-pretty text-sm leading-relaxed text-tinta">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-auto flex flex-col gap-0.5 text-sm">
                <strong className="font-medium">{t.name} · {t.city}</strong>
                <span className="text-tinta/60">{t.bought}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-normal text-tinta">#UseCaueira</h3>
          <a href="#" className="text-xs uppercase tracking-wider">@caueirabeachwear</a>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {INSTA.map((i) => (
            <div key={i.handle} className="relative aspect-square overflow-hidden rounded-sm"
              style={{
                backgroundColor: i.tone,
                backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, transparent 2px 16px)',
              }}>
              <span className="absolute bottom-2 left-2 font-mono text-[10px] text-white/85">{i.handle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
