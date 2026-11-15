'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HEROES = [
  {
    kicker: 'Coleção verão',
    title: 'Onde o sol encontra o mar.',
    body: 'Biquínis e maiôs modelados pra se mover com você — do mergulho ao fim de tarde na areia.',
    cta: 'Ver coleção',
    href: '/categoria/lancamentos',
    sky: 'linear-gradient(180deg, #E7B15C 0%, #D98B55 38%, #A8402A 62%, #2E5C50 100%)',
  },
  {
    kicker: 'Maiôs · peça única',
    title: 'Linhas que abraçam o verão.',
    body: 'Caimento sem marcas, tecido que não desbota e proteção UV50+ em cada peça.',
    cta: 'Ver maiôs',
    href: '/categoria/maios',
    sky: 'linear-gradient(180deg, #D9A15C 0%, #B9714F 40%, #83402F 64%, #1C3830 100%)',
  },
  {
    kicker: 'Só esta semana',
    title: 'Promoção de fim de tarde.',
    body: 'Até 15% off em peças selecionadas enquanto durar o estoque.',
    cta: 'Ver promoções',
    href: '/categoria/promocoes',
    sky: 'linear-gradient(180deg, #E3C077 0%, #C07A4D 42%, #8A3A28 66%, #2E5C50 100%)',
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEROES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const hero = HEROES[idx];

  return (
    <section aria-label="Destaques" className="relative flex h-[560px] items-end overflow-hidden md:h-[640px]">
      <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: hero.sky }} />
      {/* horizonte — uma linha clara onde o céu "encontra" o mar, lido de longe como o traço do título */}
      <div className="absolute inset-x-0 bottom-[38%] h-px bg-areia-50/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-tinta/55 via-transparent to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 pb-16">
        <span className="text-sm text-areia-100/90">{hero.kicker}</span>
        <h1 className="max-w-xl text-pretty font-display text-5xl font-normal leading-[1.05] text-areia-50 md:text-[80px] md:leading-[0.98]">
          {hero.title}
        </h1>
        <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-areia-50/85">{hero.body}</p>
        <Link href={hero.href}
          className="mt-2 inline-flex h-[52px] items-center rounded-sm bg-areia-50 px-8 text-sm font-medium text-tinta transition hover:bg-white">
          {hero.cta}
        </Link>

        <div className="mt-4 flex gap-2" role="tablist" aria-label="Banners">
          {HEROES.map((h, i) => (
            <button key={h.title} role="tab" aria-selected={i === idx} aria-label={`Banner ${i + 1}: ${h.title}`}
              onClick={() => setIdx(i)}
              className="h-1 rounded-full bg-areia-50 transition-all duration-300"
              style={{ width: i === idx ? 28 : 10, opacity: i === idx ? 1 : 0.45 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
