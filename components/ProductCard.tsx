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
    <article className="group flex min-w-0 flex-col gap-3">
      <div className="relative aspect-product overflow-hidden rounded-sm bg-areia-200">
        <Link href={`/produto/${product.id}`} aria-label={`Ver ${product.name}`}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="h-full w-full bg-areia-300" />
          )}
        </Link>

        {product.tag && (
          <span className="absolute left-3 top-3 rounded-sm bg-areia-50 px-2.5 py-1 text-xs text-tinta/80">
            {product.tag}
          </span>
        )}

        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-tinta/85 py-2 text-center text-xs text-areia-50">Esgotado</span>
        ) : (
          <>
            <button type="button" onClick={() => setQuickOpen((v) => !v)}
              aria-expanded={quickOpen} aria-label={`Compra rápida: ${product.name}`}
              className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-areia-50 text-tinta opacity-100 transition hover:bg-terra hover:text-white md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100">
              <BagIcon />
            </button>
            {quickOpen && (
              <div className="absolute inset-x-3 bottom-16 flex flex-col gap-2.5 rounded-sm bg-areia-50 p-3 shadow-[0_8px_24px_rgba(42,31,22,0.18)]">
                {colors.length > 1 && (
                  <div role="group" aria-label="Escolha a cor" className="flex gap-1.5">
                    {colors.map((c) => (
                      <button key={c.name} type="button" title={c.name} aria-pressed={activeColor?.name === c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`h-7 w-7 rounded-full border-2 ${activeColor?.name === c.name ? 'border-tinta' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                )}
                <div role="group" aria-label="Escolha o tamanho" className="flex gap-1.5">
                  {SIZES.map((s: Size) => {
                    const stock = activeColor?.sizes.get(s) ?? 0;
                    return (
                      <button key={s} disabled={stock === 0}
                        onClick={() => { if (activeColor) { add(product, s, activeColor.name); setQuickOpen(false); } }}
                        className="h-11 flex-1 rounded-sm border border-areia-300 text-sm font-medium hover:border-tinta disabled:cursor-not-allowed disabled:opacity-30">
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] text-tinta"><Link href={`/produto/${product.id}`}>{product.name}</Link></h3>
        <p className="font-medium text-tinta">{brl(product.price)}</p>
        <p className="text-sm text-tinta/60">
          {MAX_INSTALLMENTS}x de {brl(product.price / MAX_INSTALLMENTS)} · <span className="text-mar">{brl(product.price * (1 - PIX_DISCOUNT))} no Pix</span>
        </p>
      </div>
    </article>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
