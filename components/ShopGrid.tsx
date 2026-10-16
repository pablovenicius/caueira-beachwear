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
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por peça">
        {PIECE_FILTERS.map((f) => {
          const on = piece === f;
          return (
            <button key={f} type="button" aria-pressed={on} onClick={() => setPiece(f)}
              className={`h-[42px] flex-none rounded-full border px-[18px] text-sm transition ${
                on ? 'border-sol-700 bg-sol-700 text-white' : 'border-areia-300 bg-white text-tinta hover:border-sol-700'
              }`}>
              {f}
            </button>
          );
        })}
      </div>

      <div className="mb-8 flex items-end justify-between gap-4 border-b border-areia-300 pb-4">
        <div>
          <h2 className="font-display text-2xl font-normal text-tinta">{title}</h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-tinta/60">{subtitle}</p>
        </div>
        <span className="text-xs text-tinta/60">{filtered.length} peças</span>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-tinta/60">
          {emptyMessage}{' '}
          <button onClick={() => setPiece('Todos')} className="text-sol-700 underline">Limpar filtros</button>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
