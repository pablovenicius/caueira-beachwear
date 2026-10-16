'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HEROES = [
  { eyebrow: 'Coleção Verão 2027 · Sol de Caueira', title: 'Onde o sol encontra o mar.', cta: 'Ver nova coleção', href: '/categoria/lancamentos', tone: '#7A4A2C' },
  { eyebrow: 'Maiôs · Edição limitada', title: 'Linhas que abraçam o verão.', cta: 'Ver maiôs', href: '/categoria/maios', tone: '#6E4A32' },
  { eyebrow: 'Até 15% off · só esta semana', title: 'Promoção de fim de tarde.', cta: 'Ver promoções', href: '/categoria/promocoes', tone: '#8C5A3A' },
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEROES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const hero = HEROES[idx];

  return (
    <section
      aria-label="Destaques"
      className="relative flex h-[540px] items-end overflow-hidden text-areia-50 transition-colors duration-700 md:h-[620px]"
      style={{
        backgroundColor: hero.tone,
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, transparent 2px 16px)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-cafe/60 via-transparent to-transparent" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 pb-14">
        <span className="text-xs uppercase tracking-[0.24em]">{hero.eyebrow}</span>
        <h1 className="max-w-xl text-pretty font-display text-4xl font-normal leading-tight md:text-[76px] md:leading-[1.02]">
          {hero.title}
        </h1>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={hero.href}
            className="inline-flex h-[52px] items-center rounded-sm bg-terra px-8 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-terra-700">
            {hero.cta}
          </Link>
        </div>
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Banners">
          {HEROES.map((h, i) => (
            <button key={h.title} role="tab" aria-selected={i === idx} aria-label={`Banner ${i + 1}`}
              onClick={() => setIdx(i)}
              className="h-1 rounded-full bg-areia-50 transition-all duration-300"
              style={{ width: i === idx ? 28 : 10, opacity: i === idx ? 1 : 0.5 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
