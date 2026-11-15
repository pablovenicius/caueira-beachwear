'use client';
import { useRef } from 'react';

const TESTIMONIALS = [
  { text: 'Comprei o Sol Poente no M e serviu perfeito. O tecido é grosso, não marca e a cor é ainda mais linda pessoalmente.', name: 'Mariana R.', city: 'Salvador', bought: 'Biquíni Sol Poente · M' },
  { text: 'Poder comprar e trocar sem burocracia mudou tudo pra mim. Chegou em 2 dias.', name: 'Juliana S.', city: 'Recife', bought: 'Biquíni Maré Alta · P' },
  { text: 'O maiô é de outro nível. Acabamento impecável e a proteção UV fez diferença no fim de semana inteiro de sol.', name: 'Camila T.', city: 'Florianópolis', bought: 'Maiô Caueira · G' },
  { text: 'Atendimento atencioso na troca, sem burocracia. Já estou no meu terceiro conjunto.', name: 'Beatriz L.', city: 'Rio de Janeiro', bought: 'Biquíni Coral Dourado · M' },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollLeft += dir * el.clientWidth * 0.8;
  };

  return (
    <section aria-label="Avaliações" className="py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-3xl italic text-tinta">Quem usa, ama</h2>
            <p className="text-[15px] text-tinta/60">4,9 de 5 em 1.284 avaliações</p>
          </div>
          <div className="flex gap-2">
            <button aria-label="Avaliação anterior" onClick={() => scroll(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-areia-300 text-lg text-tinta/70 transition hover:border-sol-700 hover:text-sol-700">‹</button>
            <button aria-label="Próxima avaliação" onClick={() => scroll(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-areia-300 text-lg text-tinta/70 transition hover:border-sol-700 hover:text-sol-700">›</button>
          </div>
        </div>

        <div ref={ref} className="flex gap-4 overflow-x-auto pb-1.5 [scroll-behavior:smooth] [scroll-snap-type:x_mandatory]">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex w-[84%] flex-none scroll-ml-0 flex-col gap-4 rounded-sm border border-areia-300 bg-white p-6 [scroll-snap-align:start] md:w-[340px]">
              <div className="text-sol" aria-label="5 estrelas">★★★★★</div>
              <blockquote className="text-pretty text-[15px] leading-relaxed text-tinta">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-auto flex flex-col gap-0.5 text-sm">
                <strong className="font-medium text-tinta">{t.name} · {t.city}</strong>
                <span className="text-tinta/55">{t.bought}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
