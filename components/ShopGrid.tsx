'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';

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
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-8">
        <div>
          <h2 className="font-display text-2xl italic text-tinta md:text-3xl">{title}</h2>
          <p className="mt-1 text-[14px] text-tinta/60 md:text-[15px]">{subtitle}</p>
        </div>
        <span className="text-sm text-tinta/50">{filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}</span>
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1 md:mb-8" role="group" aria-label="Filtrar por peça">
        {PIECE_FILTERS.map((f) => {
          const on = piece === f;
          return (
            <button key={f} type="button" aria-pressed={on} onClick={() => setPiece(f)}
              className={`h-9 flex-none whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition ${
                on ? 'border-terra bg-terra text-white' : 'border-areia-300 bg-white text-tinta/70 hover:border-tinta'
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
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
