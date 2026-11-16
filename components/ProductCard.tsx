'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product, Size } from '@/types/product';
import { MAX_INSTALLMENTS, PIX_DISCOUNT, SIZES } from '@/types/product';
import { useCart } from '@/lib/cart-store';
import { brl } from '@/lib/format';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const add = useCart((s) => s.add);

  const colors = useMemo(() => {
    const map = new Map<string, { hex: string; sizes: Map<Size, number> }>();
    for (const v of product.variants) {
      if (!map.has(v.color_name)) map.set(v.color_name, { hex: v.color_hex, sizes: new Map() });
      map.get(v.color_name)!.sizes.set(v.size, v.stock);
    }
    return Array.from(map.entries()).map(([name, { hex, sizes }]) => ({ name, hex, sizes }));
  }, [product.variants]);

  const totalStock = product.variants.reduce((t, v) => t + v.stock, 0);
  const soldOut = !product.active || colors.length === 0 || totalStock === 0;

  const [selectedColor, setSelectedColor] = useState(
    () => colors.find((c) => Array.from(c.sizes.values()).some((s) => s > 0))?.name ?? colors[0]?.name,
  );
  const activeColor = colors.find((c) => c.name === selectedColor) ?? colors[0];

  return (
    <article className="group relative flex min-w-0 flex-col gap-2.5">
      <div className="relative aspect-product overflow-hidden bg-areia-200 outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color] duration-300 group-hover:outline-sol/50">
        <Link href={`/produto/${product.id}`} aria-label={`Ver ${product.name}`}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="h-full w-full bg-areia-300" />
          )}
          <span className="shimmer-sweep" aria-hidden />
        </Link>

        {product.tag && (
          <span className="absolute left-2.5 top-2.5 bg-mar-700/90 px-2.5 py-1 text-[11px] font-semibold text-sol backdrop-blur-sm">
            {product.tag}
          </span>
        )}

        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-tinta/85 py-2 text-center text-xs text-areia-50">Esgotado</span>
        ) : (
          <button type="button" onClick={() => setQuickOpen(true)}
            aria-label={`Compra rápida: ${product.name}`}
            className="absolute bottom-2.5 right-2.5 grid h-10 w-10 place-items-center rounded-full border border-sol/25 bg-mar-700/80 text-areia-50 opacity-100 backdrop-blur-sm transition hover:bg-mar-700 hover:text-sol md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100">
            <BagIcon />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-[14px] text-tinta/85"><Link href={`/produto/${product.id}`}>{product.name}</Link></h3>
        <p className="font-semibold text-tinta">{brl(product.price)}</p>
        <p className="text-[13px] text-tinta/55">
          {MAX_INSTALLMENTS}x de {brl(product.price / MAX_INSTALLMENTS)} · <span className="font-medium text-terra">{brl(product.price * (1 - PIX_DISCOUNT))} no Pix</span>
        </p>
      </div>

      {quickOpen && !soldOut && (
        <>
          <button aria-label="Fechar" onClick={() => setQuickOpen(false)}
            className="fixed inset-0 z-40 bg-tinta/40 md:hidden" />
          <div
            role="dialog" aria-modal aria-label={`Compra rápida: ${product.name}`}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3.5 bg-areia-50 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-sheet
                       md:absolute md:inset-x-3 md:bottom-16 md:z-10 md:gap-2.5 md:p-3 md:shadow-[0_8px_24px_rgba(21,23,27,0.18)]"
          >
            <div className="flex items-center justify-between md:hidden">
              <p className="text-[15px] font-medium text-tinta">{product.name}</p>
              <button aria-label="Fechar" onClick={() => setQuickOpen(false)} className="text-tinta/50">✕</button>
            </div>

            {colors.length > 1 && (
              <div role="group" aria-label="Escolha a cor" className="flex gap-2">
                {colors.map((c) => (
                  <button key={c.name} type="button" title={c.name} aria-pressed={activeColor?.name === c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`h-8 w-8 rounded-full border-2 md:h-7 md:w-7 ${activeColor?.name === c.name ? 'border-sol-700' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            )}
            <div role="group" aria-label="Escolha o tamanho" className="flex gap-2">
              {SIZES.map((s: Size) => {
                const stock = activeColor?.sizes.get(s) ?? 0;
                return (
                  <button key={s} disabled={stock === 0}
                    onClick={() => { if (activeColor) { add(product, s, activeColor.name); setQuickOpen(false); } }}
                    className="h-12 flex-1 border border-areia-300 text-sm font-semibold transition hover:border-sol-700 disabled:cursor-not-allowed disabled:opacity-30 md:h-11">
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
