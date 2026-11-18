'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';

const PIECE_FILTERS = ['Todos', 'Conjuntos', 'Top', 'Calcinha', 'Maiôs', 'Saídas'] as const;

// Como o esquema atual não guarda estoque por peça (top/calcinha), as tags
// vêm só da categoria — biquínis contam como "conjunto" completo.
function tagsFor(p: Product): string[] {
  if (p.category === 'Biquínis') return ['Conjuntos', 'Top', 'Calcinha'];
  if (p.category === 'Maiôs') return ['Maiôs'];
  return ['Saídas'];
}

export function ShopGrid({
  title,
  subtitle,
  products,
  emptyMessage = 'Nenhuma peça com esses filtros.',
}: {
  title: string;
  subtitle: string;
  products: Product[];
  emptyMessage?: string;
}) {
  const [piece, setPiece] = useState<(typeof PIECE_FILTERS)[number]>('Todos');

  const filtered = useMemo(
    () => (piece === 'Todos' ? products : products.filter((p) => tagsFor(p).includes(piece))),
    [products, piece],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-tinta/60 transition hover:text-terra md:mb-6"
      >
        <BackIcon />
        Início
      </Link>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-8">
        <div>
          <h2 className="font-display text-2xl italic text-tinta md:text-3xl">{title}</h2>
          <p className="mt-1 text-[14px] text-tinta/60 md:text-[15px]">{subtitle}</p>
        </div>
        <span className="text-[13px] uppercase tracking-[0.08em] text-tinta/45">{filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}</span>
      </div>

      <div className="no-scrollbar mb-8 flex gap-6 overflow-x-auto border-b border-areia-200 pb-px md:mb-10" role="group" aria-label="Filtrar por peça">
        {PIECE_FILTERS.map((f) => {
          const on = piece === f;
          return (
            <button key={f} type="button" aria-pressed={on} onClick={() => setPiece(f)}
              className={`flex-none whitespace-nowrap border-b-2 pb-3 text-[12px] font-medium uppercase tracking-[0.1em] transition ${
                on ? 'border-terra text-tinta' : 'border-transparent text-tinta/45 hover:text-tinta/70'
              }`}>
              {f}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-tinta/60">
          {emptyMessage}{' '}
          <button onClick={() => setPiece('Todos')} className="text-terra underline">Limpar filtros</button>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 7) * 60}>
              <ProductCard product={product} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
